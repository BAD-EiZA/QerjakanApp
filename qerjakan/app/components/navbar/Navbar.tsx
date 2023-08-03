"use client";
import {
  FullConversationType,
  SafeCurrentUser,
  SafeProfile,
  SafeUser,
} from "@/app/types";
import UserMenu from "./UserMenu";
import { Notification, UserBankAccount } from "@prisma/client";
import { useState } from "react";
import { AiOutlineClose, AiOutlineMenu, AiOutlineSearch } from "react-icons/ai";
import { MdFavorite, MdHelp } from "react-icons/md";
import useLoginModal from "@/app/hooks/useLoginModal";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import ChatNotif from "./ChatNotification";
import Logo from "./Logo";
import Notifications from "./Notification";
import { useRouter } from "next/navigation";
import useVerifyModal from "@/app/hooks/useVerifyModal";
import Search from "./Search";

interface NavbarProps {
  currentUser?: SafeCurrentUser | null | undefined;
  userBank?: UserBankAccount | null;
  dataTransaction: number | never[];
}

const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  userBank,
  dataTransaction,
}) => {
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const verifyModal = useVerifyModal();
  const router = useRouter();
  const [nav, setNav] = useState(false);
  return (
    <div className=" bg-white sticky max-w-[1640px] mx-auto flex justify-between items-center p-4 z-20">
      {/* Left side */}
      <div className="flex items-center">
        <div
          onClick={() => setNav(!nav)}
          className="cursor-pointer visible md:invisible"
        >
          <AiOutlineMenu size={30} />
        </div>
        <div onClick={() => router.push("/")}>
          <a className="text-2xl sm:text-3xl lg:text-4xl px-2">
            Qerja<span className="font-bold">Kan.</span>
          </a>
        </div>
      </div>

      {/* Search Input */}
      <Search />

      <ul className="menu menu-horizontal hidden xl:flex">
        {!currentUser && (
          <li>
            <a onClick={loginModal.onOpen}>Sign In</a>
          </li>
        )}
        {!currentUser?.isSeller && currentUser && (
          <li>
            <a onClick={verifyModal.onOpen}>Become a Seller</a>
          </li>
        )}
        {!currentUser && (
          <li className="border border-cyan-500">
            <a onClick={registerModal.onOpen}>Join</a>
          </li>
        )}
      </ul>
      {currentUser && (
        <div className="hidden md:flex items-center py-2 rounded-full gap-4">
          <a>
            <Notifications TransactionCount={dataTransaction} />
          </a>

          <a>
            <ChatNotif />
          </a>
          <button>
            <UserMenu currentUser={currentUser} userBank={userBank} />
          </button>
        </div>
      )}

      {/* Mobile Menu */}
      {/* Overlay */}
      {nav ? (
        <div className="bg-black/80 fixed w-full h-screen z-10 top-0 left-0"></div>
      ) : (
        ""
      )}

      {/* Side drawer menu */}
      <div
        className={
          nav
            ? "fixed top-0 left-0 w-[300px] h-screen bg-white z-50 duration-300"
            : "fixed top-0 left-[-100%] w-[300px] h-screen bg-white z-50 duration-300"
        }
      >
        <AiOutlineClose
          onClick={() => setNav(!nav)}
          size={30}
          className="absolute right-4 top-4 cursor-pointer"
        />
        <h2 className="text-2xl p-4">
          Qerja<span className="font-bold">Kan.</span>
        </h2>
        {currentUser && (
          <img
            src={currentUser.image || ""}
            alt=""
            className="w-[40px] h-[40px] ml-3 rounded-2xl"
          />
        )}
        <nav>
          <ul className="flex flex-col p-4 text-gray-800">
            <li className="text-xl py-4 flex">
              <MdFavorite size={25} className="mr-4" />
              <a href="">Explore</a>
            </li>
            <li className="text-xl py-4 flex">
              <MdFavorite size={25} className="mr-4" />
              <a href="">Qerjakan Business</a>
            </li>
            <hr />
            {!currentUser && (
              <>
                <li className="text-xl py-4 flex">
                  <MdFavorite size={25} className="mr-4" />
                  <a href="">Login</a>
                </li>
                <li className="text-xl py-4 flex">
                  <MdFavorite size={25} className="mr-4" />
                  <a href="">Join</a>
                </li>
              </>
            )}
            {currentUser && (
              <>
                <li className="text-xl py-4 flex">
                  <MdFavorite size={25} className="mr-4" />
                  <a href="">Profile</a>
                </li>
                {currentUser.isSeller && (
                  <li className="text-xl py-4 flex">
                    <MdFavorite size={25} className="mr-4" />
                    <a href="">Dashboard</a>
                  </li>
                )}

                <li className="text-xl py-4 flex">
                  <MdFavorite size={25} className="mr-4" />
                  <a href="">Logout</a>
                </li>
              </>
            )}
            {!currentUser?.isSeller && (
              <li className="text-xl py-4 flex">
                <MdFavorite size={25} className="mr-4" />
                <a href="">Become a Seller</a>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
