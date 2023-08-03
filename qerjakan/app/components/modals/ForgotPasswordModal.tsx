"use client";

import { useCallback, useState } from "react";
import { signIn } from "next-auth/react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { AiFillGithub } from "react-icons/ai";
import { useRouter } from "next/navigation";

import useRegisterModal from "@/app/hooks/useRegisterModal";
import useLoginModal from "@/app/hooks/useLoginModal";

import Modal from "./Modal";
import Input from "../inputs/Input";
import Heading from "../Heading";
import Button from "../Button";
import Swal from "sweetalert2";
import useForgotModal from "@/app/hooks/useForgotModal";
import axios from "axios";

const ForgotModal = () => {
  const router = useRouter();
  const loginModal = useLoginModal();
  const forgotModal = useForgotModal();
  const registerModal = useRegisterModal();
  const [isLoading, setIsLoading] = useState(false);

  const deletePreviousUUIDs = async () => {
    try {
      setIsLoading(true);
      await fetch("/api/token/deleteuuid", { method: "POST" })
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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    axios
      .post("/api/forgotPassword", data)
      .then((callback) => {
        setIsLoading(false);

        if (callback) {
          Swal.fire({
            icon: "success",
            title: "Send Reset Password Success",
            showConfirmButton: false,
            timer: 1500,
          });

          forgotModal.onClose();
          setTimeout(deletePreviousUUIDs, 1 * 60 * 1000);
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

  const onToggleLogin = useCallback(() => {
    loginModal.onOpen();
    forgotModal.onClose();
  }, [loginModal, forgotModal]);

  const onToggleRegister = useCallback(() => {
    registerModal.onOpen();
    forgotModal.onClose();
  }, [registerModal, forgotModal]);

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title="Forgot Password" subtitle="Find your account!" />
      <Input
        id="email"
        label="Email"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <div
        className="
      text-neutral-500 text-center mt-4 font-light"
      >
        <p>
          First time using Qerjakan?
          <span
            onClick={onToggleRegister}
            className="
              text-neutral-800
              cursor-pointer 
              hover:underline
            "
          >
            {" "}
            Create an account
          </span>
        </p>
        <p>
          Have an account?
          <span
            onClick={onToggleLogin}
            className="
              text-neutral-800
              cursor-pointer 
              hover:underline
            "
          >
            {" "}
            Login to your account
          </span>
        </p>
      </div>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={forgotModal.isOpen}
      title="Forgot Password"
      actionLabel="Continue"
      onClose={forgotModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default ForgotModal;
