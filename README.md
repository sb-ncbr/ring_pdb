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

### Web app

Dev

```bash
npm run dev
```

Prod

```bash
npx vite build --mode production
npm run preview
```

### API

Install deps

```bash
python -m venv venv
. venv/bin/activate
pip install -r requirements.txt
```

Create config file

```bash
cat config_example.py > config.py
```

Run server

```bash
python app.py
```

### Docker

```bash
docker-compose up --build --watch
```