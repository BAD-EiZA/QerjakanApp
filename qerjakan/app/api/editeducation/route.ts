import { NextResponse } from "next/server";
import prisma from '@/app/libs/prismadb';
import getCurrentUser from "@/app/actions/user/getCurrentUser";

export async function PATCH(request: Request,){
    
    const currUser = await getCurrentUser()
    if (!currUser) {
        return NextResponse.json({ message: "Not Authorized", statusCode: 401 });
      }
        const body = await request.json();
        
        const {
            college_name,
            college_title,
            college_major,

        } = body
        const getUser = await prisma.user.findFirst({
            where: {
              id: currUser.id,
            },
          });
          const updateProfile = await prisma.profile.update({
            where: {
              userId: getUser?.id,
            },
            data: {
                college_name: college_name.value,
                college_title: college_title.value,
                college_major: college_major.value
            },
          });
        
          return NextResponse.json({
            message: "Your Education Has Been Updated",
            data: updateProfile,
            statusCode: 200,
          });

}