require("dotenv").config();

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // Products
  const shoe = await prisma.product.create({
    data: {
      name: "Running Shoes",
    },
  });

  const watch = await prisma.product.create({
    data: {
      name: "Smart Watch",
    },
  });

  // Warehouses
  const chennai = await prisma.warehouse.create({
    data: {
      name: "Chennai Warehouse",
    },
  });

  const bangalore = await prisma.warehouse.create({
    data: {
      name: "Bangalore Warehouse",
    },
  });

  // Inventory
  await prisma.inventory.createMany({
    data: [
      {
        productId: shoe.id,
        warehouseId: chennai.id,
        totalStock: 10,
        reservedStock: 0,
      },
      {
        productId: shoe.id,
        warehouseId: bangalore.id,
        totalStock: 5,
        reservedStock: 0,
      },
      {
        productId: watch.id,
        warehouseId: chennai.id,
        totalStock: 7,
        reservedStock: 0,
      },
    ],
  });

  console.log("Seed data added!");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });