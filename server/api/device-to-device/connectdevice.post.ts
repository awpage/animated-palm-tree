export default eventHandler(async (event) => {
  const { prisma } = event.context
  const body = await readBody(event)

  // Add the invite to the messages with notif

  try {
    const device = await prisma.devices.findUnique({
      where: {
        id: body.recipientId,
      },
    });

    if (!device) {
      return HttpErrors.NOT_FOUND({ message: "Device not found" })
    }

    await Promise.all([
      prisma.connectedDevices.create({
        data: {
          receiverId: body.recipientId,
          senderId: body.senderId,
        },
      }),
      prisma.messages.create({
        data: {
          type: "connected",
          content: "New device pairing",
          senderId: body.senderId,
          recipientId: body.recipientId,
        },
      }),
    ]);

    return { message: "Devide added" }
  } catch (error) {
    console.log(error)
  }
});
