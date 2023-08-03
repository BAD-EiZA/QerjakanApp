"use client";

import React, { useState } from "react";
import { Profile } from "@prisma/client";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Input from "@/app/components/inputs/Input";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import axios from "axios";
interface DescriptionProps {
  currentProfile: Profile | null;
}

const DescriptionInput: React.FC<DescriptionProps> = ({ currentProfile }) => {
  const [descriptionEditNew, setDescriptionEdit] = useState(false);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      description: currentProfile?.description || "",
    },
  });
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    const res = axios
      .patch("/api/editdescription", data)
      .then((res) => {
        if (res.data.statusCode === 200) {
          Swal.fire({
            icon: "success",
            title: res.data.message,
            showConfirmButton: false,
            timer: 1500,
          });
          reset();
          router.push(`/profiles/${currentProfile?.userId}`)
          setDescriptionEdit(false);
        } else if (res.data.statusCode === 401) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: res.data.message,
          });
          reset();
          router.push("/");
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: res.data.message,
          });
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
        router.refresh();
      });
  };
  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };
  const toggleEditDescription = () => {
    setDescriptionEdit(!descriptionEditNew);
  };
  return (
    <>
      <div className="pb-4">
        <div className="flex justify-between">
          <h1 className=" font-semibold">Description</h1>
          <div onClick={toggleEditDescription}>
            <h2 className="hover:bg-green-400 hover:rounded-md  text-xs border-black hover:text-white flex border rounded-md justify-between items-center cursor-pointer px-2 group">
              (+) Edit Description
            </h2>
          </div>
        </div>
        {descriptionEditNew ? (
          <>
            <Input
              id="description"
              label="Description"
              disabled={isLoading}
              register={register}
              errors={errors}
            />
            <div className="card-actions justify-end py-2">
              <button
                onClick={handleSubmit(onSubmit)}
                className="btn btn-sm btn-accent"
              >
                Update Description
              </button>
            </div>
          </>
        ) : (
          <>
            {currentProfile?.description === null ? (
              <div>No description has been set</div>
            ) : (
              <div>
                <p>{currentProfile?.description}</p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default DescriptionInput;
