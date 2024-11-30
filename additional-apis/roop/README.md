curl -X POST http://127.0.0.1:5000/swap \
    -F "source=@/path/to/source/image.jpg" \
    -F "target=@/path/to/target/image.jpg" \
    --output output_image.jpg
