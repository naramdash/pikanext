import { sql } from "../database/client";
import { cypher, Graph, setClauseStringify } from "../database/cypher";
import {
  deleteEdgeByEdgeId,
  deleteEdgeByVertexPropertyIds,
  insertEdgeByVertexIds,
  updateEdgeByEdgeId,
  updateEdgeByVertexPropertyIds,
} from "../database/edge";
import {
  checkVertexExistenceByPropertyId,
  deleteVertexByPropertyId,
  deleteVertexByVertexId,
  getVertexIdByPropertyId,
  insertVertex,
  updateVertexByPropertyId,
  updateVertexByVertexId,
} from "../database/vertex";

export default defineEventHandler(async (event) => {
  // const abc = sql<{ name: string; age: number | null }[]>`
  //   SELECT name::varchar::jsonb, age::varchar::jsonb
  //   FROM cypher(${sql.unsafe(Graph)}, $$
  //     MATCH (p:Person)
  //     WHERE  p.age > ${sql.unsafe(`20`)}
  //     RETURN p.name, p.age
  //   $$) as (name agtype, age agtype)
  // `;
  // return await cypher(abc);
  // return await checkVertexExistenceByPropertyId("Person", "13");
  // return await insertVertex("KiraKira", { id: "14", name: "KiraKira" });
  // return await updateVertexByVertexId(2251799813685249, {
  //   id: "fuckyou2",
  //   name: "garagara",
  // });
  // return await updateVertexByPropertyId("KiraKira", "fuckyou2", {
  //   id: "fuckyou3",
  // });
  // return await deleteVertexByVertextId(2251799813685249);
  // return await deleteVertexByPropertyId("KiraKira", "13");
  // return await insertEdgeByVertexIds(
  //   2251799813685251,
  //   2251799813685252,
  //   "LOVE",
  //   { id: "123", until: "nextyear" }
  // );
  // return await getVertexIdByPropertyId("KiraKira", "13");
  // return await updateEdgeByEdgeId(2533274790395905, {
  //   id: "123",
  //   name: "꽶",
  // });
  // return await updateEdgeByVertexPropertyIds(
  //   "KiraKira",
  //   "13",
  //   "KiraKira",
  //   "14",
  //   "LOVE",
  //   { angry: 23 }
  // );
  // return await deleteEdgeByEdgeId(2533274790395906);
  // return await deleteEdgeByVertexPropertyIds(
  //   "KiraKira",
  //   "13",
  //   "KiraKira",
  //   "14",
  //   "LOVE"
  // );

  return [];
});
