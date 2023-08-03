import prisma from "@/app/libs/prismadb"
import getCurrUser from "./getCurrUser"

export default async function getBankUser() {
    try {
        const curruser = await getCurrUser()
        if(!curruser){
            return null
        }
        const userBank = await prisma.userBankAccount.findUnique({
            where: {
                userId: curruser.id
            }
        })

        return userBank
    } catch (error: any) {
        return null
    }
}