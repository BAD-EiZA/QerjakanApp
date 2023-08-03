import getCurrUser from "@/app/actions/user/getCurrUser";
import getCurrentUser from "@/app/actions/user/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
export const PATCH = async (req: NextRequest) => {
  if (req.method !== "PATCH") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 500 }
    );
  }
  try {
    const { password, token } = await req.json();
    const findEmail = await prisma.forgotPasswordToken.findFirst({
      where: {
        token: token,
      },
    });
    const findmanyToken = await prisma.forgotPasswordToken.findMany({});
    if (!findEmail || findmanyToken.length === 0) {
       return NextResponse.error()
    } else {
      const hashedPassword = await bcrypt.hash(password, 12);
      const updateUser = await prisma.user.update({
        where: {
          email: findEmail?.email,
        },
        data: {
          hashedPassword: hashedPassword,
        },
      });
      await prisma.forgotPasswordToken.deleteMany({
        where: {
          email: findEmail.email
        }
      })
      return NextResponse.json({message: "forgot password success", data: updateUser})
    }
  } catch (error) {
    return NextResponse.json({ message: 'Error update password' }, { status: 500 });
  }
};
