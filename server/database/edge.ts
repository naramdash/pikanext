import { sql } from "./client";
import {
  cypher,
  EdgeId,
  Graph,
  Label,
  propertiesToString,
  PropertyId,
  setClauseStringify,
  VertexId,
  EdgeProperties,
  propertyIdToString,
} from "./cypher";
import { getVertexIdByPropertyId } from "./vertex";

export async function insertEdgeByVertexIds(
  startId: VertexId,
  endId: VertexId,
  label: Label,
  properties: EdgeProperties
): Promise<EdgeId> {
  const startV = startId.toString();
  const endV = endId.toString();
  const props = propertiesToString(properties);

  const query = sql<{ id: EdgeId }[]>`
    SELECT id::varchar::jsonb
    FROM cypher(${sql.unsafe(Graph)}, $$
      MATCH (startV), (endV)
      WHERE 
        id(startV) = ${sql.unsafe(startV)} 
        AND 
        id(endV) = ${sql.unsafe(endV)}
      CREATE (startV)-[e:${sql.unsafe(label)} ${sql.unsafe(props)}]->(endV)
      RETURN id(e)
    $$) as (id agtype)
  `;

  try {
    const [{ id }] = await cypher(query);
    return id;
  } catch (e) {
    console.error(e);
    return NaN;
  }
}
export async function insertEdgeByVertexPropertyIds(
  startLabel: Label,
  startId: PropertyId,
  endLabel: Label,
  endId: PropertyId,
  label: Label,
  properties: EdgeProperties
): Promise<EdgeId> {
  const [startV, endV] = await Promise.all([
    getVertexIdByPropertyId(startLabel, startId),
    getVertexIdByPropertyId(endLabel, endId),
  ]);
  if (Number.isNaN(startV) || Number.isNaN(endV)) return NaN;

  return await insertEdgeByVertexIds(startV, endV, label, properties);
}

export async function updateEdgeByEdgeId(
  id: EdgeId,
  properties: EdgeProperties
): Promise<EdgeId> {
  const setClause = setClauseStringify("e", properties);

  const query = sql<{ id: EdgeId }[]>`
    SELECT id::varchar::jsonb
    FROM cypher(${sql.unsafe(Graph)}, $$
      MATCH (startV)-[e]-(endV)
      WHERE id(e) = ${sql.unsafe(id.toString())}
      SET ${sql.unsafe(setClause)}
      RETURN id(e)
    $$) as (id agtype)
  `;

  try {
    const [{ id }] = await cypher(query);
    return id;
  } catch (e) {
    console.error(e);
    return NaN;
  }
}
export async function updateEdgeByVertexPropertyIds(
  startLabel: Label,
  startId: PropertyId,
  endLabel: Label,
  endId: PropertyId,
  label: Label,
  properties: EdgeProperties
): Promise<EdgeId[]> {
  startId = propertyIdToString(startId);
  endId = propertyIdToString(endId);
  const setClause = setClauseStringify("e", properties);

  const query = sql<{ id: EdgeId }[]>`
    SELECT id::varchar::jsonb
    FROM cypher(${sql.unsafe(Graph)}, $$
      MATCH (startV:${sql.unsafe(startLabel)} {id: ${sql.unsafe(
    startId
  )}})-[e:${sql.unsafe(label)}]-(endV:${sql.unsafe(endLabel)} {id: ${sql.unsafe(
    endId
  )}})
      SET ${sql.unsafe(setClause)}
      RETURN id(e)
    $$) as (id agtype)
  `;

  try {
    const result = await cypher(query);
    return result.map(({ id }) => id);
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function deleteEdgeByEdgeId(id: EdgeId) {
  const query = sql<{ id: EdgeId }[]>`
    SELECT id::varchar::jsonb
    FROM cypher(${sql.unsafe(Graph)}, $$
      MATCH (startV)-[e]-(endV)
      WHERE id(e) = ${sql.unsafe(id.toString())}
      DELETE e
      RETURN id(e)
    $$) as (id agtype)
  `;

  try {
    const [{ id }] = await cypher(query);
    return id;
  } catch (e) {
    console.error(e);
    return NaN;
  }
}

export async function deleteEdgeByVertexPropertyIds(
  startLabel: Label,
  startId: PropertyId,
  endLabel: Label,
  endId: PropertyId,
  label: Label
): Promise<EdgeId[]> {
  startId = propertyIdToString(startId);
  endId = propertyIdToString(endId);

  const query = sql<{ id: EdgeId }[]>`
    SELECT id::varchar::jsonb
    FROM cypher(${sql.unsafe(Graph)}, $$
      MATCH (startV:${sql.unsafe(startLabel)} {id: ${sql.unsafe(
    startId
  )}})-[e:${sql.unsafe(label)}]-(endV:${sql.unsafe(endLabel)} {id: ${sql.unsafe(
    endId
  )}})
      DELETE e
      RETURN id(e)
    $$) as (id agtype)
  `;

  try {
    const result = await cypher(query);
    return result.map(({ id }) => id);
  } catch (e) {
    console.error(e);
    return [];
  }
}
