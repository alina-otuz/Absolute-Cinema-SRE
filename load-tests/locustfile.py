from locust import HttpUser, task, between

class AbsoluteCinemaUser(HttpUser):
    wait_time = between(1, 3)

    @task(3)
    def list_movies(self):
        self.client.get("/api/movies")

    @task(2)
    def list_showtimes(self):
        self.client.get("/api/showtimes")

    @task(1)
    def root_health(self):
        self.client.get("/")
