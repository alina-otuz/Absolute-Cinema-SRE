# Load Testing

This directory contains a Locust load test for the Absolute Cinema backend.

## Requirements

- Python 3.13+
- Locust (`pip install locust`)

## Run the test

Start the backend and then run:

```bash
cd load-tests
python -m pip install locust
locust -f locustfile.py --host=http://localhost:3001 --headless -u 20 -r 5 -t 1m
```

This will execute a headless load test against the backend API.

## Key SLIs covered

- request success rate for backend traffic
- request latency for public API calls
- overall request throughput
