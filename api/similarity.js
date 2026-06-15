export default async function handler(req, res) {
    const { word1, word2 } = req.body;

    const response = await fetch(
        "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2",
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

    res.status(200).json({
        similarity: data[0]
    });
}
