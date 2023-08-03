
import getCurrUser from "@/app/actions/user/getCurrUser";
import prisma from "@/app/libs/prismadb";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (req: NextRequest) => {
    if (req.method !== "PATCH") {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 })
    }
    try {
        const getUser = await getCurrUser()
        if(!getUser){
            return NextResponse.json({message: "You are not logged in, please log in", statusCode: 401})
        }
        const {id} = await req.json()
        if (!id) {
            return NextResponse.json({ message: 'Invalid id' , statusCode: 400})
        }
        const report = await prisma.report.findUnique({
            where: {
                id: id
            }
        });
        if (!report) {
            return NextResponse.json({ message: 'Report not found' , statusCode: 404});
        }
        const updatedReport = await prisma.report.update({
            where: {
                id: id
            },
            data:{
                reportStatus: "deliver",
                order: {
                    update: {
                        isCompleted: true,
                        orderStatus: "complete",
                        onReview: false
                    }
                }
            },
            include: {
                order: {
                    include: {
                        service: true
                    }
                }
            }
            
        });
        await prisma.notification.createMany({
            data: [
                {
                    body: "Your order " + updatedReport.order.service.title + " has completed, please give review to the order.",
                    userId: updatedReport.order.buyerId,
                    NotifRole: "Buyer",
                    NotifType: "Updates"
                },
                {
                    body: "Order from" + updatedReport.order.buyerName + " has been completed",
                    userId: updatedReport.order.sellerId,
                    NotifRole: "Seller",
                    NotifType: "Updates"
                }
            ]
        })
        await prisma.companyBalance.update({
            where: {
                id: "648149e28e485a3300f4b519"
            },
            data: {
                balance: {increment: -updatedReport.order.price}
            }
        })
        await prisma.user.update({
            where: {
                id: updatedReport.order.sellerId
            },
            data: {
                userBalance: {increment: updatedReport.order.price}
            }
        })
        return NextResponse.json({ message: 'Success to deliver', data: updatedReport , statusCode: 200})
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error updating report' }, { status: 500 });
    }
}