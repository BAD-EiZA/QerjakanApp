import { NextResponse } from "next/server";
import prisma from '@/app/libs/prismadb';

export async function GET(
){

  const user = await prisma.languages.findMany({
    select: {
      languages_name:true
    }
  })
  

  return NextResponse.json(user)

}