export default defineEventHandler(async (event) => {
  const { prisma, params } = event.context;


  if (params?.id) {

    const stream = createEventStream(event);

    const interval = setInterval(async () => {
      // get messages that haven't been notified to the user yet
      const messages = await prisma.messages.findMany({
        where: {
          recipientId: params.id,
          delivered: false,
        },
      });

      if (messages.length !== 0) {
        await Promise.all(messages.map(async (message: any) => {
          return await stream.push(
            JSON.stringify({
              time: new Date().toISOString(),
              message,
            })
          );
        }))
      } else {
        await stream.push(JSON.stringify({
          time: new Date().toISOString(),
          message: {
            type: "ping",
            message: "hello from server",
            id: new Date().toLocaleTimeString()
          }
        }))
      }
      // update the sent messages
      await Promise.all(messages.map((message) => {
        return prisma.messages.update({
          where: {
            id: message.id,
          },
          data: {
            delivered: true
          },
        });
      }));
    }, 1000);

    stream.onClosed(() => {
      clearInterval(interval);
    });

    await stream.send();
  } else {
    throw HttpErrors.SERVER({ message: "No device found" })
  }
});
