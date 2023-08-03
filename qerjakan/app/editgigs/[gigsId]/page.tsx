import getGigById from "@/app/actions/seller/getGigsEdit";
import ClientOnly from "@/app/components/ClientOnly";
import EditGigClient from "./EditGigClient";
import getCurrUser from "@/app/actions/user/getCurrUser";
import { redirect } from "next/navigation";

interface IParams {
    gigsId?: string;
    
}
const EditGigPage = async ({ params }: { params: IParams }) => {
    const getGig = await getGigById(params)
    const getUser = await getCurrUser()
    if(!getUser){
        return redirect('/')
    }
    return (
        <ClientOnly>
            <EditGigClient data={getGig}/>
        </ClientOnly>
    )
}

export default EditGigPage