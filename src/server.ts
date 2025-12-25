import express, { Request, Response } from "express"
import { indexDocument } from "./indexer/indexDocument"
import { searchDocuments } from "./search/searchDocuments"
import { normalizeTerms } from "./indexer/normalizeTerms"

const app = express()
app.use(express.json())

app.post("/document", async (req: Request, res: Response) => {
	const { content } = req.body

	if (!content) return res.status(400).json({ error: "Conteudo é necessario" })

	await indexDocument(content)

	res.status(201).json({ status: "Indexado" })
})

app.get("/search", async (req: Request, res: Response) => {
	const raw = req.query.terms as string
	const page = Number(req.query.page ?? 1)
	const limit = Number(req.query.limit ?? 10)

	if (!raw) {
		res.status(400).json({ error: "Termo é obrigatorio" })
	}

	const terms = normalizeTerms(raw)

	if (terms.length === 0) {
		return res.json({
			terms: [],
			results: []
		})
	}

	const results = await searchDocuments(terms, page, limit)

	res.json({
		terms,
		page,
		limit,
		total: results.length,
		results
	})
})

app.listen(3000, () => {
	console.log("App rodando na porta 3000")
})