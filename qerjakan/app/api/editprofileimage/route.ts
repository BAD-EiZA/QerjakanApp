import { NextResponse } from "next/server";
import prisma from '@/app/libs/prismadb';
import getCurrentUser from "@/app/actions/user/getCurrentUser";

export async function PATCH(request: Request,){
    
    const currUser = await getCurrentUser()
    if(!currUser){
        return NextResponse.json({message: "You are not logged in, please log in", statusCode: 401})
    }
        const body = await request.json();
        const {
            image,

        } = body
        const updateProfile = await prisma.user.update({
            where: {
                id: currUser?.id
            },
            data: {
                image
            }
        });

        return NextResponse.json({message: "Success to edit Profile", data: updateProfile, statusCode: 200});

}