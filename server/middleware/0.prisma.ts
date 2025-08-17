// import { PrismaClient } from "../../generated/prisma/index";

import { PrismaClient } from "~~/generated/prisma";

let prisma: PrismaClient;
declare module "h3" {
  interface H3EventContext {
    prisma: PrismaClient;
  }
}

export default eventHandler(async (event) => {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  event.context.prisma = prisma;
});
