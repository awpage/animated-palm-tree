import { decrypt } from "../utils/helpers"

export default defineEventHandler(async (event) => {
  const { prisma } = event.context;
  const { pin } = getQuery(event);

  try {
    if (pin) {
      const content = await prisma.entries.findUnique({
        where: {
          id: pin as string,
        },
      });

      if (content) {
        return {
          content: {
            ...content,
            content: decrypt(content.content),
          },
        };
      }

      return HttpErrors.NOT_FOUND({
        message: "No content with this pin was found",
      });
    }

    return HttpErrors.NOT_FOUND({
      message: "No content with this pin was found",
    });
  } catch (error) {
    throw HttpErrors.SERVER({ message: "An Error occurred", error });
  }
});