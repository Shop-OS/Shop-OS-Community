# API

## 1. Authentication API (`routes/auth.py`)

### Purpose
The Authentication API ensures secure access to the other APIs in the repository. It handles user authentication and also manages credits.

### Endpoints
- **Registration**: Create user accounts with email or google and an account verification email.
- **Resend Emails**: Resend verification emails.
- **Verify Users**: Verify user accounts based on the token from verification email link.
- **Login**: Authenticate users by verifying credentials and returning access tokens.


## 2. ComfyUI Communication API (`routes/comfy.py`)

### Purpose
This API facilitates the interaction between frontend and ComfyUI.

### Endpoints
- **Generate Apparel Shoots**: Communicate with ComfyUI with the `apparel shoots` workflow to change the backgrounds of models.
- **Generate Product Background Workflows**: Communicate with ComfyUI with the `product background change` workflow to change the backgrounds of products.
- **Background Changer**: Communicate with ComfyUI with the `brushnet` workflow to generate an image.
- **3D Generation with SV3D**: Communicate with ComfyUI with the `SV3D` workflow to generate a 3D GIF from an image.
- **Description Generation with MoonDream**: Automatically generate product descriptions in ComfyUI using MoonDream.
- **Magic Fixing Apparel Shoots**: Communicate with ComfyUI with the `magic fix` workflow to fix imperfections in an image.


## 3. Integration with External Tools

### Purpose
Extend the capabilities of House of Models' APIs by integrating with third-party tools for additional functionalities.

### Tools
- **Tripo3D API**: Convert images into 3D models by communicating with the Tripo3D service.
- **IDM VTON API**: Generate drape diffusion images that simulate clothes on models, using the IDM VTON technology.


## 4. Comfy Workflows

### Purpose

### Workflows
- **Apparel Shoots**

    This agent allows users to change the background as well as the person wearing the apparel. Users can generate outputs of people with different ethnicities and the same apparel worn against different backgrounds. The workflow for this agent is as follows:

    ### Workflow
    1. Segmentation
      - The agent uses the Segment Anything Model (SAM) to segment the desired garment from the uploaded image.
      - Model name: "sam_vit_b_01ec64.pth"
    2. ControlNet
      - The agent utilizes ControlNets to assist the inpainting process by incorporating additional inputs such as Pose Maps, Canny Edge Maps, and Depth Maps.
      - Model names:
        - Canny ControlNet: control-lora-canny-rank256.safetensors
        - Depth ControlNet: control-lora-depth-rank256.safetensors
        - Pose ControlNet: OpenPoseXL2.safetensors
      - Config
          - Canny ControlNet: 
              {"inputs": {
                    "strength": 1,
              }
          - Depth ControlNet: 
              {"inputs": {
                    "strength": 1,
              }
    3. LoRAs (Low-Rank Adaptation)
      - Uses LoRAs to get more fine tuned output of the backgrounds and the people to make it more realistic.
      - Custom-trained LoRAs are also used to generate backgrounds of specific and desired choices.
      - LoRA models:
          - Blur Control Model: blur_control_xl_v1.safetensors
          - LoRAs for realistic creation: epiCPhotoXL.safetensors, epiCRealismHelper.safetensors
          - Background: CafesandBars.safetensors
    4. Inpainting
      - The agent employs realistic Stable Diffusion Models, such as epicRealism, to paint the area outside the segmented region according to the given prompt.
      - Checkpoint name: epicrealismXL_v4Photoreal.safetensors
      - KSampler Config:
          {"inputs": {
                "seed": 537728872980780,
                "steps": 30,
                "cfg": 8.5,
                "sampler_name": "dpmpp_2m",
                "scheduler": "karras",
                "denoise": 0.8,
              }
          }
    5. Image Compositing
      - This step helps the agent generate consistent outputs without affecting the details of the uploaded apparel.
    6. Face and Hand Detailers
      - This component aids in fixing faces and hands separately, as Stable Diffusion models can sometimes be inaccurate and hallucinate when generating these features.
      - Comfy Node name: FaceDetailer

    ### Usage
    To use this agent, follow these steps:
    - Upload an image of the desired apparel.
    - Provide the prompt or description for the desired background and ethnicity of the person wearing the apparel.
    - The agent will process the image and generate an output with the requested changes.


- **Product Background Change**:

  This agent allows users to generate high-quality backgrounds for uploaded product images. The workflow for this agent is as follows:

  ### Workflow:
  1. Segmentation
    - The agent uses the Segment Anything Model (SAM) to segment the product from the uploaded image.
    - Model name: "sam_vit_b_01ec64.pth"
  2. Controlnet
    - Uses ControlNet to assist the inpainting process by incorporating additional inputs such as Pose Maps, Canny Edge Maps, and Depth Maps.
    - Model names:
        - Canny ControlNet: control-lora-canny-rank256.safetensors
        - Depth ControlNet: control-lora-depth-rank256.safetensors
    - Config
        - Canny ControlNet: 
            {"inputs": {
                  "strength": 1,
                  "start_percent": 0,
                  "end_percent": 0.8,
            }
        - Depth ControlNet: 
            {"inputs": {
                  "strength": 1,
                  "start_percent": 0,
                  "end_percent": 0.8,
            }
  3. LoRAs (Low-Rank Adaptation)
    - Uses LoRAs to get more fine tuned output of the backgrounds and make it more realistic.
    - Custom-trained LoRAs are also used to generate backgrounds of specific and desired choices.
    - LoRA models:
        - Background: ProductBackgrounds.safetensors
  4. Inpainting
    - The agent employs a Stable Diffusion Model optimized for product images to paint the area outside the segmented region according to the given prompt.
    - Checkpoint name: productBackgroundXL.safetensors
    - KSampler Config:
      { "inputs": {
            "add_noise": "enable",
            "steps": 30,
            "cfg": 5.5,
            "sampler_name": "dpmpp_sde_gpu",
            "scheduler": "karras",
            "start_at_step": 0,
            "end_at_step": 1000,
            "return_with_leftover_noise": "disable",
          }
      }
  5. Image Compositing
      - This step helps the agent generate consistent outputs without affecting the details of the uploaded product image.

  ### Usage
  To use this agent, follow these steps:
  - Upload an image of the product.
  - Provide the prompt or description for the desired background.
  - The agent will process the image and generate an output with the requested background change.


## 5. Data Management API

### Purpose
Handle the storage and retrieval of inputs and outputs across various API interactions.

### Endpoints
- **Save Input**: Store input data, such as images, required for processing.
- **Fetch Output**: Retrieve results from various workflow operations, such as images or 3D model files.


## 6. Generation Emails Background Worker 

### Purpose
The Generation Emails Background Worker is designed to automate the process of sending emails containing generated content from various workflows. This system operates in the background, interfacing with Amazon SQS to manage email and generation queues efficiently, ensuring guaranteed delivery of generation results to users.

### Endpoints
- **Enqueue Email Jobs**: Add new jobs to the queue, specifying the content to be sent and the recipient's details.
- **Process Email Jobs**: Continuously check the queue for pending jobs and process them by sending out emails with generation results, such as images generated by the workflows.


## Deployment

This repository is deployed in an A100 80GB VM in Azure in the same instance as ComfyUI. The infrastructure also consists of an SQS for managing queues to send generation emails to users. It also utilizes SES to send the emails.

## How to setup and run the API

- Create a virtual environment with `venv`
- Install the requirements with `pip install -r requirements.txt`
- Run `python3 wsgi.py`