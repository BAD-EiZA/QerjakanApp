import getCurrUser from "@/app/actions/user/getCurrUser";
import getCurrentUser from "@/app/actions/user/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (req: NextRequest) => {
    if (req.method !== "PATCH") {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 500 })
    }
    const {id} = await req.json()
    if (!id) {
        return NextResponse.json({ message: 'Invalid id provided' }, { status: 400 })
    }
    const getUser = await getCurrUser()
    if(!getUser){
        return NextResponse.json({message: "You are not logged in, please log in", statusCode: 401})
    }
    const orders = await prisma.order.update({
        where: {
            id
        },
        data: {
            orderStatus: 'active',
            reviewed: false,
            startAt: new Date()
        },
        include: {
            service:true
        }
    })

    if (!orders) {
        return NextResponse.json({ message: 'Order not found' }, { status: 404 })
    }
    try {
        await prisma.notification.create({
            data:{
                body: "Your order " + orders.service.title + " has been approved by the seller",
                userId: orders.buyerId,
                NotifRole: "Buyer",
                NotifType: 'Transaction'
            }
        })
    } catch (error) {
        console.error('Error creating notification:', error)
        return NextResponse.json({ message: 'Error creating notification' }, { status: 500 })
    }
    
    return NextResponse.json({message: "Success Accept Order", statusCode: 200})
}