import prisma from "@/app/libs/prismadb";

interface IParams {
  serviceId?: string;
}

export default async function getReviewById(params: IParams) {
  try {
    const { serviceId } = params;
    const review = await prisma.reviews.findMany({
      where: {
        serviceId,
      },
      select: {
        rating: true,
      },
    });

    if (!review) {
      return null;
    }
    const totalReviews = review.length;
    if (totalReviews === 0) {
      return 0; // If no reviews found, return 0 as average rating
    }

    const totalRating = review.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / totalReviews;
    return averageRating
    
  } catch (error: any) {
    throw new Error(error);
  }
}
