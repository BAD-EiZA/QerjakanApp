import ClientOnly from "@/app/components/ClientOnly"

import getForgotToken from "@/app/actions/common/getForgotToken"
import VerifySellerClient from "./VerifySellerClient"


interface IParams {
    token: string
}
const VerifySellerPage = async ({ params }: { params: IParams }) => {
    const getToken = await getForgotToken(params)
    if(!getToken) {
        return (
            <div className="flex justify-center items-center">Token is Expired</div>
        )
    }
    return(
        <div className="flex justify-center items-center">
            <ClientOnly>
                <VerifySellerClient data={getToken}/>
            </ClientOnly>
        </div>
    )
}

export default VerifySellerPage