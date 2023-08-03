
import getCurrUser from "@/app/actions/user/getCurrUser";
import prisma from "@/app/libs/prismadb";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    if (req.method !== "POST") {
        return NextResponse.json({ message: 'Method not allowed' , statusCode: 500})
    }
    try {
        const getUser = await getCurrUser()
        if(!getUser){
            return NextResponse.json({message: "You are not logged in, please log in", statusCode: 401})
        }
        const {serviceId, buyerId,
        image,reviewText,rating} = await req.json()
        if (!serviceId) {
            return NextResponse.json({ message: 'Invalid id' , statusCode: 400})
        }
        const createReview = await prisma.reviews.create({
            data:{
                serviceId: serviceId,
                reviewerId: buyerId,
                rating: Number(rating),
                image: image,
                reviewText: reviewText

            }
        })
        const getOrder = await prisma.order.findFirst({
            where: {
                buyerId: buyerId
            }
        })
        if(!getOrder) {
            return NextResponse.json({ message: 'Error give Review' , statusCode: 500});
        }
        await prisma.order.update({
            where: {
                id: getOrder.id
            },
            data: {
                reviewed: true
            }
        })
        return NextResponse.json({ message: 'Create Review Success', data: createReview , statusCode: 200})
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error give Review' , statusCode: 500});
    }
}