import prisma from "@/app/libs/prismadb";
import { NextRequest, NextResponse } from "next/server";
import shortUUID from "short-uuid";



export const POST = async (
  req: NextRequest,
) => {
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 }
    );
  }
  try {
    const {token} = await req.json()
    
    
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error make token" }, { status: 500 });
  }
};
