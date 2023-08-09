"use client";
import { useRouter } from "next/navigation";
import { SafeCurrentUser } from "@/app/types";
import { useState } from "react";
import clsx from "clsx";
import Swal from "sweetalert2";
import { signOut } from "next-auth/react";
import Loader from "../../Loader";
interface EmailProps {
  currentUser: SafeCurrentUser | null;
}

const PasswordForm: React.FC<EmailProps> = ({ currentUser }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [passwordVerification, setVerification] = useState("");
  const handleUpdatePassowrd = async () => {
    if (password === passwordVerification) {
      setIsLoading(true);
      await fetch("/api/privacy/updatepassword", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pin: pin,
          password: password,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.statusCode == 200) {
            Swal.fire({
              icon: "success",
              title: res.message,
              showConfirmButton: false,
              timer: 1500,
            });
            signOut();
            
          }
          else if(res.statusCode == 401){
            Swal.fire({
              icon: "error",
              title: res.message,
              showConfirmButton: false,
              timer: 1500,
            });
            router.push("/");
          }
          else{
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: res.message,
            });
          }

          console.log("messgae", res);
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.error,
          });

          console.log("perkadalan", error.error);
        })
        .finally(() => {
          
          router.refresh()
          setIsLoading(false);
          
        });
    }
  };
  if(isLoading){
    return <Loader/>
  }
  const ResetPassword = () => {
    setPassword("")
    setPin("")
    setVerification("")
  }
  return (
    <div>
      <div className="pb-4">
        <h1 className=" font-semibold">Password</h1>
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
            className={clsx(
              password === passwordVerification
                ? "input input-bordered w-full max-w-xs"
                : "input input-bordered input-error w-full max-w-xs",
              passwordVerification === "input input-bordered w-full max-w-xs"
            )}
          />
        </div>
        <div className="card-actions justify-start pt-4">
          <button
            className="btn btn-warning"
            onClick={() => (window as any).pinbutton.showModal()}
            disabled={password === '' || passwordVerification === '' || password.length < 8 || passwordVerification.length < 8}
          
          >
           Change Password
          </button>
        </div>
      </div>
      <dialog id="pinbutton" className="modal">
        <form method="dialog" className="modal-box">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={()=> ResetPassword()}>
            ✕
          </button>
          <h3 className="font-bold text-lg">Update Pin</h3>
          <p>Input Pin</p>
          <input
            type="password"
            placeholder="Type your Pin"
            value={pin}
            maxLength={6}
            onChange={(e) => setPin(e.target.value)}
            className="input input-bordered w-full max-w-xs"
          />
          <button
            onClick={() => handleUpdatePassowrd()}
            className="btn btn-neutral mx-2"
          >
            Submit
          </button>
        </form>
      </dialog>
    </div>
  );
};

export default PasswordForm;
