import { z } from "zod";
import {
  deleteEdgeByEdgeId,
  deleteEdgeByVertexPropertyIds,
} from "~/server/database/edge";

const bodySchemaByEdgeId = z.object({
  queryType: z.literal("edgeId"),
  id: z.number(),
});
const bodySchemaByPropertyIds = z.object({
  queryType: z.literal("propertyIds"),
  startLabel: z.string(),
  startId: z.union([z.string(), z.number()]),
  endLabel: z.string(),
  endId: z.union([z.string(), z.number()]),
  label: z.string(),
});

const bodySchema = z.union([bodySchemaByEdgeId, bodySchemaByPropertyIds]);

export default defineEventHandler(async (event) => {
  if (process.env.PIKANEXT_ADMIN_PASSWORD !== getHeader(event, "password")) {
    event.respondWith(new Response("Unauthorized", { status: 401 }));
    return;
  }

  const body = await readValidatedBody(event, (b) => bodySchema.parse(b));

  if (body.queryType === "edgeId") {
    const edgeId = await deleteEdgeByEdgeId(body.id);
    return edgeId;
  } else {
    const edgeIds = await deleteEdgeByVertexPropertyIds(
      body.startLabel,
      body.startId,
      body.endLabel,
      body.endId,
      body.label
    );
    return edgeIds;
  }
});
