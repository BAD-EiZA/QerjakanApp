import { NextResponse } from "next/server";
import prisma from '@/app/libs/prismadb';

export async function GET(
){

  const user = await prisma.skills.findMany()
  

  return NextResponse.json(user)

}