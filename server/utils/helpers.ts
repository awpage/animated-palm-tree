import crypto from "crypto";

import { customAlphabet } from "nanoid";

import type { PrismaClient } from "~~/generated/prisma";

const algorithm = "aes-256-cbc";
const key = Buffer.from(process.env.ENCRYPTION_KEY, "hex");
const iv = Buffer.from(process.env.IV, "hex");

export const generatePin = () => {
  const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz123456789", 7);
  const pin = nanoid();

  return pin;
};

export const checkIfPinIsAvailable = async (
  pin: string,
  prisma: PrismaClient
) => {
  try {
    const isAlreadyTaken = await prisma.entries.findUnique({
      where: {
        id: pin,
      },
    });

    return !isAlreadyTaken;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const checkIfDevicePinIsAvailable = async (
  pin: string,
  prisma: PrismaClient
) => {
  try {
    const isAlreadyTaken = await prisma.devices.findUnique({
      where: {
        id: pin,
      },
    });

    console.log(isAlreadyTaken);

    return !isAlreadyTaken;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const encrypt = (content: string) => {
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(content, "utf-8", "hex");
  encrypted += cipher.final("hex");

  return encrypted;
};

export const decrypt = (content: string) => {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);

  let decrypted = decipher.update(content, "hex", "utf-8");
  decrypted += decipher.final("utf-8");

  return decrypted;
};



