import React, { FC, useState } from 'react';

interface UploadImageProps {
  onImageUpload: (image: File) => void;
}

const UploadImage: FC<UploadImageProps> = ({ onImageUpload }) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedImage(files[0]);
      onImageUpload(files[0]);
    }
  };

  return (
    <div>
      <input accept="image/*" onChange={handleFileChange} type="file" />
      {selectedImage && (
        <div>
          <p>Selected Image:</p>
          <img
            alt="Selected"
            src={URL.createObjectURL(selectedImage)}
            style={{ maxWidth: '100%' }}
          />
        </div>
      )}
    </div>
  );
};

export default UploadImage;
