import { PoolClient } from "pg"

export async function insertDocumentTermsBatch(client: PoolClient, documentId: string, termIds: number[], frequencies: number[] ) {
	const documentIds = termIds.map(() => documentId)

	await client.query(
		`
		INSERT INTO documents_terms (document_id, term_id, frequency)
		SELECT
		UNNEST($1::uuid[]),
		UNNEST($2::int[]),
		UNNEST($3::int[])
		ON CONFLICT DO NOTHING
		`,
		[documentIds, termIds, frequencies]
	)
}
