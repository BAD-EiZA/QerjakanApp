import ClientOnly from "@/app/components/ClientOnly"
import SellerRefundClient from "./SellerRefundClient"
import getSellerOrderRefund from "@/app/actions/seller/getRefundSeller"


const RefundPage = async() => {
    const getRefundSeller = await getSellerOrderRefund()
  return (
    <ClientOnly>
        <SellerRefundClient orderData={getRefundSeller} />
    </ClientOnly>
  )
}

export default RefundPage