FROM python:3.9.0-alpine

WORKDIR /app
COPY ./backend /app/backend
COPY ./frontend/build /app/frontendbuild
COPY ./start_backend.py /app/
COPY ./requirements.txt /app/

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN pip install --upgrade pip
COPY ./requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt 

CMD ["python", "start_backend.py"]
