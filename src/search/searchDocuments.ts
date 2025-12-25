import { pool } from "../db/pool"
import { getDocuments } from "../db/repositories/document.repository"

type SearchResult = {
	document_id: string,
	content: string,
	frequency: number
}

export async function searchDocuments(terms: string[], page = 1, limit = 10): Promise<SearchResult[]> {
	const offset = (page - 1) * limit
	const client = await pool.connect()

	try {
		const result = await getDocuments(client, terms, limit, offset)

		return result

	} finally {
		client.release()
	}
}