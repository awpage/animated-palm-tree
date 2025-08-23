export default defineEventHandler(async (event) => {
  const { prisma } = event.context;
  const { pin } = getQuery(event);

  try {
    await prisma.entries.delete({
      where: {
        id: pin as string,
      },
    });

    return { message: "content deleted!" };
  } catch (error) {
    throw HttpErrors.SERVER({ message: "An error occurred", error });
  }
});
