import { NextResponse } from "next/server";
import prisma from '@/app/libs/prismadb';
import getCurrentUser from "@/app/actions/user/getCurrentUser";
import getCurrUser from "@/app/actions/user/getCurrUser";

export async function POST(request: Request,){
    
    const currUser = await getCurrUser()
    if(!currUser){
        return NextResponse.json({message: "You are not logged in, please log in", statusCode: 401})
    }
        const body = await request.json();
        const {
            linkReport,
            imageReport,
            orderid,
            description
        } = body
        const sendreport = await prisma.report.create({
            data:{
                orderid: orderid,
                linkReport,
                imageReport,
                description
            },
            
            
            
        })
        

        await prisma.report.update({
            where: {
                id: sendreport.id
            },
            data: {
                order: {
                    update: {
                        onReview: true
                    }
                }
            }
        })
        const getOrder = await prisma.order.findUnique({
            where:{
                id: sendreport.orderid
            },
            include: {
                service: {
                    select: {
                        title: true
                    }
                }
            }
        })
        if(!getOrder){
            return ''
        }
        await prisma.notification.create({
            data:{
                body: "You have a new progress report on "+ getOrder.service.title + " order from seller",
                userId: getOrder.buyerId,
                NotifType: "Updates" 
            }
        })

        return NextResponse.json({message: "Send Report Success", data: sendreport, statusCode: 200});

}