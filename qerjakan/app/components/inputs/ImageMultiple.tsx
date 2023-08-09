"use client";
import cloudinaryConfig from "../../../cloudinary.config";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useCallback, useState } from "react";
import { TbPhotoPlus } from "react-icons/tb";

declare global {
  var cloudinary: any;
}

const uploadPreset = "ogh3dpkf";

interface ImageUploadProps {
  onChange: (value: string[]) => void;
  value: string[];
}

const ImageMultiple: React.FC<ImageUploadProps> = ({ onChange, value }) => {
  const [uploadedImages, setUploadedImages] = useState<string[]>(value);
  const handleUpload = useCallback(
    (result: any) => {
      const imageUrl = result.info.secure_url;
      setUploadedImages((prevImages) => [...prevImages, imageUrl]);
      onChange([...uploadedImages, imageUrl]);
    },
    [onChange, uploadedImages]
  );

  const handleRemoveImage = useCallback(
    (imageUrl: string) => {
      const updatedImages = uploadedImages.filter(
        (image) => image !== imageUrl
      );
      setUploadedImages(updatedImages);
      onChange(updatedImages);
    },
    [onChange, uploadedImages]
  );
  console.log("upload image", value);
  return (
    <CldUploadWidget
    // Replace with your Cloudinary cloud name
      key="AT0elXDQhA9ogz1SaPtcDIG0g-I"
      onUpload={handleUpload}
      uploadPreset="ogh3dpkf"
      options={{
        maxFiles: 3,
      }}
      
      
      onOpen={()=> onChange([])}
    >
      {({ open }) => {
        return (
          <div
            onClick={() => open?.()}
            className="
              relative
              cursor-pointer
              hover:opacity-70
              transition
              border-dashed 
              border-2 
              p-20 
              border-neutral-300
              flex
              flex-col
              justify-center
              items-center
              gap-4
              text-neutral-600
            "
          >
            <TbPhotoPlus size={50} />
            <div className="font-semibold text-lg">Click to upload</div>
            {value && (
              <>
                {value.map((img: any) => (
                  <>
                    {img === null ? (
                      <div
                      key={img.id}
                      className="
              absolute inset-0 w-full h-full"
                    >
                      <Image
                        fill
                        style={{ objectFit: "cover" }}
                        src="https://media.tenor.com/GlU1UCU5-vkAAAAM/work-nodding-off.gif"
                        alt="Image"
                      />
                    </div>
                    ) : (
                      <div
                        key={img.id}
                        className="
                absolute inset-0 w-full h-full"
                      >
                        <Image
                          fill
                          style={{ objectFit: "cover" }}
                          src={img}
                          alt="Image"
                        />
                      </div>
                    )}
                  </>
                ))}
              </>
            )}
          </div>
        );
      }}
    </CldUploadWidget>
  );
};

export default ImageMultiple;
