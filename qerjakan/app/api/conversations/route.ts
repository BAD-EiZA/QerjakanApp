import getCurrentUser from "@/app/actions/user/getCurrentUser";
import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";

export async function POST(
  request: Request,
) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const {
      userId,
    } = body;

    if (!currentUser?.id || !currentUser?.email) {
      return NextResponse.json({message: "You are not logged in, please log in", statusCode: 401});
    }

    const existingConversations = await prisma.conversation.findMany({
      where: {
        OR: [
          {
            userIds: {
              equals: [currentUser.id, userId]
            }
          },
          {
            userIds: {
              equals: [userId, currentUser.id]
            }
          }
        ]
      }
    });

    const singleConversation = existingConversations[0];

    if (singleConversation) {
      return NextResponse.json({message: "Conversation Exist", data: singleConversation, statusCode: 200});
    }

    const newConversation = await prisma.conversation.create({
      data: {
        users: {
          connect: [
            {
              id: currentUser.id
            },
            {
              id: userId
            }
          ]
        }
      },
      include: {
        users: true
      }
    });

    newConversation.users.map((user) => {
      if (user.email) {
        pusherServer.trigger(user.email, 'conversation:new', newConversation);
      }
    });
    await prisma.notification.create({
      data: {
        body: "New Conversation",
        NotifType: "Chat",
        userId: userId,
        keyId: String(newConversation.id)
      }
    })
    return NextResponse.json({message: "New Conversation", data: newConversation, statusCode: 200})
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 });
  }
}
