// Objective:
// The objective of the getConversationById function is to retrieve a conversation object from the database by its ID, including the users associated with it, and return it as output.

// Inputs:
// - conversationId: a string representing the ID of the conversation to retrieve.

// Flow:
// 1. Call the getCurrentUser function to get the current user object.
// 2. If the currentUser object does not have an email property, return null.
// 3. Use the Prisma ORM to find the conversation object in the database by its ID, including the associated users.
// 4. Return the conversation object.

// Outputs:
// - conversation: a conversation object retrieved from the database, including the associated users.

// Additional aspects:
// - If an error occurs during the execution of the function, it will be caught and logged to the console, and null will be returned.
// - The getCurrentUser function is called at the beginning of the function to ensure that the current user is authenticated and authorized to access the conversation object.

import prisma from "@/app/libs/prismadb";
import getCurrentUser from "../user/getCurrentUser";

const getConversationById = async (conversationId: string) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.email) {
      throw new Error("Failed to get user email");
    }

    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
      },
    });

    if (!conversation?.users.some((user) => user.id === currentUser.id)) {
      return null;
    }
    return conversation;
  } catch (error: any) {
    console.log(error, "SERVER_ERROR");
    return null;
  }
};

export default getConversationById;
