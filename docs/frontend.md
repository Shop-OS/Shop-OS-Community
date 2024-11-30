# Frontend App

The frontend interfaces with various backend APIs to provide a seamless user experience for handling apparel photoshoots, background changing, 3D model generation, and product description enhancements. Each feature is designed to be intuitive and interactive, allowing for high customization and user engagement.

## Features and Workflows

### 1. Apparel Shoots

#### Workflow
- **Image Upload**: Users initiate the process by uploading an apparel image.
- **Mask Generation**: A mask is automatically generated, which users can edit if needed.
- **Model Selection**: Users select the model's ethnicity and gender.
- **Background Selection**: Users pick a suitable background.
- **Image Generation**: The system generates four images of the model with the selected background.
- **Magic Fix**: Users can fix any inconsistencies in the image with magic-fix

### 2. Product Background Changer

#### Workflow
- **Image Upload**: Users upload an image of the product.
- **Background Removal**: The background is removed using PhotoRoom and the product is placed on a canvas.
- **Description Generation**: A description of the product is generated using Moondream.
- **Prop and Background Selection**: Users choose props and a new background for the product.
- **Image Generation**: Four images of the product with the new background and props are generated.

### 3. Text to 3D

#### Workflow
- **Image Addition**: Users can upload an image or use a prompt to generate one via SV3D.
- **3D Generation**: By clicking "Generate," the system creates four 3D outputs using TripoSR, Tripo3D, SV3D, and InstantMesh.

### 4. Product Description Generator

#### Workflow
- **Image Upload**: Users upload a product image.
- **Generate Description**: Users click "Generate" to start the description process.
- **Additional Information**: Optional product features and information can be added.
- **Translation**: The description can be translated into Odia, Hindi, Gujarati, or Bengali.

### 5. Background Changer with Brushnet

#### Workflow
- **Image Upload**: Users upload an image.
- **Background Selection**: A new background is selected.
- **Image Generation**: Four images are generated with the new background.

### 6. Drape Diffusion

#### Workflow
- **Clothing Upload**: Users upload a clothing item image.
- **Model Selection**: A model is chosen or uploaded for the clothing item.
- **Body Selection**: Users specify if the clothing is for the full body, lower body, or upper body.
- **Image Generation**: Four images are generated of the model wearing the clothing item.

## Tech Stack

- **Next.js**: Next.js was the primary development framework for this project,.
- **Typescript**: TypeScript was used to enhance code quality and maintainability through static typing and improved tooling.
- **LobeUI**: LobeUI is used for UI components across the app.
- **Fabric.js**: Fabric.js was instrumental in canvas interaction and image manipulation within the application.
- **Photoroom**: Photoroom is used to remove the background of a product.
- **Google Model Viewer** - Used for viewing the GLB files

## Deployment

The application is deployed on Vercel. CI/CD is setup for `devtest` and  `staging`, hence pushing to those branches will result in automatic deployments. It also has the following analytical tools integrated:
 - Sentry
 - Smartlook
 - Google Analytics

It also uses Firebase for facilitating Google Authentication

## Setting up and Running the App

- The dependencies are installed with `bun install`
- The app is then started with `bun run dev`