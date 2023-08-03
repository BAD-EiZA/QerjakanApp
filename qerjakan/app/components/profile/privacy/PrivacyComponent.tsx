"use client";

import { SafeCurrentUser } from "@/app/types";
import Input from "@/app/components/inputs/Input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PasswordForm from "./PasswordForm";
import PinForm from "./PinForm";
interface PrivacyProps {
  currentUser: SafeCurrentUser | null;
}

const PrivacyComponent: React.FC<PrivacyProps> = ({ currentUser }) => {
  
  return (
    <div className="card bg-base-300 w-[785px]">
      <div className="card-body border-slate-900">
        <h1 className="card-title text-3xl">Privacy</h1>
        <div className="divider"></div>
        <div className="flex flex-col">
          <PasswordForm currentUser={currentUser}/>
          <div className="divider"></div>
          <PinForm currentUser={currentUser}/>
        </div>
      </div>
    </div>
  );
};

export default PrivacyComponent;
