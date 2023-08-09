"use client";
import axios from "axios";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Modal from "./Modal";
import useVerifyModal from "@/app/hooks/useVerifyModal";
import Heading from "../Heading";
import Swal from "sweetalert2";

const VerifyModal = () => {
  const router = useRouter();
  const verifyModal = useVerifyModal();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      
    },
  });
  const deletePreviousUUIDs = async () => {
    try {
      setIsLoading(true);
      await fetch("/api/verifyemail/deleteTokenSeller", { method: "POST" })
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
    setIsLoading(true);

    axios
      .post("/api/verifyemail/sendEmailSeller", data)
      .then((res) => {
        if (res.data.statusCode === 200) {
          Swal.fire({
            icon: "success",
            title: res.data.message,
            html: "Please check your email to verify seller",
            showConfirmButton: false,
            timer: 1500,
          });
          reset();
          router.refresh();
          verifyModal.onClose();
          setTimeout(deletePreviousUUIDs, 2 * 24 * 60 * 60 * 1000);
        }
        else if(res.data.statusCode === 401){
          Swal.fire({
            icon: "error",
            title: "Not Logged In",
            html: res.data.message,
            showConfirmButton: false,
            timer: 1500,
          });
          reset();
          router.push("/")
          verifyModal.onClose();
        }
        else if(res.data.statusCode === 400){
          Swal.fire({
            icon: "error",
            title: "Verification Seller",
            html: res.data.message,
            showConfirmButton: false,
            timer: 1500,
          });
          reset();
          verifyModal.onClose();
        }
        else{
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
      });
  };

  const bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="Update account to seller"
        subtitle="Click the button to send verification account to be seller"
      />
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={verifyModal.isOpen}
      title="Update Account"
      actionLabel="Verify"
      onClose={verifyModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
    />
  );
};

export default VerifyModal;
