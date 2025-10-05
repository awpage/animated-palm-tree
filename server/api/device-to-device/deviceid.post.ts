export default defineEventHandler(async (event) => {
  const { prisma } = event.context;

  const body = (await readBody(event)) as {
    id: string,
    token: string
  }

  try {
    const IsThisIdAvailable = await checkIfDevicePinIsAvailable(body.id, prisma)

    if (IsThisIdAvailable) {
      await prisma.devices.create({
        data: {
          id: body.id,
          token: body.token
        }
      })
    } else {
      return HttpErrors.CONFLICT({
        message: "Get a new pin"
      })
    }

    return { message: "New device added" }
  } catch (error) {
    throw HttpErrors.SERVER({
      message: "An error occurred, please try again",
      error
    })
  }
})