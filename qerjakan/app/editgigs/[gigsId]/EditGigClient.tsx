"use client";
import ImageUpload from "@/app/components/inputs/ImageUpload";
import { SafeService } from "@/app/types";
import { Service } from "@prisma/client";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import Input from "@/app/components/inputs/Input";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

interface EditGigProps {
  data: Service | null;
}

const EditGigClient: React.FC<EditGigProps> = ({ data }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [gigs, setGigs] = useState(data)

  useEffect(() => {
    setGigs(data);
  });
  console.log("data", gigs)
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      title: '',
      id: data?.id,
      description: '',
      image: '',
      price: '',
      deliveryTime: '',
      revisions: '',
    },
  });
  const image = watch("image");

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    const res =axios
      .patch("/api/editgigs", data)
      .then((res) => {
        if(res.data.statusCode === 200){
          Swal.fire({
            icon: "success",
            title: res.data.message,
            showConfirmButton: false,
            timer: 1500,
          });
          reset();
          router.refresh();
        }
        else if(res.data.statusCode === 401){
          Swal.fire({
            icon: "error",
            title: res.data.message,
            showConfirmButton: false,
            timer: 1500,
          });
          router.push('/')
        }
        else{
          Swal.fire({
            icon: "error",
            title: res.data.message,
            showConfirmButton: false,
            timer: 1500,
          });
          router.refresh()
        }
        
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  return (
    <div className="max-w-[1640px] py-4 grid lg:grid-cols-2 lg:px-8 ">
      <div className=" flex justify-center px-4">
        <div className="w-full h-full">
          <p className="font-semibold text-2xl">Update Image</p>
          <ImageUpload
            onChange={(value) => setCustomValue("image", value)}
            value={image}
            src={data?.image}
          />
        </div>
      </div>
      <div className="px-4">
        <p className="font-semibold text-2xl">Update Info Gigs</p>
        <div className="flex flex-col gap-4">
          <div>
            <p>Title</p>
            <Input
              id="title"
              label={gigs?.title || ""}
              disabled={isLoading}
              register={register}
              errors={errors}
              required
            />
          </div>
          <div>
            <p>Description</p>
            <textarea
              className="textarea textarea-bordered textarea-md w-full h-44 "
              onChange={(e) => setCustomValue("description", e.target.value)}
              placeholder={gigs?.description}
            ></textarea>
          </div>
          <div>
            <p>Days Delivery</p>
            <Input
              id="deliveryTime"
              label={String(gigs?.deliveryTime) + " Days Delivery" || ""}
              disabled={isLoading}
              register={register}
              errors={errors}
              required
            />
          </div>
          <div>
            <p>Price</p>
            <Input
              id="price"
              label={"Price " + String(gigs?.price) + "$" || ""}
              disabled={isLoading}
              register={register}
              errors={errors}
              required
            />
          </div>
          <div>
            <p>Revision</p>
            <Input
              id="revisions"
              label={String(gigs?.revisions) || ""}
              disabled={isLoading}
              register={register}
              errors={errors}
              required
            />
          </div>

          <button onClick={handleSubmit(onSubmit)} className="btn btn-success text-white">Update Gigs</button>
        </div>
      </div>
    </div>
  );
};

export default EditGigClient;
