import { z } from "zod";
import { insertVertex } from "~/server/database/vertex";

const bodySchema = z.object({
  label: z.string(),
  id: z.union([z.string(), z.number()]),
  properties: z.record(z.string(), z.any()),
});

export default defineEventHandler(async (event) => {
  if (process.env.PIKANEXT_ADMIN_PASSWORD !== getHeader(event, "Password")) {
    event.respondWith(new Response("Unauthorized", { status: 401 }));
    return;
  }

  const body = await readValidatedBody(event, (b) => bodySchema.parse(b));
  const vertexId = await insertVertex(body.label, body.id, body.properties);

  return vertexId;
});
