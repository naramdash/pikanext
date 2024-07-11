import { z } from "zod";
import {
  updateVertexByPropertyId,
  updateVertexByVertexId,
} from "~/server/database/vertex";

const bodySchemaByVertexId = z.object({
  queryType: z.literal("vertexId"),
  id: z.number(),
  properties: z.record(z.string(), z.any()),
});

const bodySchemaByPropertyId = z.object({
  queryType: z.literal("propertyId"),
  label: z.string(),
  id: z.union([z.string(), z.number()]),
  properties: z.record(z.string(), z.any()),
});

const bodySchema = z.union([bodySchemaByVertexId, bodySchemaByPropertyId]);

export default defineEventHandler(async (event) => {
  if (process.env.PIKANEXT_ADMIN_PASSWORD !== getHeader(event, "password")) {
    event.respondWith(new Response("Unauthorized", { status: 401 }));
    return;
  }

  const body = await readValidatedBody(event, (b) => bodySchema.parse(b));

  if (body.queryType === "vertexId") {
    const vertexId = await updateVertexByVertexId(body.id, body.properties);
    return vertexId;
  } else {
    const vertexId = await updateVertexByPropertyId(
      body.label,
      body.id,
      body.properties
    );
    return vertexId;
  }
});
