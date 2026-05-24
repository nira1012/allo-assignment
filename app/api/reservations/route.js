import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const body = await req.json();

    const { inventoryId, quantity } = body;

    const result = await prisma.$transaction(async (tx) => {
      // Find inventory
      const inventory = await tx.inventory.findUnique({
        where: {
          id: inventoryId,
        },
      });

      // Inventory not found
      if (!inventory) {
        throw new Error("Inventory not found");
      }

      // Calculate available stock
      const available =
        inventory.totalStock - inventory.reservedStock;

      // Prevent overbooking
      if (available < quantity) {
        throw new Error("Not enough stock");
      }

      // Update reserved stock
      await tx.inventory.update({
        where: {
          id: inventoryId,
        },
        data: {
          reservedStock: {
            increment: quantity,
          },
        },
      });

      // Create reservation
      const reservation = await tx.reservation.create({
        data: {
          inventoryId,
          quantity,
          status: "pending",
          expiresAt: new Date(
            Date.now() + 10 * 60 * 1000
          ),
        },
      });

      return reservation;
    });

    return Response.json(result);

  } catch (error) {
    console.log(error);

    return Response.json(
      {
        error: error.message,
      },
      {
        status: 409,
      }
    );
  }
}