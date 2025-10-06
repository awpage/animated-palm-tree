export default eventHandler(async (event) => {
  const { prisma } = event.context
  const { id } = await readBody(event)

  try {
    const device = await prisma.devices.findUnique({
      where: {
        id
      }
    })

    if (device) {
      return { message: "Device already saved" }
    } else {
      await prisma.devices.create({
        data: {
          id,
          token: id
        }
      })

      return { message: "Device added" }
    }
  } catch (error) {
    console.clear()
    console.log(error)
    throw HttpErrors.SERVER({ error })
  }
})