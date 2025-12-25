import { pool } from "../db/pool";
import { normalizeTerms } from "./normalizeTerms";
import { chunk } from "../utils/chunk";
import { insertDocument } from "../db/repositories/document.repository";
import { insertManyTerms } from "../db/repositories/term.repository";
import { insertDocumentTermsBatch } from "../db/repositories/documentsTerms.repository";

export async function indexDocument(content: string): Promise<void> {
	const MAX_TERMS_PER_DOCUMENT = 1000
	const MAX_TERM_FREQUENCY = 50
	const BATCH_SIZE = 500

	const client = await pool.connect()

	try {
		await client.query("BEGIN")

		const documentId = crypto.randomUUID()
		await insertDocument(client, documentId, content)

		const normalizedTerms = normalizeTerms(content)

		const frequencyMap = new Map<string, number>()

		for (const term of normalizedTerms) {
			const count = frequencyMap.get(term) ?? 0
			if (count < MAX_TERM_FREQUENCY) {
				frequencyMap.set(term, count + 1)
			}
		}

		const sortedTerms = Array.from(frequencyMap.entries()).sort((a, b) => b[1] - a[1]).slice(0, MAX_TERMS_PER_DOCUMENT)

		const termChuncks = chunk(sortedTerms, BATCH_SIZE)

		for (const batch of termChuncks) {
			const terms = batch.map(([term]) => term)

			const termsIdMap = await insertManyTerms(client, terms)

			const termIds = batch.map(([term]) => termsIdMap.get(term)!)
			const frequencies = batch.map(([, freq]) => freq)

			await insertDocumentTermsBatch(client, documentId, termIds, frequencies)
		}

		await client.query("COMMIT")

	} catch (error) {
		await client.query("ROLLBACK")
		throw error

	} finally {
		client.release()
	}

}