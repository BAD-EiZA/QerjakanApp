import getUsers from "../actions/user/getManyUser";
import getConversation from "../actions/common/getConversation";
import { NextAuthProvider } from "../components/AuthProvider";
import ConversationList from "./component/ConversationList";

export default async function ConversationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const conversations = await getConversation();
  const users = await getUsers();

  return (
    <div className="h-full border px-2">
      <NextAuthProvider>
        <div className="flex h-full border">
            <ConversationList
            users={users}
            title="Messages"
            initialItems={conversations}
            />
            {children}
        </div>
        
        
      </NextAuthProvider>
    </div>
  );
}
