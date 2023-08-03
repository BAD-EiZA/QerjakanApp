"use client";

import useChatNotif from "@/app/hooks/useChatNotif";
import { useRouter } from "next/navigation";

import { AiFillMail } from "react-icons/ai";
const ChatNotif = () => {
  const router = useRouter();

  const { data: kadal } = useChatNotif();
  
  return (
    <div className="indicator">
      {kadal !== 0 && <span className="indicator-item badge badge-secondary">{kadal}</span> }
      <button onClick={()=> router.push("/conversation")}>
        <AiFillMail  size={20}/>
      </button>
      
    </div>
  );
};

export default ChatNotif;
