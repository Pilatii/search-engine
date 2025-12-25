import { PoolClient } from "pg";

export async function insertDocument(client: PoolClient, documentId: string, content: string) {
	await client.query(
		`INSERT INTO documents (id, content) VALUES ($1, $2)`,
		[documentId, content]
	)
}

export async function getDocuments(client: PoolClient, terms: string[], limit: number, offset: number) {
	const { rows } = await client.query(
		`
		SELECT
			d.id AS document_id,
			d.content,
			SUM(dt.frequency) AS score
		FROM terms t
		JOIN documents_terms dt ON dt.term_id = t.id
		JOIN documents d ON d.id = dt.document_id
		WHERE t.term = ANY($1)
		GROUP BY d.id, d.content
		ORDER BY score DESC
		LIMIT $2 OFFSET $3
		`,
		[terms, limit, offset]
	)

	return rows
}