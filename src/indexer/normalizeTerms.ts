import { STOP_WORDS } from "../utils/stopWords"

export function normalizeTerms(input: string): string[] {
	return input
		.toLowerCase()
		.split(/\s+/)
		.map(t => t.replace(/[^\p{L}\p{N}]/gu, ""))
		.filter(t => t.length > 1)
		.filter(t => !STOP_WORDS.has(t))
}
