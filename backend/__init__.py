import subprocess
import sys
import os

# Function to run shell commands
def run_command(command):
    try:
        subprocess.check_call(command, shell=True)
    except subprocess.CalledProcessError as e:
        print(f"Error occurred: {e}")
        sys.exit(1)

# Step 1: Create a virtual environment
venv_name = "venv"  # Name of the virtual environment
run_command(f"bash post_start.sh")
run_command(f"python -m venv {venv_name}")

# Step 2: Install dependencies from requirements.txt
# Determine the path to the pip executable inside the virtual environment
pip_executable = os.path.join(venv_name, 'Scripts' if os.name == 'nt' else 'bin', 'pip')
run_command(f"{pip_executable} install -r requirements.txt")

# Step 3: Run the application
# Determine the path to the Python executable inside the virtual environment
python_executable = os.path.join(venv_name, 'Scripts' if os.name == 'nt' else 'bin', 'python')
run_command(f"{python_executable} app.py")

print("Application started successfully.")
