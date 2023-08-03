"use client";

import { HiChevronLeft } from "react-icons/hi";
import { HiEllipsisHorizontal } from "react-icons/hi2";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Conversation, User } from "@prisma/client";
import useOtherUser from "@/app/hooks/useOtherUserConversation";
import useActiveList from "@/app/hooks/useActiveList";
import Image from "next/image";

interface HeaderProps {
  conversation: Conversation & {
    users: User[];
  };
}

const Header: React.FC<HeaderProps> = ({ conversation }) => {
  const otherUser = useOtherUser(conversation);
  const statusText = useMemo(() => {
    if (conversation.isGroup) {
      return `${conversation.users.length} members`;
    }

    return "active";
  }, [conversation]);
  return (
    <div
      className=" bg-white 
        w-full 
        flex 
        border-b-[1px] 
        sm:px-4 
        py-3 
        px-4 
        lg:px-6 
        justify-between 
        items-center 
        shadow-sm"
    >
      <div className="flex gap-3 items-center">
        <Link
          href="/conversations"
          className="
            lg:hidden 
            block 
            text-sky-500 
            hover:text-sky-600 
            transition 
            cursor-pointer
          "
        >
          <HiChevronLeft size={32} />
        </Link>
        <div className="rounded-full">
          <Image alt="Other User Image"
          src={otherUser.image || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png'}
          width={30}
          height={30}/> 
          
        </div>
        <div className="flex flex-col">
          <div>{otherUser.name}</div>
          <div className="text-sm font-light text-neutral-500">
            {statusText}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
