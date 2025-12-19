
import { GoogleGenAI, Type } from "@google/genai";
import { RawFeedbackRow, AnalysisResult } from "../types";

export const analyzeFeedback = async (data: RawFeedbackRow[]): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

  // Pre-process data to be more token-efficient if it's too large
  // Group comments by faculty and section
  const groupedData = data.reduce((acc, row) => {
    const key = `${row.facultyName}|${row.section}`;
    if (!acc[key]) {
      acc[key] = {
        facultyName: row.facultyName,
        section: row.section,
        ratings: [],
        comments: [],
      };
    }
    acc[key].ratings.push(row.rating);
    if (row.comments) acc[key].comments.push(row.comments);
    return acc;
  }, {} as Record<string, any>);

  const inputPayload = Object.values(groupedData).map(item => ({
    facultyName: item.facultyName,
    section: item.section,
    averageRating: item.ratings.reduce((a: number, b: number) => a + b, 0) / item.ratings.length,
    commentSample: item.comments.slice(0, 15).join(" | "), // Take a slice to prevent token overflow
  }));

  const prompt = `Analyze the following faculty feedback data extracted from an Excel sheet. 
  For each faculty/section:
  1. Summarize the reviews.
  2. Identify specific strengths and weaknesses.
  3. Categorize them into bands (Outstanding, Exceeds Expectations, Meets Expectations, Needs Improvement, Critical).
  4. Provide 3-5 specific pedagogical modifications they should implement based on student complaints/praise.
  5. Identify the top performers overall.

  Feedback Data:
  ${JSON.stringify(inputPayload, null, 2)}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            insights: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  facultyName: { type: Type.STRING },
                  section: { type: Type.STRING },
                  overallRating: { type: Type.NUMBER },
                  summary: { type: Type.STRING },
                  strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                  weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                  suggestedModifications: { type: Type.ARRAY, items: { type: Type.STRING } },
                  banding: { type: Type.STRING },
                },
                required: ["facultyName", "section", "overallRating", "summary", "strengths", "weaknesses", "suggestedModifications", "banding"],
              },
            },
            topPerformers: { type: Type.ARRAY, items: { type: Type.STRING } },
            overallSummary: { type: Type.STRING },
          },
          required: ["insights", "topPerformers", "overallSummary"],
        },
      },
    });

    const result = JSON.parse(response.text || '{}');
    return result as AnalysisResult;
  } catch (error) {
    console.error("Gemini analysis error:", error);
    throw new Error("Failed to analyze feedback. Please ensure the data format is correct.");
  }
};
