"use client";
import clsx from "clsx";

import useConversation from "../hooks/useConversation";
import EmptyMessage from "./component/EmptyMessage";
import getCurrUser from "../actions/user/getCurrUser";
import { redirect } from "next/navigation";

const ConversationPage = async () => {
  
  const { isOpen } = useConversation();
  return (
    <div>
      <div
        className={clsx(
          "lg:pl-80 h-full lg:block",
          isOpen ? "block" : "hidden"
        )}
      >
        <EmptyMessage />
      </div>
    </div>
  );
};
export default ConversationPage;
