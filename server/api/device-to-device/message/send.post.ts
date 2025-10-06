export default eventHandler(async (event) => {
  const { prisma } = event.context
  const body = await readBody(event)

  try {

    if ((await checkIfDevicePinIsAvailable(body.recipientId, prisma))) {
      throw HttpErrors.NOT_FOUND({ error: "Recipient not found" });
    }

    if ((await checkIfDevicePinIsAvailable(body.senderId, prisma))) {
      console.log("Sender not found");
      throw HttpErrors.UNAUTHORIZED({ error: "Please get a new device ID" });
    }

    const message = await prisma.messages.create({
      data: {
        ...body,
        delivered: false,
        type: "message",
      },
    });

    return { message }
  } catch (error) {
    console.clear()
    console.error(error)
    throw HttpErrors.SERVER({ error })
  }
})