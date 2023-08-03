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
const VerifySellerClient:React.FC<ResetProps> =({
  data
}) => {
  const kadal = useParams();
  const router = useRouter();
  const [uuid, setUUID] = useState(kadal?.token);
  const [confirm, setConfirm] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const [pin, setPin] = useState("")
 
  const handleVerify = async () => {
    setIsloading(true);
      await fetch("/api/verifyemail/updateVerifySeller", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: uuid,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          Swal.fire({
            icon: "success",
            title: "Success to Verify Seller Account",
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
      <div>
        <button onClick={() => handleVerify()}  className="btn">
          Verify Seller
        </button>
        
        
      </div>
    );
  } else {
    return <div>perkadalan</div>;
  }
};

export default VerifySellerClient;
