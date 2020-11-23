FROM python:3.9.0-alpine

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN pip install --upgrade pip
COPY ./requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt 

RUN mkdir -p /var/run/gunicorn
CMD ["gunicorn", "gatekeeper.wsgi", "--bind=unix:/var/run/gunicorn/gunicorn.sock"]

