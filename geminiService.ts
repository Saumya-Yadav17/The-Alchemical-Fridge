import { GoogleGenAI, Type } from "@google/genai";
import { GenerateRecipeParams, Recipe } from "../types";

export const generateRecipe = async ({
  ingredients,
  style,
  includeBackstory,
}: GenerateRecipeParams): Promise<Recipe> => {
  // Initialize the client with the environment variable API key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  let stylePrompt;
  switch (style) {
    case 'gourmet':
      stylePrompt = "You are a pretentious, high-end Michelin star chef. Turn these potentially garbage ingredients into a 'deconstructed' or 'elevated' culinary masterpiece. Use fancy culinary jargon.";
      break;
    case 'hilarious':
      stylePrompt = "You are a chaotic, slightly unhinged mad scientist chef. Create a recipe that is technically edible but hilarious, questioning the user's life choices or inventing wild physics-based cooking methods (like 'Quantum Spaghetti').";
      break;
    case 'indian':
      stylePrompt = "You are a creative Indian chef. Transform these ingredients into a Desi masterpiece. Use Indian cooking techniques (like Tadka/Tempering, Bhuna, Dum) and flavor profiles. Even if the ingredients are weird, try to make a Curry, Sabzi, or Chaat out of them. Use Hindi/English culinary terms where appropriate.";
      break;
    default:
      stylePrompt = "You are a pragmatic chef who hates doing dishes. Create the absolute easiest, quickest, lowest-effort edible meal possible from these ingredients. Focus on microwave shortcuts, one-bowl solutions, and minimal prep. Keep instructions very simple.";
  }

  const backstoryPrompt = includeBackstory
    ? "Also, write a creative, absurd, or deeply emotional backstory for why this dish exists."
    : "No backstory needed. Return an empty string for the backstory field.";

  const prompt = `
    ${stylePrompt}
    Ingredients provided: ${ingredients}.
    ${backstoryPrompt}

    SPECIAL CONDITION: If the ingredients provided are clearly insufficient for a meal (e.g., "nothing", "dust", "water only", "air") or strictly non-food items, IGNORE the requested cooking style. Instead:
    1. Set "is_grocery" to true.
    2. Set "title" to "Time to Buy Groceries".
    3. Set "tagline" to a witty remark about the empty fridge.
    4. Set "ingredients_list" to a recommended shopping list of basics.
    5. Set "steps" to humorous instructions on how to go to the grocery store.
    6. Set "chef_comment" to a friendly roast about their lack of food.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            is_grocery: { type: Type.BOOLEAN },
            title: { type: Type.STRING },
            tagline: { type: Type.STRING },
            ingredients_list: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            steps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            backstory: { type: Type.STRING },
            chef_comment: { type: Type.STRING },
          },
          required: ["is_grocery", "title", "ingredients_list", "steps", "chef_comment"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No content generated.");
    
    return JSON.parse(text) as Recipe;

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error.message?.includes('429')) {
      throw new Error("Too many chefs in the kitchen (Rate Limit). Please wait a moment.");
    }
    throw new Error(error.message || "The oven exploded (API Error).");
  }
};