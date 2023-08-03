import { getServerSession } from "next-auth/next"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import prisma from "@/app/libs/prismadb"

export async function getSession() {
    return await getServerSession(authOptions);
}

const getUsers = async () => {
    const session = await getSession();
  
    if (!session?.user?.email) {
      return [];
    }
  
    try {
      const users = await prisma.user.findMany({
        orderBy: {
          createdAt: 'desc'
        },
        where: {
          NOT: {
            email: session.user.email
          }
        }
      });
  
      return users;
    } catch (error: any) {
      return [];
    }
  };
  
  export default getUsers;