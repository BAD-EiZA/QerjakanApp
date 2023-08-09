"use client";
import Swal from "sweetalert2";
import axios from "axios";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { useCallback, useMemo, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import { error } from "console";
import Modal from "./Modal";
import Heading from "../Heading";
import Input from "../inputs/Input";
import Button from "../Button";
import useLoginModal from "@/app/hooks/useLoginModal";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Selector from "../inputs/Selector";
import { useRouter } from "next/navigation";
enum STEPS {
  ACCOUNT = 0,
  PROFILE = 1,
}

const RegisterModal = () => {
  const registerModal = useRegisterModal();
  const [isLoading, setIsLoading] = useState(false);
  const loginModal = useLoginModal();
  const [step, setStep] = useState(STEPS.ACCOUNT);
  const Gender = [
    {
      label: "Male",
      value: "Male",
    },
    {
      label: "Female",
      value: "Female",
    },
  ];
  const mapGender = Gender.map((gen: any) => ({
    value: gen.value,
    label: gen.label,
  }));
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      dateBirth: new Date(),
      gender: "",
    },
  });
  const dateBirth = watch("dateBirth");
  const gender = watch("gender");
  const email = watch("email");
  const onBack = () => {
    setStep((value) => value - 1);
  };

  const onNext = () => {
    setStep((value) => value + 1);
  };
  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };
  const deletePreviousUUIDs = async () => {
    try {
      setIsLoading(true);
      await fetch("/api/verifyAccount/deleteTokenAccount", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      })
        .then((res) =>
          res.json().then((res) => {
            router.refresh();
          })
        )
        .catch(() => {
          console.log("error");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } catch (error) {
      console.error(error);
    }
  };
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (step !== STEPS.PROFILE) {
      return onNext();
    }
    setIsLoading(true);
    const res = axios
      .post("/api/register", data)
      .then((res) => {
        if(res.data.statusCode === 200){
          Swal.fire({
            icon: "success",
            title: "Register Success",
            html: res.data.message,
            showConfirmButton: false,
            timer: 1500,
          });
          registerModal.onClose();
          setTimeout(deletePreviousUUIDs, 1 * 60 * 1000);
        }
        else if(res.data.statusCode === 400){
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: res.data.message,
        })
        }
        
      })
      .catch((error) => {
        Swal.fire({
          title: "Something Went Wrong",

          text: "Ada yang salah tuh",

          imageUrl: "https://media.tenor.com/pL79BRXI4rAAAAAd/god-kiana.gif",
          imageWidth: 300,
          imageHeight: 200,
          imageAlt: "Custom image",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const actionLabel = useMemo(() => {
    if (step === STEPS.PROFILE) {
      return "Create";
    }

    return "Next";
  }, [step]);

  const onToggle = useCallback(() => {
    registerModal.onClose();
    loginModal.onOpen();
  }, [loginModal, registerModal]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.ACCOUNT) {
      return undefined;
    }

    return "Back";
  }, [step]);

  const stepContent = {
    [STEPS.ACCOUNT]: (
      <div className="flex flex-col gap-2">
        <Heading title="Qerjakan Yuk" subtitle="Create an account!" />
        <Input
          id="email"
          label="Email"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />

        <Input
          id="password"
          label="Password"
          type="password"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <label htmlFor="" className="font-bold text-xs">*The minimum length of the password is 8</label>
      </div>
    ),
    [STEPS.PROFILE]: (
      <div className="flex flex-col gap-2">
        <Heading title="Qerjakan Yuk" subtitle="Create your profile" />
        <div>
          <h2>Full Name</h2>
          <Input
            id="name"
            label="Name"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
          />
        </div>
        <div className="w-full">
          <h2>Birth Date</h2>
          <ReactDatePicker
            selected={dateBirth}
            placeholderText="Calendar"
            showMonthDropdown
            showYearDropdown
            className="w-full border-2 border-slate-300 p-4"
            onChange={(value: Date) => setCustomValue("dateBirth", value)}
          />
        </div>
        <div>
          <h2>Gender</h2>
          <Selector
            required
            idSelector="gender"
            register={register}
            errors={errors}
            value={gender.value}
            onChange={(value) => setCustomValue("gender", value.value)}
            fillOptions={mapGender}
            placeHolder="Female & Male"
          />
        </div>
      </div>
    ),
  };

  const bodyContent = stepContent[step];
  const footerContent = (
    <div className="flex flex-col gap-2">
      {/* <hr />
      <Button
        outline
        label="Continue with Google"
        icon={FcGoogle}
        onClick={() => signIn("google")}
      /> */}
      <div
        className="
              text-neutral-500 
              text-center 
              mt-2 
              font-light
            "
      >
        <p>
          Already have an account?
          <span
            onClick={onToggle}
            className="
                  text-neutral-800
                  cursor-pointer 
                  hover:underline
                "
          >
            {" "}
            Log in
          </span>
        </p>
      </div>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={registerModal.isOpen}
      title="Register"
      actionLabel={actionLabel}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.ACCOUNT ? undefined : onBack}
      onClose={registerModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default RegisterModal;
