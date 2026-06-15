export default async function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      message: "Linxicon API is alive"
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  const { word1, word2 } = req.body;

  if (!word1 || !word2) {
    return res.status(400).json({
      error: "Missing word1 or word2"
    });
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

  if (!response.ok) {
    return res.status(response.status).json(data);
  }

  const similarity = data[0];

  return res.status(200).json({
    word1,
    word2,
    similarity,
    linked: similarity >= 0.41
  });
}
