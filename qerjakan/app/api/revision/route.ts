
import getCurrUser from "@/app/actions/user/getCurrUser";
import prisma from "@/app/libs/prismadb";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (req: NextRequest) => {
    if (req.method !== "PATCH") {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 500 })
    }
    try {
        const getUser = await getCurrUser()
        if(!getUser){
            return NextResponse.json({message: "You are not logged in, please log in", statusCode: 401})
        }
        const {id} = await req.json()
        const report = await prisma.report.update({
            where: {
                id: id
            },
            data:{
                reportStatus: "revision",
                order: {
                    update: {
                        revisionCount: {increment: -1},
                        onReview: false
                    }
                }
            },
            include: {
                order:true
            }
        })
        const getOrder = await prisma.order.findUnique({
            where: {
                id: report.orderid
            }
        })
        if(!getOrder){
            return ""
        }
        await prisma.notification.create({
            data:{
                body: "You get the revision from the user " + getOrder.buyerName,
                NotifType: "Updates",
                userId: getOrder.sellerId
            }
        })
        return NextResponse.json({message:"Success to send Revision", data: report, statusCode: 200})
    } catch (error) {
        console.error(error);
        return NextResponse.error();
    }
}