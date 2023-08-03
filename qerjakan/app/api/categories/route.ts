import { NextResponse } from "next/server";
import prisma from '@/app/libs/prismadb';

export async function GET(
){

  const user = await prisma.category.findMany({
    include: {
      subcategory: true
    }
  })
  

  return NextResponse.json(user)

}