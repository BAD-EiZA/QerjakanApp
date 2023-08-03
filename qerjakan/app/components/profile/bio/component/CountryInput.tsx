"use client";

import React, { useState } from "react";
import { Profile } from "@prisma/client";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Input from "@/app/components/inputs/Input";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import axios from "axios";
import Selector from "@/app/components/inputs/Selector";
import useCountries from "@/app/hooks/useCountries";
interface DescriptionProps {
  currentProfile: Profile | null;
}

const CountryInput: React.FC<DescriptionProps> = ({ currentProfile }) => {
  const [countryEditNew, setCountryEdit] = useState(false);
  const router = useRouter();
  const { getAll } = useCountries();
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
      country:  "",
    },
  });
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    const res = axios
      .patch("/api/editcountry", data)
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
          setCountryEdit(false);
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
  const country = watch("country");
  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };
  const toggleEditCountry = () => {
    setCountryEdit(!countryEditNew);
  };
  return (
    <>
      <div className="pb-4">
        <div className="flex justify-between">
          <h1 className=" font-semibold">Country</h1>
          <div onClick={toggleEditCountry}>
            <h2 className="hover:bg-green-400 hover:rounded-md  text-xs border-black hover:text-white flex border rounded-md justify-between items-center cursor-pointer px-2 group">
              (+) Edit Country
            </h2>
          </div>
        </div>
        {countryEditNew ? (
          <>
            <Selector
              value={country}
              errors={errors}
              register={register}
              idSelector="country"
              onChange={(value) => setCustomValue("country", value)}
              fillOptions={getAll()}
              placeHolder={currentProfile?.country || "Input your country"}
            />
            <div className="card-actions justify-end py-2">
              <button
                onClick={handleSubmit(onSubmit)}
                className="btn btn-sm btn-accent"
              >
                Update Country
              </button>
            </div>
          </>
        ) : (
          <>
            {currentProfile?.country !== null ? (
              <div>
                <p>{currentProfile?.country}</p>
              </div>
            ) : (
              <div>No country has been set</div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default CountryInput;
