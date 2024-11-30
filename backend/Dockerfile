FROM python:3.9-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install torch-directml torchvision torchaudio
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --upgrade pip

COPY . .

EXPOSE 5000

ENV FLASK_APP=app.py

CMD ["python3", "app.py"]