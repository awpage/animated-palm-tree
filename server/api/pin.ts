import { HttpErrors } from "../utils/errors"
import { checkIfPinIsAvailable, generatePin } from "../utils/helpers";

export default defineEventHandler(async (event) => {
  const { prisma } = event.context;

  try {
    let retry = true;
    let pin = undefined;

    while (retry) {
      const id = generatePin();
      const isAvailable = await checkIfPinIsAvailable(id, prisma);

      if (isAvailable) {
        pin = id;
        retry = false;
      }
    }

    return { pin };
  } catch (error) {
    console.log(error);
    throw HttpErrors.SERVER({
      message: "A server error occurred, we are looking at it",
      error,
    });
  }
});