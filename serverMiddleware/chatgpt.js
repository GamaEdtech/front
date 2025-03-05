import axios from "axios";
export default async function (req, res) {
  if (req.method !== "POST") {
    res.statusCode = 405; // Method Not Allowed
    res.end(JSON.stringify({ error: "Method not allowed" }));
    return;
  }

  let body = "";
  req.on("data", (chunk) => (body += chunk));
  req.on("end", async () => {
    try {
      const { userComment } = JSON.parse(body);
      if (!userComment) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "Comment is required" }));
        return;
      }

      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o",
          messages: [{ role: "user", content: userComment }],
          max_tokens: 220,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      res.statusCode = 200;
      res.end(
        JSON.stringify({ response: response.data.choices[0].message.content })
      );
    } catch (error) {
      console.error(
        "ChatGPT API error:",
        error.response?.data || error.message
      );
      res.statusCode = 500;
      res.end(JSON.stringify({ error: "Failed to fetch AI response" }));
    }
  });
}
