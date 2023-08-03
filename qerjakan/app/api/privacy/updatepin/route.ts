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
    if (!currUser.hashedPassword) {
      return;
    }
    const { password, pin, newPin } = await req.json();
    const findUser = await prisma.user.findFirst({
      where: {
        id: currUser.id,
      },
    });
    if (Number(newPin) === findUser?.pin) {
      return NextResponse.json({ message: "Pin cannot be same", statusCode: 400 });
    } 
    
    if (Number(pin) === findUser?.pin) {
      const updatePassword = await prisma.user.update({
        where: {
          id: currUser.id,
        },
        data: {
          pin: Number(newPin),
        },
      });

      return NextResponse.json({
        message: "Update Pin Success",
        data: updatePassword,
        statusCode: 200,
      });
    } else {
      return NextResponse.json({
        message: "Password incorrect",
        statusCode: 400,
      });
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Error update password", statusCode: 500 },
      { status: 500 }
    );
  }
};
