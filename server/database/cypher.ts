import postgres, { MaybeRow } from "postgres";
import { sql } from "./client";

export const Graph = process.env.PIKANEXT_DB_GRAPH as string;
export async function cypher<TRow extends readonly MaybeRow[]>(
  query: postgres.PendingQuery<TRow>
) {
  const [_, result] = await sql`
    LOAD 'age'; 
    SET search_path = ag_catalog, "$user", public;
    ${query}
  `.simple();

  return result as TRow;
}
export function propertiesToString(properties: Record<string, any>) {
  return JSON.stringify(properties).replace(/"([^"]+)":/g, "$1:");
}

export function propertyIdToString(id: PropertyId) {
  return typeof id === "string" ? `'${id}'` : id.toString();
}

export function setClauseStringify(
  entityName: string,
  obj: Record<string, any>
) {
  return Object.entries(obj)
    .map(
      ([key, value]) => `${entityName}.${key} = ${propertiesToString(value)}`
    )
    .join(", ");
}

export type VertexProperties = Record<string, any>;
export type EdgeProperties = Record<string, any>;
export type Label = string;
export type VertexId = number;
export type EdgeId = number;
export type PropertyId = string | number;
