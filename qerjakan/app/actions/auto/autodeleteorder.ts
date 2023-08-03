import prisma from "@/app/libs/prismadb";

export async function autoDeleteOrder(magazineId: string) {
  try {
    const getOrder = await prisma.order.findFirst({
      where: {
        id: magazineId,
      },
    });
    if (getOrder?.orderStatus === "pending") {
      await prisma.order.delete({
        where: {
          id: magazineId,
        },
      });
    }

    console.log(`Magazine with ID ${magazineId} deleted successfully.`);
  } catch (error) {
    console.error(`Error deleting magazine with ID ${magazineId}:`, error);
  }
}
