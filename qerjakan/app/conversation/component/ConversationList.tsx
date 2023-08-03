'use client';
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { MdOutlineGroupAdd } from 'react-icons/md';
import clsx from "clsx";
import { find, uniq } from 'lodash';
import useConversation from "@/app/hooks/useConversation";
import ConversationBox from "./ConversationBox";
import { User } from "@prisma/client";
import { FullConversationType } from "@/app/types";

interface ConversationListProps {
    initialItems: FullConversationType[];
    users: User[];
    title?: string;
}

const ConversationList: React.FC<ConversationListProps> = ({
    initialItems,users,title
}) => {

    const [items, setItems] = useState(initialItems);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const router = useRouter();

    const { conversationId, isOpen } = useConversation();

    const newHandler = (conversation: FullConversationType) => {
        setItems((current) => {
          if (find(current, { id: conversation.id })) {
            return current;
          }
  
          return [conversation, ...current]
        });
    }
  
    const removeHandler = (conversation: FullConversationType) => {
    setItems((current) => {
        return [...current.filter((convo) => convo.id !== conversation.id)]
    });
    }
    return(
        <aside className={clsx(`
        
      
        
        lg:pb-0
        
        lg:w-80 
        lg:flex
        overflow-y-auto 
        
        border 
      `, isOpen ? 'hidden' : 'block w-full left-0')}>
        <div className="px-5">
          <div className="flex justify-between mb-4 pt-4">
            <div className="text-2xl font-bold text-neutral-800">
              Messages
            </div>
            
          </div>
          {items.map((item) => (
            <ConversationBox
              key={item.id}
              data={item}
              selected={conversationId === item.id}
            />
          ))}
        </div>
      </aside>
    )
}

export default ConversationList