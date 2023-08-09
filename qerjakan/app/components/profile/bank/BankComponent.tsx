"use client";

import { SafeCurrentUser } from "@/app/types";
import Selector from "../../inputs/Selector";
import { useRouter } from "next/navigation";
import Input from "@/app/components/inputs/Input";
import { ChangeEvent, useState } from "react";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import { UserBankAccount } from "@prisma/client";

interface BankProps {
  currentUser: SafeCurrentUser | null;
  userBank: UserBankAccount | null
}

const BankComponent: React.FC<BankProps> = ({ currentUser, userBank }) => {
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
      bank_name: userBank?.bank_name || '',
      account_number: userBank?.account_number || '',
      account_name: userBank?.account_name || '',
      pin: "",
    },
  });

  const bankType = watch("bank_name");
  const account_number = watch("account_number")
  const account_name = watch("account_name")
  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };
  const bankMap = [
    {
      label: "Bank Mandiri",
      value: "Mandiri",
    },
    {
      label: "Bank BCA",
      value: "BCA",
    },
  ];
  const safeMapBank = bankMap.map((bank: any) => ({
    label: bank.label,
    value: bank.value,
  }));
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    const res = axios
      .post("/api/bankaccount", data)
      .then((res) => {
        if (res.data.statusCode === 200) {
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
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
        window.location.reload()
      });
  };
  const handleInputNewPinChange = (event: ChangeEvent<HTMLInputElement>) => {
    const result = event.target.value.replace(/\D/g, '');
    setCustomValue('account_number', result)

    
  }

  
  return (
    <div className="card bg-base-300 w-[785px]">
      <div className="card-body border-slate-900">
        <h1 className="card-title text-3xl">Bank Account</h1>
        <div className="divider"></div>
        <div className="flex flex-col">
          <Selector
            errors={errors}
            register={register}
            idSelector="bankType"
            value={bankType.value}
            onChange={(value) => setCustomValue("bank_name", value.value)}
            fillOptions={safeMapBank}
            placeHolder={userBank?.bank_name || "Bank Name"}
          />
          <div className="divider"></div>
          <input
          value={account_number}
          onChange={handleInputNewPinChange}
          maxLength={12}
placeholder="Type your Account Number"
          className="peer
          w-full
          p-4
          pt-6 
          font-light 
          bg-white 
          border-2
          rounded-md
          outline-none
          transition
          disabled:opacity-70
          disabled:cursor-not-allowed"
          />
         
          <div className="divider"></div>
          <Input
            id="account_name"
            label={userBank?.account_name || "Account Name"}
            disabled={isLoading}
            register={register}
            errors={errors}
            required
          />
          <div className="divider"></div>
          {/* <Input
            id="pin"
            max={6}
            type="password"
            label="Verification Pin"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
          /> */}
        </div>
        <div className="card-actions justify-start pt-4">
          <button
            className="btn btn-warning"
            onClick={() => (window as any).passbutton.showModal()}
            disabled={ account_name === ""|| account_number === "" || bankType === ""}
          >
            Update Bank Account
          </button>
        </div>
        <dialog id="passbutton" className="modal">
        <form method="dialog" className="modal-box">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={()=> setCustomValue("pin", "")}>
            ✕
          </button>
          <h3 className="font-bold text-lg">Update Pin</h3>
          <p>Input Pin</p>
          <Input
            id="pin"
            max={6}
            type="password"
            label="Verification Pin"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
          />
          <button
            onClick={handleSubmit(onSubmit)}
            
            className="btn btn-neutral mx-2"
          >
            Submit
          </button>
        </form>
      </dialog>
      </div>
    </div>
  );
};

export default BankComponent;
