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
const ResetClient:React.FC<ResetProps> =({
  data
}) => {
  const kadal = useParams();
  const router = useRouter();
  const [uuid, setUUID] = useState(kadal?.token);
  const [confirm, setConfirm] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordVerification, setVerification] = useState("");
 
  const handleReset = async () => {
    if (password === passwordVerification) {
      setIsloading(true);
      await fetch("/api/token/forgotpassword", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: uuid,
          password: password,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          Swal.fire({
            icon: "success",
            title: "Success to Reset Password",
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
    }
  };
  if (!kadal) {
    return null;
  }

  if (uuid !== "") {
    return (
      <div>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">New Password</span>
          </label>
          <input
            type="password"
            placeholder="Type here"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input input-bordered w-full max-w-xs"
          />
        </div>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">New Password Verification</span>
          </label>
          <input
            type="password"
            placeholder="Type here"
            value={passwordVerification}
            onChange={(e) => setVerification(e.target.value)}
            className={clsx(password === passwordVerification ?"input input-bordered w-full max-w-xs" :"input input-bordered input-error w-full max-w-xs",
            passwordVerification === 'input input-bordered w-full max-w-xs' )}
          />
        </div>
        <button onClick={() => handleReset()} disabled={password === '' || password !== passwordVerification || passwordVerification === '' || password.length < 8 || passwordVerification.length < 8 } className="btn">
          Submit
        </button>
      </div>
    );
  } else {
    return <div>perkadalan</div>;
  }
};

export default ResetClient;
