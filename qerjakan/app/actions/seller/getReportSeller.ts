import prisma from "@/app/libs/prismadb"
import getCurrUser from "../user/getCurrUser"


export interface IReport {
    orderid?: string;
}
export default async function getReportSeller(orderids: IReport) {
    try {
        const curruser = await getCurrUser()
        const {orderid}= orderids;

        if(!curruser){
            return null
        }
        const getOrderBuyer = await prisma.order.findFirst({
            where: {
                buyerId: curruser.id
            }
        })
        if(!getOrderBuyer){
            return null
        }
        const getReport = await prisma.report.findMany({
            where:{
                orderid: orderid
            }
        })

        return getReport
    } catch (error: any) {
        return null
    }
}