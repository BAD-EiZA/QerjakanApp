import prisma from "@/app/libs/prismadb";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 }
    );
  }
  try {
    const { email } = await req.json();

    const getEmail = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (!getEmail) {
      return null;
    }
    if(!getEmail.email){
      return null
    }
    if (getEmail.emailVerified === null) {
      const currentTime = new Date(Date.now() - 1 * 60 * 1000);

      await prisma.forgotPasswordToken.deleteMany({
        where: {
          createdAt: {
            lte: currentTime,
          },
          email: getEmail.email,
          tokenType: "VerifyAccount",
        },
      });
      await prisma.profile.delete({
        where: {
          userId: getEmail.id,
        },
      });
      await prisma.user.deleteMany({
        where: {
          email: getEmail.email,
        },
      });

      return NextResponse.json(
        { message: "Delete Token Success" },
        { status: 200 }
      );
    } else {
      const currentTime = new Date(Date.now() - 1 * 60 * 1000);

      await prisma.forgotPasswordToken.deleteMany({
        where: {
          createdAt: {
            lte: currentTime,
          },
          email: getEmail.email,
          tokenType: "VerifyAccount",
        },
      });
      return NextResponse.json(
        { message: "Delete Token Not Success" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error delete token" },
      { status: 500 }
    );
  }
};
