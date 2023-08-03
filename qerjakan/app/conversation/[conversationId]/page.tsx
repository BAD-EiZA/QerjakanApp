import getConversationById from "@/app/actions/common/getConnversationById"
import getMessage from "@/app/actions/common/getMessage"
import EmptyMessage from "../component/EmptyMessage"
import Header from "./component/Header"
import Body from "./component/Body"
import Form from "./component/Form"
import getCurrUser from "@/app/actions/user/getCurrUser"
import { redirect } from "next/navigation"
export const dynamic = 'force-dynamic'
interface IParams {
    conversationId: string
}

const ConversationId = async({params}: {params: IParams}) => {
    const conversation = await getConversationById(params.conversationId)
    const message = await getMessage(params.conversationId)

    if(!conversation){
        return(
            <div className="lg:pl-80">
                <div className="h-full flex flex-col">
                    <EmptyMessage/>
                </div>
            </div>
        )
    }
    return (
        <div className=" h-full w-full">
            <div className=" h-[620px] flex flex-col  border">
                <Header conversation={conversation}/>
                <Body initialMessages={message}/>
                <Form/>
            </div>
        </div>
    )
}

export default ConversationId