import { checkIfDevicePinIsAvailable } from "~~/server/utils/helpers";

export default defineEventHandler(async (event) => {
  const { prisma } = event.context

  try {
    let retry = true
    let pin = undefined

    while (retry) {
      const id = generatePin();

      const isAvailable = await checkIfDevicePinIsAvailable(id, prisma)

      if (isAvailable) {
        pin = id
        retry = false
      }
    }

    return { pin };
  } catch (error) {
    console.error(error)
    throw HttpErrors.SERVER({
      message: "A server error occurred, we are looking at it",
      error
    })
  }
})