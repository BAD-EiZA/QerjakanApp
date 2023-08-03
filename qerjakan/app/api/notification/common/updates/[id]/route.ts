import getCurrUser from "@/app/actions/user/getCurrUser";
import prisma from "@/app/libs/prismadb";
import { NextRequest, NextResponse } from "next/server";

export const POST= async (req: NextRequest) => {
    if (req.method !== "POST") {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 500 })
    }
    try {
        const {id} = await req.json()
        const getUser = await getCurrUser()
        if(!getUser){
            return null
        }
        const getNotif = await prisma.notification.findFirst({
            where: {
                id: id,
                userId: getUser.id,
            }
        })
        if(!getNotif){
            
            return NextResponse.json({ message: 'To Chat' }, { status: 200 });
        }
        else{
            
            const DeleteNotif = await prisma.notification.delete({
                where: {
                    id: getNotif?.id
                }
            })
            return NextResponse.json({ message: 'Notification deleted successfully', data: DeleteNotif }, { status: 200 })
        }
        
    } catch (error) {
        return NextResponse.json({ message: 'Error deleting notification' }, { status: 500 });
    }
}