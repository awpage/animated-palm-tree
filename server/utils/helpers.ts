import { customAlphabet } from "nanoid";
import type { PrismaClient } from "~~/generated/prisma";

export const generatePin = () => {
  const nanoid = customAlphabet(
    "abcdefghijklmnopqrstuvwxyz123456789",
    7
  );
  const pin = nanoid();

  return pin
};

export const checkIfPinIsAvailable = async (pin: string, prisma: PrismaClient) => {
  try {
    const isAlreadyTaken = await prisma.entries.findUnique({
      where: {
        id: pin
      }
    })

    return !isAlreadyTaken
  } catch (error) {
    console.log(error)
    return false
  }
}
