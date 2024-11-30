#!/bin/bash

# Stop any existing screen sessions for ComfyUI
screen -S comfyui -X quit

# Stop any existing screen sessions for server
screen -S server -X quit

# Stop any existing screen sessions for llava
screen -S llava -X quit

# Give a little time for processes to terminate
sleep 2

# Navigate to the ComfyUI directory
cd /home/azureuser/workspace/ComfyUI

# Activate the virtual environment
source venv/bin/activate

# Start the first service in a detached screen session
screen -dmS comfyui python3 main.py --listen --highvram
echo "ComfyUI started successfully."
sleep 10

# Deactivate the virtual environment
deactivate

# Navigate to the Server directory
cd ../server

# Activate the virtual environment
source venv/bin/activate

# Start the second service in a detached screen session
screen -dmS server python3 wsgi.py
echo "API started successfully."

sleep 10

# Deactivate the virtual environment
deactivate

# cd ../product-description-llava

# # Activate the virtual environment
# source venv/bin/activate
# export TRANSFORMERS_CACHE=./models/

# # Start the third service in a detached screen session
# screen -dmS llava python3 api.py
# echo "LLAVA started successfully."

# sleep 10

# Deactivate the virtual environment
deactivate

echo "Services started successfully."
