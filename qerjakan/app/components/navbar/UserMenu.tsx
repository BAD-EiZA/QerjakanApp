"use client";
import Avatar from "./Avatar";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import MenuItem from "./MenuItem";
import useLoginModal from "@/app/hooks/useLoginModal";
import { SafeCurrentUser, SafeUser } from "@/app/types";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Profile, User, UserBankAccount } from "@prisma/client";
import { useCallback, useState } from "react";
import useVerifyModal from "@/app/hooks/useVerifyModal";
import useAddServiceModal from "@/app/hooks/useAddServiceModal";
import Swal from "sweetalert2";
import Image from "next/image";
import { AiOutlineClose } from "react-icons/ai";

interface UserMenuProps {
  currentUser?: SafeCurrentUser;
  userBank?: UserBankAccount | null;
}

const UserMenu: React.FC<UserMenuProps> = ({ currentUser, userBank }) => {
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const [isLoading, setIsloading] = useState(false);
  const verifyModal = useVerifyModal();
  const serviceModal = useAddServiceModal();
  const [isOpen, setIsOpen] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const handleRefund = async () => {
    Swal.fire({
      title: "Are you sure want to withdraw?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, continue withdraw",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch("/api/withdraw", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              inputValue: inputValue,
            }),
          });

          const data = await response.json();

          if (response.ok) {
            Swal.fire({
              icon: "success",
              title: "Checkout Success",
              showConfirmButton: false,
              timer: 1500,
            });
            router.refresh();
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Balance tidak mencukupi",
            });
          }
        } catch (error) {
          console.error(error);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Error",
          });
        }
      }
    });
  };
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleAccordion = () => {
    setIsExpanded(!isExpanded);
  };
  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);

  return (
    <div className="dropdown dropdown-left ml-2 ">
      <label tabIndex={2} className="btn btn-ghost btn-md btn-circle avatar">
        <div className=" rounded-full">
          <Avatar src={currentUser?.image} />
        </div>
      </label>
      <ul
        tabIndex={2}
        className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-40"
      >
        {currentUser ? (
          <>
            <div className="flex py-1 justify-center">
              <Image
                src={currentUser.image || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"}
                className="h-[30px] w-[30px] rounded-full"
                width={30}
                height={30}
                alt="UserImage"
              />
            </div>
            <h1 className=" py-1 font-light text-xs">{currentUser.name}</h1>

            <hr />
            <div className="flex justify-between  py-2 px-4">
              <h1 className="text-xs font-light">Balance</h1>

              <h1 className=" text-xs font-thin">
                $ {currentUser.userBalance}
              </h1>
            </div>
            <hr />
            <MenuItem
              onClick={() => router.push(`/profiles/${currentUser.id}`)}
              label="Account"
            />
            <MenuItem
              onClick={() => router.push("/myorder")}
              label="My Order"
            />
            {currentUser.isSeller && (
              <>
                <MenuItem
                  onClick={() => router.push("/seller/myservice/dashboard")}
                  label="Toko Saya"
                />
              </>
            )}
            <dialog
              id="withdrawModal"
              className="modal modal-bottom sm:modal-middle"
            >
              <form method="dialog" className="modal-box">
              <div className="flex justify-between">
                <h3 className="font-bold text-lg">Withdraw Balance</h3>
                <button onClick={()=> (window as any).withdrawModal.close()}><AiOutlineClose/></button>
                </div>
                
                <div className="flex justify-between px-4">
                  <p className="py-4">Bank</p>
                  <p className="py-4">{userBank?.bank_name}</p>
                </div>
                <div className="flex justify-between px-4">
                  <p className="py-4">Account Number</p>
                  <p className="py-4">{userBank?.account_number}</p>
                </div>
                <div className="flex justify-between px-4">
                  <p className="py-4">Account Name</p>
                  <p className="py-4">{userBank?.account_name}</p>
                </div>
                <div className="flex justify-between px-4">
                  <p className="py-4">Amount</p>
                  <input
                    type="number"
                    pattern="[0-9]*"
                    onChange={(o: any) => {
                      const inputValues = o.target.value;
                      const isValidInput =
                        /^\d*$/.test(inputValues) && !inputValues.includes("e");
                      if (isValidInput && inputValues !== "") {
                        setInputValue(parseInt(inputValues).toString());
                      }
                    }}
                    className={`${
                      parseInt(inputValue) >= 1000
                        ? "input input-bordered input-sm w-full max-w-xs mt-3"
                        : " mt-3 input input-bordered input-sm input-warning w-full max-w-xs"
                    }`}
                  />
                </div>

                <div className="modal-action">
                  {/* if there is a button in form, it will close the modal */}
                  <button
                    className="input input-bordered max-w-xs"
                    onClick={() => handleRefund()}
                    type="submit"
                    disabled={
                      parseInt(inputValue) < 1000 ||
                      parseInt(inputValue) === 0 ||
                      inputValue === ""
                    }
                  >
                    Withdraw
                  </button>
                  <p>Minimal Withdraw $1000</p>
                </div>
              </form>
            </dialog>
            <MenuItem
              onClick={() => router.push("/conversation")}
              label="Chat"
            />
            <MenuItem
              onClick={() => (window as any).withdrawModal.showModal()}
              label="Withdraw"
            />

            <MenuItem onClick={() => signOut({callbackUrl: '/'})} label="Logout" />
          </>
        ) : (
          <>
            <MenuItem onClick={registerModal.onOpen} label="Register" />
            <MenuItem onClick={loginModal.onOpen} label="Login" />
          </>
        )}
      </ul>
    </div>
  );
};

export default UserMenu;
