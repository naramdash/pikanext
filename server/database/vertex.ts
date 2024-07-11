import { sql } from "./client";
import {
  cypher,
  Graph,
  Label,
  VertexProperties,
  propertiesToString,
  PropertyId,
  propertyIdToString,
  setClauseStringify,
  VertexId,
} from "./cypher";

export async function checkVertexExistenceByPropertyId(
  label: Label,
  id: PropertyId
): Promise<number> {
  id = propertyIdToString(id);

  const query = sql<{ c: number }[]>`
    SELECT c::varchar::jsonb
    FROM cypher(${sql.unsafe(Graph)}, $$
      MATCH (v:${sql.unsafe(label)} { id: ${sql.unsafe(id)} })
      WITH count(*) as c
      RETURN c
    $$) as (c agtype)
  `;

  try {
    const [{ c }] = await cypher(query);
    return c;
  } catch (e) {
    console.error(e);
    return NaN;
  }
}

export async function insertVertex(
  label: Label,
  id: PropertyId,
  properties: VertexProperties
): Promise<number> {
  const existence = await checkVertexExistenceByPropertyId(label, id);
  if (existence !== 0) return NaN;

  properties.id = id;

  const props = propertiesToString(properties);
  const query = sql<{ id: number }[]>`
    SELECT id::varchar::jsonb
    FROM cypher(${sql.unsafe(Graph)}, $$
      CREATE (v:${sql.unsafe(label)} ${sql.unsafe(props)})
      RETURN id(v)
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

export async function updateVertexByVertexId(
  id: VertexId,
  properties: VertexProperties
): Promise<VertexId> {
  delete properties.id;
  const setClause = setClauseStringify("v", properties);

  const query = sql<{ id: VertexId }[]>`
    SELECT id::varchar::jsonb
    FROM cypher(${sql.unsafe(Graph)}, $$ 
      MATCH (v)
      WHERE id(v) = ${sql.unsafe(id.toString())}
      SET ${sql.unsafe(setClause)}
      RETURN id(v)
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
export async function updateVertexByPropertyId(
  label: Label,
  id: PropertyId,
  properties: VertexProperties
): Promise<VertexId> {
  const existence = await checkVertexExistenceByPropertyId(label, id);
  if (existence !== 1) return NaN;

  id = propertyIdToString(id);

  delete properties.id;
  const setClause = setClauseStringify("v", properties);

  const query = sql<{ id: VertexId }[]>`
    SELECT id::varchar::jsonb
    FROM cypher(${sql.unsafe(Graph)}, $$ 
      MATCH (v:${sql.unsafe(label)} { id: ${sql.unsafe(id)} })
      SET ${sql.unsafe(setClause)}
      RETURN id(v)
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

export async function deleteVertexByVertexId(id: VertexId): Promise<VertexId> {
  const query = sql<{ id: VertexId }[]>`
    SELECT id::varchar::jsonb
    FROM cypher(${sql.unsafe(Graph)}, $$ 
      MATCH (v)
      WHERE id(v) = ${sql.unsafe(id.toString())}
      DETACH DELETE v
      RETURN id(v)
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
export async function deleteVertexByPropertyId(
  label: Label,
  id: PropertyId
): Promise<VertexId[]> {
  id = propertyIdToString(id);

  const query = sql<{ id: VertexId }[]>`
    SELECT id::varchar::jsonb
    FROM cypher(${sql.unsafe(Graph)}, $$ 
      MATCH (v:${sql.unsafe(label)} { id: ${sql.unsafe(id)} })
      DETACH DELETE v
      RETURN id(v)
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

export async function getVertexIdByPropertyId(
  label: Label,
  id: PropertyId
): Promise<VertexId> {
  id = propertyIdToString(id);

  const query = sql<{ id: VertexId }[]>`
    SELECT id::varchar::jsonb
    FROM cypher(${sql.unsafe(Graph)}, $$ 
      MATCH (v:${sql.unsafe(label)} { id: ${sql.unsafe(id)} })
      RETURN id(v)
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
