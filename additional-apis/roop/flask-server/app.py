import os
import numpy as np
from flask import Flask, request, jsonify, send_file
from PIL import Image
import io

# Import CodeFormer (ensure it is correctly installed and importable)
from codeformer import CodeFormer

import roop.globals
from roop.core import (
    start,
    decode_execution_providers,
    suggest_execution_threads,
)
from roop.processors.frame.core import get_frame_processors_modules
from roop.utilities import normalize_output_path

# Initialize Flask app
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

def initialize_globals():
    roop.globals.source_path = None
    roop.globals.target_path = None
    roop.globals.output_path = None
    roop.globals.headless = False
    roop.globals.frame_processors = []
    roop.globals.keep_fps = False
    roop.globals.keep_frames = False
    roop.globals.skip_audio = False
    roop.globals.many_faces = False
    roop.globals.reference_face_position = 0
    roop.globals.reference_frame_number = 0
    roop.globals.similar_face_distance = 0.6
    roop.globals.temp_frame_format = 'jpg'
    roop.globals.temp_frame_quality = 95
    roop.globals.output_video_encoder = 'libx264'
    roop.globals.output_video_quality = 18
    roop.globals.max_memory = None
    roop.globals.execution_providers = []
    roop.globals.execution_threads = 1
    roop.globals.log_level = 'error'
    roop.globals.det_size = (640, 640)

def swap_face(source_file, target_file, doFaceEnhancer):
    try:
        initialize_globals()

        source_path = os.path.join(app.config['UPLOAD_FOLDER'], "input.jpg")
        target_path = os.path.join(app.config['UPLOAD_FOLDER'], "target.jpg")

        source_image = Image.fromarray(source_file)
        source_image.save(source_path)
        target_image = Image.fromarray(target_file)
        target_image.save(target_path)

        roop.globals.source_path = source_path
        roop.globals.target_path = target_path
        output_path = os.path.join(app.config['UPLOAD_FOLDER'], "output.jpg")
        roop.globals.output_path = normalize_output_path(source_path, target_path, output_path)

        roop.globals.frame_processors = ["face_swapper", "face_enhancer"] if doFaceEnhancer else ["face_swapper"]
        roop.globals.headless = True
        roop.globals.keep_fps = True
        roop.globals.keep_audio = True
        roop.globals.execution_providers = decode_execution_providers(["cpu"])
        roop.globals.execution_threads = suggest_execution_threads()

        print(f"Frame processors: {roop.globals.frame_processors}")
        print(f"Source path: {roop.globals.source_path}")
        print(f"Target path: {roop.globals.target_path}")
        print(f"Output path: {roop.globals.output_path}")
        print(f"Execution providers: {roop.globals.execution_providers}")
        print(f"Execution threads: {roop.globals.execution_threads}")
        print(f"Detection size: {roop.globals.det_size}")

        frame_processors = get_frame_processors_modules(roop.globals.frame_processors)
        for frame_processor in frame_processors:
            print(f"Checking frame processor: {frame_processor}")
            if not frame_processor.pre_check():
                print(f"Pre-check failed for frame processor: {frame_processor}")
                return None

        start()
        return output_path
    except Exception as e:
        print(f"Error during face swap: {e}")
        return None

# New function to upscale an image using CodeFormer
def upscale_image(image_path):
    try:
        codeformer = CodeFormer()  # Initialize CodeFormer instance
        upscaled_image = codeformer.upscale(image_path)  # Upscale the image
        upscaled_image_path = image_path.replace(".jpg", "_upscaled.jpg")
        upscaled_image.save(upscaled_image_path)
        return upscaled_image_path
    except Exception as e:
        print(f"Error during image upscaling: {e}")
        return None

@app.route('/swap', methods=['POST'])
def swap_faces():
    try:
        if 'source' not in request.files or 'target' not in request.files:
            return jsonify({'error': 'Source or target file not found'}), 400

        source_file = request.files['source'].read()
        target_file = request.files['target'].read()
        doFaceEnhancer = request.form.get('doFaceEnhancer', 'false').lower() == 'true'
        upscale = request.form.get('upscale', 'false').lower() == 'true'  # Add option to upscale

        source_image = Image.open(io.BytesIO(source_file))
        target_image = Image.open(io.BytesIO(target_file))

        output_path = swap_face(np.array(source_image), np.array(target_image), doFaceEnhancer)

        if output_path and os.path.exists(output_path):
            if upscale:
                output_path = upscale_image(output_path)  # Upscale the image if requested
                if not output_path:
                    return jsonify({'error': 'Image upscaling failed'}), 500

            return send_file(output_path, mimetype='image/jpeg')
        else:
            return jsonify({'error': 'Face swap failed'}), 500
    except Exception as e:
        print(f"Error processing request: {e}")
        return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(debug=True)
