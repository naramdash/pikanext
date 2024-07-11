import { z } from "zod";
import {
  insertEdgeByVertexIds,
  insertEdgeByVertexPropertyIds,
} from "~/server/database/edge";

const bodySchemaByVertexIds = z.object({
  queryType: z.literal("vertexIds"),
  startId: z.number(),
  endId: z.number(),
  label: z.string(),
  properties: z.record(z.string(), z.any()),
});
const bodySchemaByPropertyIds = z.object({
  queryType: z.literal("propertyIds"),
  startLabel: z.string(),
  startId: z.union([z.string(), z.number()]),
  endLabel: z.string(),
  endId: z.union([z.string(), z.number()]),
  label: z.string(),
  properties: z.record(z.string(), z.any()),
});

const bodySchema = z.union([bodySchemaByVertexIds, bodySchemaByPropertyIds]);

export default defineEventHandler(async (event) => {
  if (process.env.PIKANEXT_ADMIN_PASSWORD !== getHeader(event, "password")) {
    event.respondWith(new Response("Unauthorized", { status: 401 }));
    return;
  }

  const body = await readValidatedBody(event, (b) => bodySchema.parse(b));

  if (body.queryType === "vertexIds") {
    const edgeId = await insertEdgeByVertexIds(
      body.startId,
      body.endId,
      body.label,
      body.properties
    );
    return edgeId;
  } else {
    const edgeId = await insertEdgeByVertexPropertyIds(
      body.startLabel,
      body.startId,
      body.endLabel,
      body.endId,
      body.label,
      body.properties
    );
    return edgeId;
  }
});
