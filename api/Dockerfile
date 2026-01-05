FROM python:3.11-slim-bookworm

WORKDIR /app

COPY api/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY api/src /app/src
COPY api/data /data

ENV FLASK_APP=/app/src/app.py
ENV PYTHONUNBUFFERED=1

CMD ["flask", "run", "--debug",  "--host=0.0.0.0", "--port=5000"]