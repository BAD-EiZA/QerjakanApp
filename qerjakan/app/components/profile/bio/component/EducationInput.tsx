"use client";

import React, { useState } from "react";
import { Profile } from "@prisma/client";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Input from "@/app/components/inputs/Input";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import axios from "axios";
import useAllCollege from "@/app/hooks/useAllCollege";
import useAllCollegeTitle from "@/app/hooks/useAllCollegeTitle";
import useAllCollegeMajor from "@/app/hooks/useAllCollegeMajor";
import Selector from "@/app/components/inputs/Selector";
interface DescriptionProps {
  currentProfile: Profile | null;
}

const EducationInput: React.FC<DescriptionProps> = ({ currentProfile }) => {
  const [educationEditNew, setEducationEdit] = useState(false);
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
        college_name: currentProfile?.college_name ||"",
        college_title: currentProfile?.college_title|| "",
        college_major: currentProfile?.college_major|| "",
    },
  });
  const { data: AllCollege = [] } = useAllCollege();
  const { data: AllCollegeTitle = [] } = useAllCollegeTitle();
  const { data: AllCollegeMajor = [] } = useAllCollegeMajor();
  const optionsCollegeTitle = AllCollegeTitle.map((college_title: any) => ({
    value: college_title.college_title,
    label: college_title.college_title,
  }));
  const optionsCollegeMajor = AllCollegeMajor.map((college_major: any) => ({
    value: college_major.college_major,
    label: college_major.college_major,
  }));
  const optionsColleges = AllCollege.map((college: any) => ({
    value: college.college_name,
    label: college.college_name,
  }));
  const college_name = watch("college_name");
  const college_title = watch("college_title");
  const college_major = watch("college_major");
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    const res = axios
      .patch("/api/editeducation", data)
      .then((res) => {
        if (res.data.statusCode === 200) {
          Swal.fire({
            icon: "success",
            title: res.data.message,
            showConfirmButton: false,
            timer: 1500,
          });
          reset();
          router.push(`/profiles/${currentProfile?.userId}`);
          setEducationEdit(false);
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
  const toggleEditEducation = () => {
    setEducationEdit(!educationEditNew);
  };
  return (
    <>
      <div className="pb-4">
        <div className="flex justify-between">
          <h1 className=" font-semibold">Latest Education</h1>
          <div onClick={toggleEditEducation}>
            <h2 className="hover:bg-green-400 hover:rounded-md  text-xs border-black hover:text-white flex border rounded-md justify-between items-center cursor-pointer px-2 group">
              (+) Edit Latest Education
            </h2>
          </div>
        </div>
        {educationEditNew ? (
          <>
            <Selector
              errors={errors}
              register={register}
              idSelector="college_name"
              value={college_name}
              onChange={(value) => setCustomValue("college_name", value)}
              fillOptions={optionsColleges}
              placeHolder={
                currentProfile?.college_name || "Select your college name"
              }
            />
            <hr className="pb-2" />
            <Selector
              errors={errors}
              register={register}
              idSelector="college_title"
              value={college_title}
              onChange={(value) => setCustomValue("college_title", value)}
              fillOptions={optionsCollegeTitle}
              placeHolder={
                currentProfile?.college_title || "Select your college title"
              }
            />
            <hr className="pb-2" />
            <Selector
              errors={errors}
              register={register}
              idSelector="college_major"
              value={college_major}
              onChange={(value) => setCustomValue("college_major", value)}
              fillOptions={optionsCollegeMajor}
              placeHolder={
                currentProfile?.college_major || "Select your college major"
              }
            />
            <div className="card-actions justify-end py-2">
              <button
                onClick={handleSubmit(onSubmit)}
                className="btn btn-sm btn-accent"
              >
                Update Education
              </button>
            </div>
          </>
        ) : (
          <>
            {currentProfile?.college_name !== null ? (
              <div>
                <p>{currentProfile?.college_name}</p>
                <p>{currentProfile?.college_major}</p>
                <p>{currentProfile?.college_title}</p>
              </div>
            ) : (
              <div>No latest education has been set</div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default EducationInput;
