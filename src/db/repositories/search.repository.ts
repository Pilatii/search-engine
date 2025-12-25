import { PoolClient } from "pg"

export async function searchByTerm(client: PoolClient, term: string) {
	const { rows } = await client.query(
		`
		SELECT
		d.id AS document_id,
		d.content,
		dt.frequency
		FROM terms t
		JOIN documents_terms dt ON dt.term_id = t.id
		JOIN documents d ON d.id = dt.document_id
		WHERE t.term = $1
		ORDER BY dt.frequency DESC
		`,
		[term]
	)

	return rows
}
