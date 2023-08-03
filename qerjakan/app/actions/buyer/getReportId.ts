// Objective:
// The objective of the function is to retrieve a report by its ID from the Prisma database and return it with its associated order and service information.

// Inputs:
// - params: an object containing the report ID as an optional parameter.

// Flow:
// 1. Destructure the reportId from the params object.
// 2. Use Prisma's findUnique method to retrieve the report with the specified ID from the database.
// 3. Include the associated order and service information in the query.
// 4. If the report is not found, return null.
// 5. Return the report object with its associated order and service information.

// Outputs:
// - A report object with its associated order and service information, or null if the report is not found.

// Additional aspects:
// - The function uses Prisma to interact with the database.
// - The function handles errors by throwing an error object.

import prisma from "@/app/libs/prismadb";

interface IParams {
  reportId?: string;
}
export default async function getReportById(params: IParams) {
  try {
    const { reportId } = params;
    if (!reportId) {
      return null;
    }
    try {
      const report = await prisma.report.findUnique({
        where: {
          id: reportId,
        },
        include: {
          order: {
            include: {
              service: true,
            },
          },
        },
      });

      if (!report) {
        return null;
      }

      return {
        ...report,
        order: {
          ...report.order,
          service: {
            ...report.order.service,
          },
        },
      };
    } catch (error: any) {
      throw new Error(`Error in getReportById: ${error.message}`);
    }
  } catch (error: any) {
    throw new Error(`Error in getReportById: ${error.message}`);
  }
}
