import { z } from "zod";
import {
  deleteVertexByPropertyId,
  deleteVertexByVertexId,
} from "~/server/database/vertex";

const bodySchemaByVertexId = z.object({
  queryType: z.literal("vertexId"),
  id: z.number(),
});

const bodySchemaByPropertyId = z.object({
  queryType: z.literal("propertyId"),
  label: z.string(),
  id: z.union([z.string(), z.number()]),
});

const bodySchema = z.union([bodySchemaByVertexId, bodySchemaByPropertyId]);

export default defineEventHandler(async (event) => {
  if (process.env.PIKANEXT_ADMIN_PASSWORD !== getHeader(event, "password")) {
    event.respondWith(new Response("Unauthorized", { status: 401 }));
    return;
  }

  const body = await readValidatedBody(event, (b) => bodySchema.parse(b));

  if (body.queryType === "vertexId") {
    const vertexId = await deleteVertexByVertexId(body.id);
    return vertexId;
  } else {
    const vertexId = await deleteVertexByPropertyId(body.label, body.id);
    return vertexId;
  }
});
