FROM python:3.9.0-alpine

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN pip install --upgrade pip
COPY ./requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt 

CMD ["uvicorn", "backend.main:app", "--reload", "--port", "8000", "--host", "0.0.0.0"]
