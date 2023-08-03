// Objective:
// The objective of the getConversation function is to retrieve a list of conversations for the current user, including the users involved in each conversation and the messages exchanged between them.

// Inputs:
// - None explicitly defined, but the function relies on the getCurrentUser function to retrieve the current user.

// Flow:
// 1. Call getCurrentUser to retrieve the current user.
// 2. If no current user is found, return an empty array.
// 3. Use Prisma to query the conversation table for all conversations involving the current user.
// 4. Include the users involved in each conversation and the messages exchanged between them.
// 5. Order the conversations by the date of the last message.
// 6. Return the list of conversations.

// Outputs:
// - An array of conversations, each including the users involved and the messages exchanged.

// Additional aspects:
// - The function handles errors by returning an empty array.
// - The function relies on the Prisma ORM to interact with the database.

import getCurrUser from "../user/getCurrUser";
import getCurrentUser from "../user/getCurrentUser";
import prisma from "@/app/libs/prismadb"

const getConversation = async() => {
    const currUser = await getCurrUser();
    

    try {
        const conversations = await prisma.conversation.findMany({
            orderBy: {
                lastMessageAt: "desc"
            },
            where: {
                userIds: {
                    has: currUser?.id
                }
            },
            include: {
                users: true,
                messages: {
                    
                    include: {
                        sender: true,
                        seen: true
                    }
                }
            }
        })
        return conversations
    } catch (error) {
        return [];
    }
}

export default getConversation;