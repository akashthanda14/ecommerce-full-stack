import prisma from '../lib/prisma.js';

export const createOrder = async (data) => {
  return await prisma.order.create({
    data,
    include: { items: true },
  });
};

export const updateOrder = async (orderId, updateData) => {
  return await prisma.order.update({
    where: { id: Number(orderId) },
    data: updateData,
  });
};

export const getAllOrders = async () => {
  return await prisma.order.findMany({
    include: {
      user: true,
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      date: 'desc',
    },
  });
};

export const getUserOrders = async (userId) => {
  return await prisma.order.findMany({
    where: { userId: Number(userId) },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      date: 'desc',
    },
  });
};

export const getOrderByReceiptId = async (orderId) => {
  return await prisma.order.findUnique({
    where: { id: Number(orderId) },
    include: {
      items: true,
    },
  });
};
