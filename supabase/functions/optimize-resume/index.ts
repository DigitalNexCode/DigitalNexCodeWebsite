import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { corsHeaders } from '../cors.ts'
import Groq from "https://esm.sh/groq-sdk@0.5.0";

const groq = new Groq({
  apiKey: Deno.env.get("GROQ_API_KEY"),
});

const generateCvText = (cvData: any) => {
    let text = `Full Name: ${cvData.personalInfo.fullName}\nEmail: ${cvData.personalInfo.email}\nPhone: ${cvData.personalInfo.phone}\nAddress: ${cvData.personalInfo.address}\nLink: ${cvData.personalInfo.link}\n\n`;
    text += `## Professional Summary:\n${cvData.summary || 'N/A'}\n\n`;
    
    text += "## Work Experience:\n";
    if (cvData.experience && cvData.experience.length > 0) {
        cvData.experience.forEach((exp: any) => {
            text += `- Job Title: ${exp.jobTitle}\n  Company: ${exp.company} (${exp.startDate} - ${exp.endDate})\n  Description: ${exp.description}\n`;
        });
    } else {
        text += "N/A\n";
    }

    text += "\n## Education:\n";
    if (cvData.education && cvData.education.length > 0) {
        cvData.education.forEach((edu: any) => {
            text += `- Degree: ${edu.degree}\n  School: ${edu.school} (${edu.startDate} - ${edu.endDate})\n`;
        });
    } else {
        text += "N/A\n";
    }

    text += "\n## Skills:\n";
    if (cvData.skills && cvData.skills.length > 0) {
        text += cvData.skills.map((s: any) => s.name).join(', ');
    } else {
        text += "N/A";
    }

    text += "\n\n## Portfolio:\n";
    if (cvData.portfolio && cvData.portfolio.length > 0) {
        cvData.portfolio.forEach((item: any) => {
            text += `- Title: ${item.title}\n  Link: ${item.link}\n  Description: ${item.description}\n`;
        });
    } else {
        text += "N/A\n";
    }

    return text;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { cvData, jobDetails } = await req.json()
    const cvText = generateCvText(cvData);

    const systemPrompt = `
      You are an expert career coach and resume writer. Your task is to analyze a user's CV against a job description.
      You must provide structured, actionable feedback in a specific JSON format.
      The JSON object MUST have these exact keys: "keywords_to_add", "experience_phrasing", "skills_to_highlight", "overall_summary".
      Your response must be ONLY the JSON object, with no other text or markdown formatting.
    `;

    const userPrompt = `
      Analyze the following CV and Job Description. Provide optimization suggestions in the required JSON format.

      **JSON Structure Rules:**
      - "keywords_to_add": An array of strings. Identify important keywords from the job description that are missing in the CV.
      - "experience_phrasing": An array of objects. Find 1-2 sentences from the CV's experience section that could be improved. For each, return an object with an "original" key (the EXACT original sentence) and a "suggested" key (a rewrite that uses strong action verbs and aligns with the job description).
      - "skills_to_highlight": An array of strings. List skills already present in the CV that are highly relevant to the job and should be emphasized.
      - "overall_summary": A brief, 1-2 sentence summary of how well the CV matches the job and the single most important recommendation for improvement.

      **CV TEXT:**
      ---
      ${cvText}
      ---

      **JOB DESCRIPTION:**
      ---
      ${jobDetails.jobDescription}
      ---

      Now, provide ONLY the JSON object as your response.
    `;

    const chatCompletion = await groq.chat.completions.create({
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
        ],
        model: "llama3-8b-8192",
        temperature: 0.3,
        response_format: { type: "json_object" },
    });

    const suggestions = JSON.parse(chatCompletion.choices[0]?.message?.content || '{}');

    return new Response(JSON.stringify({ suggestions }), {
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
