const cache = new Map();

function key(a, b) {
	return [a.toLowerCase(), b.toLowerCase()].sort().join("|");
}

async function similarity(word1, word2) {
	const k = key(word1, word2);

	if (cache.has(k)) {
		return cache.get(k);
	}

	const response = await fetch(
		"https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2/pipeline/sentence-similarity",
		{
			method: "POST",
			headers: {
				Authorization: `Bearer ${process.env.HF_TOKEN}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				inputs: {
					source_sentence: word1,
					sentences: [word2]
				}
			})
		}
	);

	const data = await response.json();

	const score = Array.isArray(data) ? data[0] : 0;

	cache.set(k, score);

	return score;
}

export default async function handler(req, res) {
	if (req.method !== "POST") {
		return res.status(405).json({ error: "POST only" });
	}

	const { word, candidates } = req.body;

	const links = [];

	for (const candidate of candidates) {
		const score = await similarity(word, candidate);

		if (score >= 0.41) {
			links.push({
				word: candidate,
				score
			});
		}
	}

	return res.status(200).json({
		word,
		links
	});
}
