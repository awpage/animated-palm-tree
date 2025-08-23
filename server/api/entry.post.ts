import { encrypt } from "../utils/helpers"

export default defineEventHandler(async (event) => {
  const { prisma } = event.context;
  const body = (await readBody(event)) as {
    content: string;
    id: string;
    deleteOnSeen: boolean;
  };

  try {
    const isPinAvailable = await checkIfPinIsAvailable(body.id, prisma);
    if (isPinAvailable) {
      await prisma.entries.create({
        data: {
          ...body,
          content: encrypt(body.content),
        },
      });
    } else {
      return HttpErrors.CONFLICT({
        message: "Pin already in use, please generate another.",
      });
    }

    return { message: "Entry added" };
  } catch (error) {
    throw HttpErrors.SERVER({
      message: "An Error occurred, please try again.",
      error,
    });
  }
});