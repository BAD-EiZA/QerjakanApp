import getCurrUser from "@/app/actions/user/getCurrUser";
import getCurrentUser from "@/app/actions/user/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { NextRequest, NextResponse } from "next/server";

import bcrypt from "bcrypt";
export const POST = async (req: NextRequest) => {
  if (req.method !== "POST") {
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
    const { bank_name, account_name, account_number, pin } = await req.json();
    const findUser = await prisma.user.findFirst({
      where: {
        id: currUser.id,
      },
    });

    if (Number(pin) !== findUser?.pin) {
      return NextResponse.json({ message: "Pin Incorect", statusCode: 400 });
    } else {
      const getBank = await prisma.userBankAccount.findFirst({
        where: {
          userId: findUser.id,
        },
      });
      if (!getBank) {
        const updatePassword = await prisma.userBankAccount.create({
          data: {
            userId: findUser.id,
            account_name: account_name,
            bank_name: bank_name,
            account_number: Number(account_number),
          },
        });
        console.log(updatePassword);
        return NextResponse.json({
          message: "Update Bank Account Success",
          data: updatePassword,
          statusCode: 200,
        });
      }
      else{
        const updatePassword = await prisma.userBankAccount.update({
          where:{
            userId: getBank.userId
          },
          data: {
            
            account_name: account_name,
            bank_name: bank_name,
            account_number: Number(account_number),
          },
        });
        console.log(updatePassword);
        return NextResponse.json({
          message: "Update Bank Account Success",
          data: updatePassword,
          statusCode: 200,
        });
      }
    }
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
};
