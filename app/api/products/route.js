import { prisma } from "@/lib/prisma";

export async function GET() {
  const products = await prisma.inventory.findMany({
    include: {
      product: true,
      warehouse: true,
    },
  });

  const formatted = products.map((item) => ({
    id: item.id,
    product: item.product.name,
    warehouse: item.warehouse.name,
    totalStock: item.totalStock,
    reservedStock: item.reservedStock,
    availableStock:
      item.totalStock - item.reservedStock,
  }));

  return Response.json(formatted);
}