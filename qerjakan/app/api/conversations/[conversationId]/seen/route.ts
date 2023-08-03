import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/user/getCurrentUser";
import { pusherServer } from '@/app/libs/pusher'
import prisma from "@/app/libs/prismadb";

interface IParams {
  conversationId?: string;
}

export async function POST(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    const currentUser = await getCurrentUser();
    const {
      conversationId
    } = params;

    
    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Find existing conversation
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        messages: {
          include: {
            seen: true
          },
        },
        users: true,
      },
    });

    if (!conversation) {
      return new NextResponse('Invalid ID', { status: 400 });
    }

    // Find last message
    const lastMessage = conversation.messages[conversation.messages.length - 1];

    if (!lastMessage) {
      return NextResponse.json(conversation);
    }

    // Update seen of last message
    const updatedMessage = await prisma.message.update({
      where: {
        id: lastMessage.id
      },
      include: {
        sender: true,
        seen: true,
      },
      data: {
        seen: {
          connect: {
            id: currentUser.id
          }
        }
      }
    });

    // Update all connections with new seen
    await pusherServer.trigger(currentUser.email, 'conversation:update', {
      id: conversationId,
      messages: [updatedMessage]
    });
    const getNotif = await prisma.notification.findFirst({
      where: {
        userId: currentUser.id,
        keyId: String(conversationId),
        NotifType: "Chat"
      }
    })
    
    // If user has already seen the message
    if (lastMessage.seenIds.indexOf(currentUser.id) !== -1) {
      
      return NextResponse.json(conversation);
    }

    // Update last message seen
    
    if(getNotif){
      const deleteNotif = await prisma.notification.delete({
        where: {
          id: getNotif.id
        }
      })
      await pusherServer.trigger(conversationId!, 'message:update', updatedMessage);
      return NextResponse.json(deleteNotif)
    }
    else{
      console.log("Kadal" , getNotif)
    }
    await pusherServer.trigger(conversationId!, 'message:update', updatedMessage);
    return new NextResponse('Success');
  } catch (error) {
    console.log(error, 'ERROR_MESSAGES_SEEN')
    return new NextResponse('Error', { status: 500 });
  }
}