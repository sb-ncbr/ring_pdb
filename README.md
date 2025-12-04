<div align="center">
  <br>
  <br>
  <a href="https://github.com/victoria-dos/ring_web">
    <img src="frontend/assets/Logo.svg" alt="RingWeb" width="220">
  </a>
  <br>
  <br>
</div>

## How to run

### Development

```bash
RINGWEB_DATA=$(pwd)/api/src/data docker compose -f ./docker/docker-compose.yml up --build --watch
```

### Production on local machine
```bash
echo "VITE_API_URL=/api" > frontend/.env.production.local
RINGWEB_DATA=$(pwd)/api/src/data docker compose -f ./docker/docker-compose-production-local.yml up --build
```

### Production 
```bash
RINGWEB_DATA=$(pwd)/api/src/data docker compose -f ./docker/docker-compose-production-local.yml -f ./docker/docker-compose.production.yml up --build

```
