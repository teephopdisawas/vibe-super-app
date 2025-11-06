
import { GoogleGenAI, Type } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateStoryStream = async (prompt: string) => {
  return ai.models.generateContentStream({
    model: "gemini-2.5-flash",
    contents: `Tell me a short story about: ${prompt}. Keep it under 300 words.`,
  });
};

export const generateImage = async (prompt: string, aspectRatio: string) => {
  const response = await ai.models.generateImages({
    model: 'imagen-4.0-generate-001',
    prompt: prompt,
    config: {
      numberOfImages: 1,
      outputMimeType: 'image/jpeg',
      aspectRatio: aspectRatio as "1:1" | "3:4" | "4:3" | "9:16" | "16:9",
    },
  });

  if (response.generatedImages && response.generatedImages.length > 0) {
    const base64ImageBytes = response.generatedImages[0].image.imageBytes;
    return `data:image/jpeg;base64,${base64ImageBytes}`;
  }
  throw new Error("Image generation failed.");
};

export const runCodeCompanion = async (prompt: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      systemInstruction: "You are an expert code companion. When asked to generate code, provide only the code in a markdown block. When asked to explain code, provide a clear and concise explanation.",
    }
  });
  return response.text;
};

export const generateTravelItinerary = async (destination: string, duration: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Create a travel itinerary for a ${duration}-day trip to ${destination}.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          trip_title: { type: Type.STRING },
          days: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.INTEGER },
                title: { type: Type.STRING },
                activities: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                food_suggestions: { type: Type.STRING }
              },
            }
          }
        },
      },
    },
  });

  return JSON.parse(response.text);
};


export const searchWithGoogle = async (prompt: string) => {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            tools: [{ googleSearch: {} }],
        },
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return {
        text: response.text,
        sources: groundingChunks
    };
};

// Word Processor Services
export const improveText = async (text: string) => {
  return ai.models.generateContentStream({
    model: "gemini-2.5-flash",
    contents: `Improve the following text by fixing grammar, enhancing clarity, and making it more professional while keeping the same meaning:\n\n${text}`,
  });
};

export const summarizeText = async (text: string) => {
  return ai.models.generateContentStream({
    model: "gemini-2.5-flash",
    contents: `Provide a concise summary of the following text:\n\n${text}`,
  });
};

export const rewriteText = async (text: string) => {
  return ai.models.generateContentStream({
    model: "gemini-2.5-flash",
    contents: `Rewrite the following text in a different style while maintaining its core message:\n\n${text}`,
  });
};

// Spreadsheet Services
export const analyzeSpreadsheetData = async (data: string) => {
  return ai.models.generateContentStream({
    model: "gemini-2.5-flash",
    contents: `Analyze the following spreadsheet data and provide insights, patterns, trends, or suggestions:\n\n${data}`,
  });
};

// Presentation Services
export const generatePresentation = async (topic: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Create a presentation outline for the topic: "${topic}". Generate 5-7 slides with titles and content.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.NUMBER },
            title: { type: Type.STRING },
            content: { type: Type.STRING },
            notes: { type: Type.STRING }
          },
        }
      },
    },
  });

  return JSON.parse(response.text);
};

// Calculator Services
export const solveMathProblem = async (problem: string) => {
  return ai.models.generateContentStream({
    model: "gemini-2.5-flash",
    contents: `Solve the following math problem step by step, showing all work:\n\n${problem}`,
    config: {
      systemInstruction: "You are an expert mathematics tutor. Provide clear, step-by-step solutions to math problems. Show all your work and explain each step."
    }
  });
};
