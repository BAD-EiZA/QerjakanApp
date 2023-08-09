"use client";
import cloudinaryConfig from "../../../cloudinary.config";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useCallback } from "react";
import { TbPhotoPlus } from "react-icons/tb";

declare global {
  var cloudinary: any;
}

const uploadPreset = "ogh3dpkf";

interface ImageUploadProps {
  onChange: (value: string) => void;
  value: string;
  src?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onChange, value, src }) => {
  const handleUpload = useCallback(
    (result: any) => {
      onChange(result.info.secure_url);
    },
    [onChange]
  );
 
  return (
    <CldUploadWidget
      onUpload={handleUpload}
      uploadPreset="ogh3dpkf"
      key="AT0elXDQhA9ogz1SaPtcDIG0g-I" 
      options={{
        maxFiles: 1,
      }}
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
              h-96
              gap-4
              text-neutral-600
            "
          >
            <TbPhotoPlus size={50} />
            <div className="font-semibold text-lg">Click to upload</div>
            {value ? (
              <div
                className="
              absolute inset-0 w-full h-full"
              >
                <Image
                  fill
                  style={{ objectFit: "cover" }}
                  src={value || ''}
                  alt="House"
                />
              </div>
            ) : (
              <div
                className="
              absolute inset-0 w-full h-full"
              >
                <Image
                  fill
                  style={{ objectFit: "cover" }}
                  src={src || "https://media.tenor.com/GlU1UCU5-vkAAAAM/work-nodding-off.gif"}
                  alt="House"
                  className=" opacity-40 brightness-50"
                />
              </div>
            )}
            
          </div>
        );
      }}
    </CldUploadWidget>
  );
};

export default ImageUpload;
