import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/user/getCurrentUser";

export async function PATCH(request: Request) {
  const body = await request.json();
  const { token, pin } = body;
  const getToken = await prisma.forgotPasswordToken.findFirst({
    where: {
        token: token
    }
  })
  if(!getToken) {
    return NextResponse.error()
  }
  if(!getToken.email){
    return NextResponse.error()
  }
  
  const updateProfile = await prisma.user.update({
    where: {
      email: getToken.email
    },
    data: {
        emailVerified: new Date(),
        pin: Number(pin)
    }
  });

  return NextResponse.json(updateProfile);
}
