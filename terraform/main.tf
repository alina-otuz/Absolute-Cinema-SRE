terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
}

provider "docker" {
  host = "npipe:////./pipe/dockerDesktopLinuxEngine"
}

resource "docker_network" "app" {
  name = "absolute_cinema_app"
}

resource "docker_volume" "mongo_data" {
  name = "absolute_cinema_mongo_data"
}

resource "docker_volume" "grafana_storage" {
  name = "absolute_cinema_grafana_storage"
}

resource "null_resource" "backend_build" {
  provisioner "local-exec" {
    command     = "docker build -t absolute-cinema-backend:latest -f ../Dockerfile .."
    working_dir = path.module
  }

  triggers = {
    dockerfile_checksum = filesha256("${path.module}/../Dockerfile")
    package_checksum    = filesha256("${path.module}/../package.json")
    lockfile_checksum   = filesha256("${path.module}/../package-lock.json")
  }
}

resource "null_resource" "frontend_build" {
  provisioner "local-exec" {
    command     = "docker build -t absolute-cinema-frontend:latest -f ../frontend/Dockerfile ../frontend"
    working_dir = path.module
  }

  triggers = {
    dockerfile_checksum = filesha256("${path.module}/../frontend/Dockerfile")
    package_checksum    = filesha256("${path.module}/../frontend/package.json")
    lockfile_checksum   = filesha256("${path.module}/../frontend/package-lock.json")
  }
}

resource "docker_image" "mongo" {
  name = "mongo:6.0"
}

resource "docker_image" "node_exporter" {
  name = "prom/node-exporter:latest"
}

resource "docker_image" "prometheus" {
  name = "prom/prometheus:latest"
}

resource "docker_image" "grafana" {
  name = "grafana/grafana:latest"
}

resource "docker_container" "mongo" {
  name    = "absolute_cinema_mongo"
  image   = docker_image.mongo.image_id
  restart = "unless-stopped"

  networks_advanced {
    name = docker_network.app.name
  }

  ports {
    internal = 27017
    external = 27017
  }

  mounts {
    target = "/data/db"
    source = docker_volume.mongo_data.name
    type   = "volume"
  }
}

resource "docker_container" "node_exporter" {
  name    = "absolute_cinema_node_exporter"
  image   = docker_image.node_exporter.image_id
  restart = "unless-stopped"

  networks_advanced {
    name    = docker_network.app.name
    aliases = ["node-exporter"]
  }

  ports {
    internal = 9100
    external = 9100
  }
}

resource "docker_container" "prometheus" {
  name    = "absolute_cinema_prometheus"
  image   = docker_image.prometheus.image_id
  restart = "always"

  networks_advanced {
    name    = docker_network.app.name
    aliases = ["prometheus"]
  }

  command = ["--config.file=/etc/prometheus/prometheus.yml"]

  mounts {
    target    = "/etc/prometheus/prometheus.yml"
    source    = "${path.module}/../prometheus/prometheus.yml"
    type      = "bind"
    read_only = true
  }

  mounts {
    target    = "/etc/prometheus/alert_rules.yml"
    source    = "${path.module}/../prometheus/alert_rules.yml"
    type      = "bind"
    read_only = true
  }

  ports {
    internal = 9090
    external = 9090
  }

  depends_on = [
    docker_container.node_exporter
  ]
}

resource "docker_container" "grafana" {
  name    = "absolute_cinema_grafana"
  image   = docker_image.grafana.image_id
  restart = "always"

  networks_advanced {
    name = docker_network.app.name
  }

  env = [
    "GF_SECURITY_ADMIN_PASSWORD=admin",
    "GF_USERS_ALLOW_SIGN_UP=false"
  ]

  mounts {
    target    = "/etc/grafana/provisioning/datasources"
    source    = "${path.module}/../grafana/provisioning/datasources"
    type      = "bind"
    read_only = true
  }

  mounts {
    target    = "/etc/grafana/provisioning/dashboards"
    source    = "${path.module}/../grafana/provisioning/dashboards"
    type      = "bind"
    read_only = true
  }

  mounts {
    target = "/var/lib/grafana"
    source = docker_volume.grafana_storage.name
    type   = "volume"
  }

  ports {
    internal = 3000
    external = 3000
  }

  depends_on = [
    docker_container.prometheus
  ]
}

resource "docker_container" "backend" {
  name    = "absolute_cinema_backend"
  image   = "absolute-cinema-backend:latest"
  restart = "always"

  networks_advanced {
    name    = docker_network.app.name
    aliases = ["backend"]
  }

  env = [
    "PORT=3001",
    "NODE_ENV=production",
    "MONGO_URI=mongodb://absolute_cinema_mongo:27017/absolute_cinema",
    "JWT_SECRET=your-secret-key-here",
    "CORS_ORIGIN=http://localhost:3001,http://localhost:80"
  ]

  ports {
    internal = 3001
    external = 3001
  }

  depends_on = [
    docker_container.mongo,
    null_resource.backend_build
  ]
}

resource "docker_container" "frontend" {
  name    = "absolute_cinema_frontend"
  image   = "absolute-cinema-frontend:latest"
  restart = "always"

  networks_advanced {
    name = docker_network.app.name
  }

  ports {
    internal = 80
    external = 80
  }

  depends_on = [
    docker_container.backend,
    null_resource.frontend_build
  ]
}
