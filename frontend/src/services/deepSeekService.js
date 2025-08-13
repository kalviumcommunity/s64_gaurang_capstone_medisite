/**
 * DeepSeek AI API Service
 * This service handles communication with the DeepSeek API for AI health assistant functionalities
 */

const DEEPSEEK_API_KEY = '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';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

/**
 * Get a health-related response from DeepSeek AI
 * @param {string} userMessage - The user's health-related query
 * @param {Array} conversationHistory - Previous conversation for context
 * @returns {Promise} - Promise resolving to AI response
 */
export const getHealthAssistantResponse = async (userMessage, conversationHistory = []) => {
  try {
    // Format conversation history in the format DeepSeek expects
    const messages = [
      {
        role: "system",
        content: "You are MediVerse's AI Health Assistant, a helpful medical information provider. You provide educational information about medical conditions, symptoms, treatments, and medicines. Always indicate that users should consult healthcare professionals for proper diagnosis and treatment. You do not diagnose conditions, prescribe medications, or provide personalized medical advice. You have knowledge about both allopathic and ayurvedic approaches."
      },
      ...conversationHistory,
      { role: "user", content: userMessage }
    ];

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: messages,
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to get response from DeepSeek AI');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error in DeepSeek AI service:', error);
    throw error;
  }
};

/**
 * Get health information about a specific medical condition or symptom
 * @param {string} condition - The condition or symptom to get information about
 * @returns {Promise} - Promise resolving to condition information
 */
export const getHealthInformation = async (condition) => {
  try {
    const messages = [
      {
        role: "system",
        content: "You are a medical information assistant. Provide factual, educational information about medical conditions, symptoms, and treatments. Format your response with clear sections for: Description, Causes, Symptoms, Treatments (both conventional and alternative if applicable), and When to Seek Medical Help."
      },
      { 
        role: "user", 
        content: `Provide detailed health information about ${condition}`
      }
    ];

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: messages,
        temperature: 0.3,
        max_tokens: 1500
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to get health information');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error getting health information:', error);
    throw error;
  }
};

/**
 * Get medicine information from DeepSeek AI
 * @param {string} medicine - The medicine name to get information about
 * @returns {Promise} - Promise resolving to medicine information
 */
export const getMedicineInformation = async (medicine) => {
  try {
    const messages = [
      {
        role: "system",
        content: "You are a medication information provider. Provide educational information about medications, including uses, dosages, side effects, and precautions. Include information about both conventional and ayurvedic medicines if applicable. Remind users to consult healthcare professionals before taking any medication."
      },
      { 
        role: "user", 
        content: `Provide detailed information about the medicine: ${medicine}`
      }
    ];

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: messages,
        temperature: 0.3,
        max_tokens: 1500
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to get medicine information');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error getting medicine information:', error);
    throw error;
  }
};

export default {
  getHealthAssistantResponse,
  getHealthInformation,
  getMedicineInformation
}; 