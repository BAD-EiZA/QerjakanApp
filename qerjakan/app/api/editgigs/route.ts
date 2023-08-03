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
    const getUser = await getCurrUser()
    if(!getUser){
      return NextResponse.json({message: "You are not logged in, please log in", statusCode: 401})
    }
    const body = await req.json();
    const {
      title,
      description,
      image,
      price,
      deliveryTime,
      revisions,
      id
    } = body;
    
    const getService = await prisma.service.findFirst({
        where: {
            id: id
        }
    })
    if(!getService){
        return NextResponse.json ({message: "Service not found", statusCode: 400})
    }

    const updateService = await prisma.service.updateMany({
        where: {
            id: getService.id
        },
        data: {
            deliveryTime: Number(deliveryTime),
            description: description,
            image: image,
            price: Number(price),
            revisions: Number(revisions),
            title: title,

        }
    })

    return NextResponse.json({ message: "Update Gig Success", statusCode: 200 , data: updateService});
  } catch (error) {
    return NextResponse.json(
      { message: "Error update gig" },
      { status: 500 }
    );
  }
};
