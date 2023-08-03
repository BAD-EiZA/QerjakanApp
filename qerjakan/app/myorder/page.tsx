import ClientOnly from "@/app/components/ClientOnly"
import getMyOrder, {IListingsParams} from "../actions/buyer/getMyOrder"
import MyOrderStatus from "../components/myorderstatus/myorderstatus";
import MyOrderClient from "./MyOrderClient";
import getReportSeller from "../actions/seller/getReportSeller";
import getCurrUser from "../actions/user/getCurrUser";
import { redirect } from "next/navigation";
export const dynamic = 'force-dynamic'

interface MyOrderProps {
    searchParams: IListingsParams
};


const MyOrder = async ({ searchParams }: MyOrderProps) => {
    const getOrder = await getMyOrder(searchParams);
    const getUser = await getCurrUser()
    if(!getUser){
        return redirect('/')
    }

    return (
        <ClientOnly>
            <MyOrderClient
            order={getOrder}
            />
        </ClientOnly>
    )
}
export default MyOrder