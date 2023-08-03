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
    const currUser = await getCurrUser();
    if (!currUser) {
      return NextResponse.json({message: "You are not logged in, please log in", statusCode: 401})
    }
    if(!currUser.hashedPassword){
        return ;
    }
    const { password, pin } = await req.json();
    const findUser = await prisma.user.findFirst({
      where: {
        id: currUser.id,
      },
    });
    const hashedPassword = await bcrypt.hash(password, 12);
    const isCorrectPassword = await bcrypt.compare(
        password,
        currUser.hashedPassword
      );
    if (isCorrectPassword) {
      return NextResponse.json({
        message: "Password cannot be same",
        statusCode: 400,
      });
    }
    
    if (Number(pin) !== findUser?.pin) {
      return NextResponse.json({ message: "Pin Incorect", statusCode: 400 });
    } else {
      const updatePassword = await prisma.user.update({
        where: {
          id: currUser.id,
        },
        data: {
          hashedPassword,
        },
      });

      return NextResponse.json({
        message: "Update Password Success",
        data: updatePassword,
        statusCode: 200,
      });
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Error update password" },
      { status: 500 }
    );
  }
};
