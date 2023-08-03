import getCurrUser from "@/app/actions/user/getCurrUser"
import ClientOnly from "@/app/components/ClientOnly"
import ComplainClient from "./ComplainClient"
import getComplain from "@/app/actions/admin/getComplain"

const ComplainPage = async() => {
    const getUser = await getCurrUser()
    const getsComplain = await getComplain()

    if(!getUser){
        return (
            <div>Please Login</div>
        )
    }
    if(getUser.userRole !== "Admin"){
        return (
            <div>Your are not have permission to see this page</div>
        )
    }

    return (
        <ClientOnly>
        <ComplainClient data={getsComplain}/>
        </ClientOnly>
    )
}

export default ComplainPage