import getCurrUser from "@/app/actions/user/getCurrUser";
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
    const getUser = await getCurrUser()

    const getEmail = await prisma.user.findFirst({
      where: {
        email: getUser?.email,
      },
    });
    if (!getEmail) {
      return null;
    }
    if (getEmail.isSeller === false) {
      const currentTime = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

      await prisma.forgotPasswordToken.deleteMany({
        where: {
          createdAt: {
            lte: currentTime,
          },
          tokenType: "VerifySeller"
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
