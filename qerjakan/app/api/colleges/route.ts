import { NextResponse } from "next/server";
import prisma from '@/app/libs/prismadb';

export async function GET(
){

  const user = await prisma.education.findMany()
  

  return NextResponse.json(user)

}