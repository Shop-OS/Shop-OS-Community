#!/bin/bash

# Update package lists
sudo apt update
sudo apt upgrade -y

# Install build-essential package
sudo apt install -y build-essential
sudo apt install ffmpeg -y

# Install specific Python packages
pip install --upgrade pip
pip install insightface==0.7.3
pip install onnxruntime
pip install onnxruntime-gpu

export TRANSFORMERS_CACHE=/workspace/models/