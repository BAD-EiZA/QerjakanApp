import getCurrUser from "@/app/actions/user/getCurrUser";
import getCurrentUser from "@/app/actions/user/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    if (req.method !== "POST") {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 500 })
    }
    const {id} = await req.json()
    if (!id) {
        return NextResponse.json({ message: 'Invalid id provided' }, { status: 400 })
    }
    
    const orders = await prisma.order.findUnique({
        where: {
            id
        }
    })

    if (!orders) {
        return NextResponse.json({ message: 'Order not found' }, { status: 404 })
    }
    if(orders.orderStatus === "active"){
        await prisma.order.update({
            where: {
                id: orders.id
            },
            data: {
                orderStatus: "complete",
            }
        })
        const getReportId = await prisma.report.findFirst({
            where: {
                orderid: orders.id
            }
        })
        await prisma.report.update({
            where: {
                id: getReportId?.id
            },
            data: {
                reportStatus: "deliver"
            }
        })
        await prisma.user.update({
            where:{
                id: orders.sellerId
            },
            data:{
                userBalance: {increment: orders.price}
            }
        })
        await prisma.companyBalance.update({
            where: {
                id: "648149e28e485a3300f4b519"
            },
            data: {
                balance: {increment: -orders.price}
            }
        })
        return NextResponse.json({})
    }
    else{
        return NextResponse.json({message: "Your order already complete"})
    }
    
    
    
}