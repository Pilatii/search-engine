import { PoolClient } from "pg";

export async function insertManyTerms(client: PoolClient, terms: string[]): Promise<Map<string, number>> {
	await client.query(
		`
		INSERT INTO terms (term)
		SELECT UNNEST($1::text[])
		ON CONFLICT (term) DO NOTHING
		RETURNING id, term
		`,
		[terms]
	)

	const { rows } = await client.query(
		`
		SELECT id, term
		FROM terms
		WHERE term = ANY($1::text[])
		`,
		[terms]
	)

	const map = new Map<string, number>()

	for (const row of rows) {
		map.set(row.term, row.id)
	}

	return map
}