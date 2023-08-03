"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { AiOutlineClose } from "react-icons/ai";
import Swal from "sweetalert2";
import ImageUpload from "../inputs/ImageUpload";
import Selector from "../inputs/Selector";

interface ComplainModalProps {
  orderId: string;
}
const ComplainModal: React.FC<ComplainModalProps> = ({ orderId }) => {
  const complainTypeMap = [
    {
      label: "Poor service quality",
      value: "Poor service quality",
    },
    {
      label: "Late or non-delivery",
      value: "Late or non-delivery",
    },
    {
        label: "Communication issues",
        value: "Communication issues"
    },
    {
        label: "Misleading advertising",
        value: "Misleading advertising"
    },
    {
        label: "Unprofessional behavior",
        value: "Unprofessional behavior"
    }
  ];
  const safeMapComplain = complainTypeMap.map((complain: any) => ({
    label: complain.label,
    value: complain.value,
  }));
  const router = useRouter();
  const [isLoading, setIsloading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      description: '',
      image: '',
      complainType: "",
      
    },
  });

  const image = watch("image");
  const complainType = watch("complainType")

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsloading(true);

    axios
      .post("/api/addReview", data)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Send Review Success",
          showConfirmButton: false,
          timer: 1500,
        });
        reset();
        router.refresh();
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      })
      .finally(() => {
        setIsloading(false);
      });
  };
  return (
    <>
      <label htmlFor="complain" className=" cursor-pointer my-2">
        Complain
      </label>

      <input type="checkbox" id="complain" className="modal-toggle" />
      <div className="modal sm:modal-middle modal-bottom">
        <div className="modal-box">
          <div className="flex justify-between">
            <span className="font-semibold text-lg">Review</span>
            <label htmlFor="complain" className=" cursor-pointer my-2">
              <AiOutlineClose />
            </label>
          </div>
          <div className="pb-4">
            <h3 className="font-semibold text-slate-400 text-sm">Send Image</h3>
            {/* <ImageMultiple
              onChange={(value) => setCustomValue("image", value)}
              value={image}
            /> */}
            <ImageUpload
              onChange={(value) => setCustomValue("image", value)}
              value={image}
            />
          </div>
          <textarea
            className="textarea textarea-bordered textarea-md w-full max-w-lg"
            onChange={(e) => setCustomValue("reviewText", e.target.value)}
            placeholder="Comment"
          ></textarea>
          <Selector
          errors={errors}register={register}
          idSelector="complainType"
            value={complainType.value}
            onChange={(value) => setCustomValue("complainType", value.value)}
            fillOptions={safeMapComplain}
            placeHolder="Complain Type"
          />
          <div className="modal-action">
            <button className="btn" onClick={handleSubmit(onSubmit)}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ComplainModal;
