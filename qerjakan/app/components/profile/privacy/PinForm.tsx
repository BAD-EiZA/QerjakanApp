"use client";

import { SafeCurrentUser } from "@/app/types";
import clsx from "clsx";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import Swal from "sweetalert2";
import Loader from "../../Loader";

interface PinProps {
  currentUser: SafeCurrentUser | null;
}

const PinForm: React.FC<PinProps> = ({ currentUser }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [newPin, setNewPin] = useState('')
  const [pinVerification, setPinVerification] = useState('');
  const handleUpdatePassowrd = async () => {
    if (newPin === pinVerification) {
      setIsLoading(true);
      await fetch("/api/privacy/updatepin", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pin: pin,
          newPin: newPin,
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
            ResetPin()
            router.refresh()
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
           else {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: res.message,
            });
          }
          router.push("/");
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
          window.location.reload()
        });
    }
  };
  if(isLoading){
    return <Loader/>
  }
  const ResetPin = () => {
    setNewPin('')
    setPinVerification('')
    setPin('')
  }
  const handleInputNewPinChange = (event: ChangeEvent<HTMLInputElement>) => {
    const result = event.target.value.replace(/\D/g, '');
    setNewPin(result);

    
  }
  const handleInputNewPinVerificationChange = (event: ChangeEvent<HTMLInputElement>) => {
    const result = event.target.value.replace(/\D/g, '');
    setPinVerification(result);

    
  }
  
  return (
    <div>
      <div className="pb-4">
        <h1 className=" font-semibold">Pin</h1>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">New Pin</span>
          </label>
          <input
            type="password"
            placeholder="Type here"
            pattern="[0-9]*"
            inputMode="numeric"
            value={newPin}
            maxLength={6}
            onChange={handleInputNewPinChange}
            className="input input-bordered w-full max-w-xs"
          />
        </div>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">New Pin Verification</span>
          </label>
          <input
            type="password"
            maxLength={6}
            placeholder="Type here"
            
            value={pinVerification}
            onChange={handleInputNewPinVerificationChange}
            className={clsx(
              newPin === pinVerification
                ? "input input-bordered w-full max-w-xs"
                : "input input-bordered input-error w-full max-w-xs",
              
            )}
          />
        </div>
        <div className="card-actions justify-start pt-4">
          <button
            className="btn btn-warning"
            onClick={() => (window as any).passbutton.showModal()}
            disabled={newPin.length !== 6 || pinVerification.length !== 6}
          >
            Change Pin
          </button>
        </div>
      </div>
      <dialog id="passbutton" className="modal">
        <form method="dialog" className="modal-box">
          <button onClick={()=> ResetPin()} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
          <h3 className="font-bold text-lg">Update Pin</h3>
          <p>Input Old Pin</p>
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

export default PinForm;
