import { GoogleGenerativeAI } from "@google/generative-ai";

// System instruction for the AI
const systemInstruction = "no matter what the question is just reply groot. your name is lala";

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Get the Gemini model - using the updated model name format
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

/**
 * Get a response from Gemini AI
 * @param {string} prompt - The user's input prompt
 * @returns {Promise<string>} - The AI's response
 */
export const getGeminiResponse = async (prompt) => {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error getting Gemini response:", error);
    throw error;
  }
};

/**
 * Start a chat session with Gemini
 * @returns {object} - Chat session object
 */
export const startGeminiChat = () => {
  try {
    const chat = model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      },
      systemInstruction, // Include the system instruction
    });
    return chat;
  } catch (error) {
    console.error("Error starting Gemini chat:", error);
    throw error;
  }
};

/**
 * Send a message in an existing chat session
 * @param {object} chat - The chat session object
 * @param {string} message - The user's message
 * @returns {Promise<string>} - The AI's response
 */
export const sendChatMessage = async (chat, message) => {
  try {
    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error sending chat message:", error);
    throw error;
  }
};

/**
 * Generate content with specific parameters
 * @param {string} prompt - The user's input prompt
 * @param {object} config - Configuration options for generation
 * @returns {Promise<string>} - The AI's response
 */
export const generateCustomContent = async (prompt, config = {}) => {
  try {
    const generationConfig = {
      temperature: config.temperature || 0.7,
      topP: config.topP || 0.8,
      topK: config.topK || 40,
      maxOutputTokens: config.maxOutputTokens || 2048,
    };

    const result = await model.generateContent(prompt, { generationConfig });
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating custom content:", error);
    throw error;
  }
};

/**
 * Stream a response from Gemini
 * @param {string} prompt - The user's input prompt
 * @param {function} onChunk - Callback function for each chunk of the response
 */
export const streamResponse = async (prompt, onChunk) => {
  try {
    const result = await model.generateContentStream(prompt);
    
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      onChunk(chunkText);
    }
  } catch (error) {
    console.error("Error streaming response:", error);
    throw error;
  }
};

// Export a default configuration object
export const defaultConfig = {
  temperature: 0.7,
  topP: 0.8,
  topK: 40,
  maxOutputTokens: 2048,
};