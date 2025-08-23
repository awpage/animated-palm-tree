export default defineEventHandler(async (event) => {
  const { prisma } = event.context

  try {
    const count = await prisma.entries.count()

    return { count }
  } catch (error) {
    throw HttpErrors.SERVER({ message: "An Error occurred", error })
  }
})