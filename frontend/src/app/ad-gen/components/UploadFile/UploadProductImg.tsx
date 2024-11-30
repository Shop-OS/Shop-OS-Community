import { storage } from '@root/firebase.config';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
// import { X } from "phosphor-react";
import { twMerge } from 'tailwind-merge';

// import { useImageContext } from "@/components/Context/ImageContext";
import useImageStore from '../../store/ImageStore';

export const UploadProductImg = ({ className }: { className: string }) => {
  const [uploadImgProgress, setUploadImgProgress] = useState(0);
  const { setSelectedProduct } = useImageStore();
  const [product, setProduct] = useState<string | null>(null);
  const [productName, setProductName] = useState<string | null>(null);

  const handleProductChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      const storageRef = ref(storage, `products/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadImgProgress(progress);
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          console.error('Upload failed:', error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.info('Image available at', downloadURL);
            setProduct(downloadURL);
            setSelectedProduct(downloadURL);
          });
        },
      );
    }
  };

  const handleRemoveFile = () => {
    setSelectedProduct(null);
    setProduct(null);
    setUploadImgProgress(0);
  };

  const handleFileUpload = () => {
    // Simulating file upload with a delay
    const interval = setInterval(() => {
      setUploadImgProgress((prevProgress) => {
        const newProgress = prevProgress + 20;
        if (newProgress >= 100) {
          clearInterval(interval);
        }
        return newProgress;
      });
    }, 500);
  };

  // useEffect(() => {
  //   if (selectedProduct) {
  //     handleFileUpload();
  //   }
  // }, [selectedProduct]);

  return (
    <div className="flex flex-col gap-6">
      <div
        className={twMerge(
          className,
          'flex flex-col items-center justify-center w-full h-full p-4 border-2 border-brand-ai-800 rounded-xl cursor-pointer',
        )}
      >
        <div className="flex flex-col items-center space-y-2">
          {product ? (
            <div className="flex flex-row items-center gap-3">
              <div className="flex items-center border gap-1 p-2 rounded-xl space-x-2">
                {uploadImgProgress === 100 ? (
                  <Image
                    src={product ?? ''}
                    alt={productName ?? ''}
                    className="w-20 h-20 rounded"
                    width={80}
                    height={80}
                  />
                ) : (
                  <div className="relative w-52 h-2 bg-gray-200 rounded">
                    <div
                      className="absolute top-0 left-0 h-2 bg-brand-ai-100 rounded"
                      style={{
                        width: `${uploadImgProgress}%`,
                      }}
                    />
                  </div>
                )}
                <button className="text-xs text-black" onClick={handleRemoveFile}></button>
              </div>
            </div>
          ) : (
            <>
              <label
                htmlFor="fileInputUploadProductImg"
                className="text-blue-500 border-2 text-xs border-brand-ai-100 cursor-pointer rounded-xl py-1 px-4 hover:text-white hover:bg-brand-ai-100"
              >
                Upload Product Image
              </label>
              <input
                type="file"
                id="fileInputUploadProductImg"
                className="sr-only"
                onChange={handleProductChange}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
