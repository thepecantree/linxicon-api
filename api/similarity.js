export default async function handler(req, res) {
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

  return res.status(200).json({
    received: {
      word1,
      word2
    }
  });
}
