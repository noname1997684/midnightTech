export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Request body from client:", body);

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify(body),
      }
    );

    console.log("Gemini API status:", response.status);
    const data = await response.json();
    console.log("Gemini API response:", data);

    return Response.json(data);
  } catch (error) {
    console.error("Chatbot API error:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
