import getCurrUser from "@/app/actions/user/getCurrUser";
import getReportById from "@/app/actions/buyer/getReportId";
import ClientOnly from "@/app/components/ClientOnly";
import ReportClient from "./ReportClient";
import { redirect } from "next/navigation";
interface IParams {
    reportId?: string;
}

const Reports = async ({ params }: { params: IParams }) => {
    const reportId = await getReportById(params)
    const currUser = await getCurrUser()
    if(!currUser) {
        return redirect('/')
    }
    if(!reportId){
        return null
    }
    return (
        <ClientOnly>
            <ReportClient
            report={reportId}/>
        </ClientOnly>
    )
}

export default Reports