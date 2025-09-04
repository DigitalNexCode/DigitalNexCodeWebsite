import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { corsHeaders } from '../cors.ts'
import Groq from "https://esm.sh/groq-sdk@0.5.0";

const groq = new Groq({
  apiKey: Deno.env.get("GROQ_API_KEY"),
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { cvText } = await req.json()
    if (!cvText) {
        throw new Error("CV text is required.");
    }

    const prompt = `
      You are an expert CV parser. Your task is to analyze the following raw text from a CV and structure it into a valid JSON object.
      The JSON object MUST have these exact keys: "personalInfo", "summary", "experience", "education", "skills", "references", "portfolio".
      - "personalInfo": An object with keys "fullName", "email", "phone", "address", "link".
      - "summary": A string containing the professional summary.
      - "experience": An array of objects, each with "id", "jobTitle", "company", "location", "startDate", "endDate", "description".
      - "education": An array of objects, each with "id", "degree", "school", "location", "startDate", "endDate".
      - "skills": An array of objects, each with "id" and "name".
      - "references": An array of objects, each with "id", "name", "contact", "relation".
      - "portfolio": An array of objects, each with "id", "title", "link", "description".
      
      For each object in any array, generate a unique "id" string.
      If a section is not found in the CV text, return an empty string for "summary" or an empty array for the other sections.
      Do not invent information. If a piece of information (like a link or address) is not present, leave the value as an empty string.
      Ensure the entire output is a single, valid JSON object and nothing else.

      CV Text:
      ---
      ${cvText}
      ---

      Return ONLY the JSON object. Do not include any other text, explanations, or markdown formatting.
    `;

    const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama3-8b-8192",
        temperature: 0.1,
        response_format: { type: "json_object" },
    });

    const structuredCv = JSON.parse(chatCompletion.choices[0]?.message?.content || '{}');

    return new Response(JSON.stringify({ cv: structuredCv }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
