"use client";

import { ForgotPasswordToken } from "@prisma/client";
import clsx from "clsx";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { json } from "stream/consumers";
import Swal from "sweetalert2";


interface ResetProps {
  data: ForgotPasswordToken
}
const VerifyAccountClient:React.FC<ResetProps> =({
  data
}) => {
  const kadal = useParams();
  const router = useRouter();
  const [uuid, setUUID] = useState(kadal?.token);
  const [isLoading, setIsloading] = useState(false);
  const [pin, setPin] = useState("")
 
  const handleVerify = async () => {
    setIsloading(true);
      await fetch("/api/verifyAccount/updateVerifyAccount", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: uuid,
          pin: pin
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          Swal.fire({
            icon: "success",
            title: "Success to Verify Account",
            html: "Now You Can Login To Website",
            showConfirmButton: false,
            timer: 1500,
          });
          router.push("/");
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Your token is expired",
          });
          router.push("/");
          console.log("perkadalan", error);
        })
        .finally(() => {
          router.refresh();
          setIsloading(false);
        });
  };
  if (!kadal) {
    return null;
  }

  if (uuid !== "") {
    return (
      <div className="max-w-[1640px] ">
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">New Pin</span>
          </label>
          <input
            type="password"
            inputMode="numeric"
            placeholder="Type here"
            value={pin}
            maxLength={6}
            onChange={(e) => setPin(e.target.value)}
            className={clsx(pin.length === 6 ?"input input-bordered w-full max-w-xs" :"input input-bordered input-error w-full max-w-xs")}
          />
        </div>
        
        <button onClick={() => handleVerify()} disabled={pin === '' || pin.length !== 6 } className="btn">
          Submit
        </button>
      </div>
    );
  } else {
    return <div>perkadalan</div>;
  }
};

export default VerifyAccountClient;
