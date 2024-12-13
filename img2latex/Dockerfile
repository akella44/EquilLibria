# Используем официальный Python образ на основе Debian Slim
FROM python:3.10.12-slim

# Устанавливаем рабочую директорию
WORKDIR /app

# Устанавливаем необходимые системные зависимости
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        libgl1 \
        libglib2.0-0 \
        libsm6 \
        libxext6 \
        libxrender-dev \
        build-essential \
        python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Обновляем pip, setuptools и wheel до последних версий
RUN pip install --upgrade pip setuptools wheel

# Устанавливаем Cython (если требуется)
RUN pip install cython

# Копируем файл зависимостей в контейнер
COPY requirements.txt /app/

# Устанавливаем зависимости
RUN pip install --no-cache-dir -r requirements.txt

# Копируем остальной код приложения
COPY . /app/

# Устанавливаем переменную окружения для предотвращения буферизации вывода
ENV PYTHONUNBUFFERED=1

# Открываем порт, на котором будет работать приложение
EXPOSE 8001

# Определяем команду запуска приложения
CMD ["python3", "src/router.py"]
