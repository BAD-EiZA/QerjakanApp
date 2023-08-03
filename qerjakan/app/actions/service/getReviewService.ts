import prisma from "@/app/libs/prismadb";

interface IParams {
  serviceId?: string;
}

export default async function getReviewService(params: IParams) {
    try {
        const { serviceId } = params;
        const review = await prisma.reviews.findMany({
          where: {
            serviceId,
          },
          include: {
            user: true
          }
        });
    
        
        return review
        
      } catch (error: any) {
        throw new Error(error);
      }
}