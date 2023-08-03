import getCurrentUser from "../user/getCurrentUser";
import prisma from "@/app/libs/prismadb"

const getTransactionNotif = async() => {
    const currUser = await getCurrentUser();
    if(!currUser){
        return [];
    }

    try {
        const countNotifTransaction = await prisma.notification.count({
            where:{
                userId: currUser?.id,
                OR: [
                    {
                        NotifType: "Updates"
                    },
                    {
                        NotifType: "Transaction"
                    }
                ]
            }
          })
        return countNotifTransaction
    } catch (error) {
        return [];
    }
}

export default getTransactionNotif;