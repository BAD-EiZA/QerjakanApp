import ClientOnly from "@/app/components/ClientOnly"

import getForgotToken from "@/app/actions/common/getForgotToken"
import VerifyAccountClient from "./VerifyNewAccountClient"

interface IParams {
    token: string
}
const VerifyAccountPage = async ({ params }: { params: IParams }) => {
    const getToken = await getForgotToken(params)
    if(!getToken) {
        return (
            <div className="flex justify-center items-center">Token is Expired</div>
        )
    }
    return(
        <div className="flex justify-center items-center">
            <ClientOnly>
                <VerifyAccountClient data={getToken}/>
            </ClientOnly>
        </div>
    )
}

export default VerifyAccountPage