export default eventHandler(async (event) => {
  const { prisma } = event.context
  const { id } = await readBody(event)

  try {
    await prisma.messages.update({
      where: { id },
      data: { delivered: true }
    })

    return { message: "marked as delivered" }
  } catch (error) {
    console.log(error)
    return HttpErrors.SERVER({ error })
  }
})