export default eventHandler(async (event) => {
  const { prisma } = event.context
  const body = await readBody(event)

  try {
    const message = await prisma.messages.create({
      data: {
        ...body,
        delivered: false,
        type: "message",
      },
    });

    return { message }
  } catch (error) {
    console.error(error)
    throw HttpErrors.SERVER({ error })
  }
})