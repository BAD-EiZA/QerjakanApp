import ClientOnly from "@/app/components/ClientOnly"
import ResetClient from "./ResetPasswordClient"
import getForgotToken from "@/app/actions/common/getForgotToken"

interface IParams {
    token: string
}
const ResetPaswwordPage = async ({ params }: { params: IParams }) => {
    const getToken = await getForgotToken(params)
    if(!getToken) {
        return (
            <div className="flex justify-center items-center">Token is Expired</div>
        )
    }
    return(
        <div className="flex justify-center items-center">
            <ClientOnly>
                <ResetClient data={getToken}/>
            </ClientOnly>
        </div>
    )
}

export default ResetPaswwordPage