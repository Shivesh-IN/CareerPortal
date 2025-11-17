import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export async function POST(request) {
  try {
    const formData = await request.json();
    const { type, fullName, email, phone, location, headline, summary, company, position, duration, skills, education, certifications } = formData;

    if (!fullName || !email) {
      return Response.json({
        error: "Name and email are required",
        ...formData
      }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = type === 'resume' ? `You are a professional resume writer. Create an enhanced, ATS-optimized resume based on this information:

Name: ${fullName}
Email: ${email}
Phone: ${phone || 'Not provided'}
Location: ${location || 'Not provided'}
Headline: ${headline || 'Not provided'}
Professional Summary: ${summary || 'Not provided'}
Company: ${company || 'Not provided'}
Position: ${position || 'Not provided'}
Duration: ${duration || 'Not provided'}
Skills: ${skills || 'Not provided'}
Education: ${education || 'Not provided'}
Certifications: ${certifications || 'Not provided'}

Generate a professional resume with:
1. Improved professional summary with power keywords
2. Enhanced job descriptions with metrics and action verbs
3. Organized skills section with categories
4. Professional formatting recommendations
5. ATS optimization tips
6. Additional suggestions for improvement

Respond in this JSON format:
{
  "fullName": "${fullName}",
  "email": "${email}",
  "phone": "${phone}",
  "location": "${location}",
  "headline": "Enhanced headline",
  "summary": "Enhanced professional summary",
  "workExperience": [{"company": "${company}", "position": "${position}", "duration": "${duration}", "bullets": ["achievement1", "achievement2", "achievement3"]}],
  "skills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
  "education": "Education details",
  "certifications": "Certifications",
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"],
  "type": "resume"
}` : `You are a professional CV writer. Create an enhanced, comprehensive CV based on this information:

Name: ${fullName}
Email: ${email}
Phone: ${phone || 'Not provided'}
Location: ${location || 'Not provided'}
Headline: ${headline || 'Not provided'}
Professional Summary: ${summary || 'Not provided'}
Company: ${company || 'Not provided'}
Position: ${position || 'Not provided'}
Duration: ${duration || 'Not provided'}
Skills: ${skills || 'Not provided'}
Education: ${education || 'Not provided'}
Certifications: ${certifications || 'Not provided'}

Generate a professional CV with:
1. Comprehensive professional summary
2. Detailed work experience with achievements
3. Academic background and research
4. Skills section with proficiency levels
5. Certifications and awards
6. Additional sections recommendations
7. Formatting and structure suggestions

Respond in this JSON format:
{
  "fullName": "${fullName}",
  "email": "${email}",
  "phone": "${phone}",
  "location": "${location}",
  "headline": "Enhanced headline",
  "summary": "Enhanced professional summary for CV",
  "workExperience": [{"company": "${company}", "position": "${position}", "duration": "${duration}", "description": "detailed description with achievements"}],
  "academic": "${education}",
  "skills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
  "certifications": "${certifications}",
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"],
  "type": "cv"
}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Extract JSON
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse AI response");
    }

    const enhanced = JSON.parse(jsonMatch[0]);

    return Response.json({
      ...enhanced,
      type: type,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error("Resume generation error:", error);
    return Response.json({
      error: error.message || "Failed to generate resume",
      ...formData
    }, { status: 500 });
  }
}
