import { storage } from '@root/firebase.config';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

// import { useImageContext } from "@/components/Context/ImageContext";
import useImageStore from '../../store/ImageStore';

export const UploadFile = ({ className }: { className: string }) => {
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  // const instanceRef = useRef(Math.random());
  const { setSelectedLogo } = useImageStore();
  const [logo, setLogo] = useState<string | null>(null);
  const [logoName, setLogoName] = useState<string | null>(null);

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setLogoName(file.name);
      const storageRef = ref(storage, `logos/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          console.error('Upload failed:', error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.info('Thumbnail available at', downloadURL);
            setLogo(downloadURL);
            setSelectedLogo(downloadURL);
          });
        },
      );
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setLogo(null);
    setUploadProgress(0);
  };

  const handleFileUpload = () => {
    // Simulating file upload with a delay
    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        const newProgress = prevProgress + 20;
        if (newProgress >= 100) {
          clearInterval(interval);
        }
        return newProgress;
      });
    }, 500);
  };

  useEffect(() => {
    if (selectedFile) {
      handleFileUpload();
    }
  }, [selectedFile]);

  return (
    <div className="flex flex-col gap-6">
      <div
        className={twMerge(
          className,
          'flex flex-col items-center justify-center w-full h-full p-4 border-2 border-brand-ai-800 rounded-xl cursor-pointer',
        )}
      >
        <div className="flex flex-col items-center space-y-2">
          {logo ? (
            <div className="flex flex-row items-center gap-3">
              <div className="flex items-center border gap-1 p-2 rounded-xl space-x-2">
                {uploadProgress === 100 ? (
                  <Image
                    alt={logoName ?? ''}
                    className="w-20 h-20 rounded"
                    height={80}
                    src={logo ?? ''}
                    width={80}
                  />
                ) : (
                  <div className="relative w-52 h-2 bg-gray-200 rounded">
                    <div
                      className="absolute top-0 left-0 h-2 bg-brand-ai-100 rounded"
                      style={{
                        width: `${uploadProgress}%`,
                      }}
                    />
                  </div>
                )}
                <button
                  className="text-xs text-black"
                  onClick={handleRemoveFile}
                  type="button"
                ></button>
              </div>
            </div>
          ) : (
            <>
              <label
                className="text-blue-500 border-2 text-xs border-brand-ai-100 cursor-pointer rounded-xl py-1 px-4 hover:text-white hover:bg-brand-ai-100"
                htmlFor="fileInput"
              >
                Upload Logo
              </label>
              <input className="sr-only" id="fileInput" onChange={handleLogoChange} type="file" />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
