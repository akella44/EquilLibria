FROM python:3.10-slim

WORKDIR /app


COPY requirements.txt /app/

RUN pip install --no-cache-dir -r requirements.txt

COPY . /app/

ENV PYTHONUNBUFFERED=1

EXPOSE 8001

ENTRYPOINT ["/entrypoint.sh"]
CMD ["python3", "src\router.py"]
