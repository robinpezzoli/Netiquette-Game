
import { GoogleGenAI, Type } from "@google/genai";
import { Scenario } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SCENARIO_SCHEMA = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      category: { type: Type.STRING, description: "Kategorie des Szenarios (z.B. TikTok, Discord, WhatsApp, Gaming, Insta)." },
      description: { type: Type.STRING, description: "Ein realistisches Fallbeispiel aus dem Alltag eines 13- bis 19-Jährigen auf Deutsch." },
      options: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.INTEGER },
            text: { type: Type.STRING }
          },
          required: ["id", "text"]
        }
      },
      correctOptionId: { type: Type.INTEGER, description: "Die ID der korrekten Verhaltensweise (1, 2 oder 3)." },
      explanation: { type: Type.STRING, description: "Detaillierte Erklärung, warum diese Wahl korrekt ist." }
    },
    required: ["category", "description", "options", "correctOptionId", "explanation"]
  }
};

export async function fetchNetiquetteScenarios(count: number = 5, offset: number = 0): Promise<Scenario[]> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Erstelle ${count} verschiedene, sehr realistische Netiquette-Fallbeispiele für Jugendliche (13-19 Jahre). 
      Dies ist Teil einer Serie von 100 Aufgaben (Startpunkt-Index: ${offset}).
      FOKUS: WhatsApp, Discord, TikTok, Instagram, BeReal, Gaming.
      THEMEN: Ghosting, Memes, Privatsphäre, Cybermobbing-Prävention, Feedback-Kultur.
      WICHTIG: Die 3 Antwortmöglichkeiten müssen knifflig sein. Keine offensichtlich falschen Antworten. 
      Sprache: Deutsch (Jugend-Slang okay).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: SCENARIO_SCHEMA,
        // Using a fixed seed for deterministic output where possible
        seed: 42,
        temperature: 0.7
      }
    });

    const jsonStr = response.text.trim();
    const data = JSON.parse(jsonStr);
    
    return data.map((item: any) => ({
      ...item,
      id: Math.random().toString(36).substr(2, 9)
    }));
  } catch (error) {
    console.error("Error fetching scenarios:", error);
    throw error;
  }
}
