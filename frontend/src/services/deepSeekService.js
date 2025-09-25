/**
 * Google AI Studio API Service
 * This service handles communication with Google's Gemini API for AI health assistant functionalities
 * Using Google AI Studio API Key for Gemini 1.5 Flash model
 */

const GOOGLE_API_KEY = 'AIzaSyBmtNIsoManDKg-nYYgi_cN14vRz0fhv7Y';
const GOOGLE_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

/**
 * Get a health-related response from Google Gemini AI
 * @param {string} userMessage - The user's health-related query
 * @param {Array} conversationHistory - Previous conversation for context
 * @returns {Promise} - Promise resolving to AI response
 */
export const getHealthAssistantResponse = async (userMessage, conversationHistory = []) => {
  try {
    // Format conversation history for Gemini API
    const systemPrompt = "You are MediVerse's AI Health Assistant, a helpful medical information provider. You provide educational information about medical conditions, symptoms, treatments, and medicines. Always indicate that users should consult healthcare professionals for proper diagnosis and treatment. You do not diagnose conditions, prescribe medications, or provide personalized medical advice. You have knowledge about both allopathic and ayurvedic approaches.";
    
    // Build conversation context
    let conversationContext = systemPrompt + "\n\n";
    conversationHistory.forEach(msg => {
      conversationContext += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
    });
    conversationContext += `User: ${userMessage}`;

    const response = await fetch(`${GOOGLE_API_URL}?key=${GOOGLE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: conversationContext
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000,
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to get response from Google Gemini AI');
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error in Google Gemini AI service:', error);
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
    console.log('Making Google Gemini 1.5 Flash API request for condition:', condition);
    const prompt = `You are a medical information assistant. Provide factual, educational information about medical conditions, symptoms, and treatments. Format your response with clear sections for: Description, Causes, Symptoms, Treatments (both conventional and alternative if applicable), and When to Seek Medical Help.

Provide detailed health information about ${condition}`;

    const response = await fetch(`${GOOGLE_API_URL}?key=${GOOGLE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1500,
        }
      })
    });

    console.log('Google Gemini 1.5 Flash API response status:', response.status);

    if (!response.ok) {
      const error = await response.json();
      console.error('Google Gemini API error:', error);
      throw new Error(error.error?.message || 'Failed to get health information');
    }

    const data = await response.json();
    console.log('Google Gemini 1.5 Flash API response data:', data);
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error getting health information:', error);
    throw error;
  }
};

/**
 * Get medicine information from Google Gemini AI
 * @param {string} medicine - The medicine name to get information about
 * @returns {Promise} - Promise resolving to medicine information
 */
export const getMedicineInformation = async (medicine) => {
  try {
    const prompt = `You are a medication information provider. Provide educational information about medications, including uses, dosages, side effects, and precautions. Include information about both conventional and ayurvedic medicines if applicable. Remind users to consult healthcare professionals before taking any medication.

Provide detailed information about the medicine: ${medicine}`;

    const response = await fetch(`${GOOGLE_API_URL}?key=${GOOGLE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1500,
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to get medicine information');
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error getting medicine information:', error);
    throw error;
  }
};

/**
 * Test function to verify Google Gemini API connectivity
 * @returns {Promise} - Promise resolving to test result
 */
export const testAPIConnection = async () => {
  try {
    const response = await fetch(`${GOOGLE_API_URL}?key=${GOOGLE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: 'Hello, are you working?'
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 50,
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Google Gemini API test failed');
    }

    const data = await response.json();
    return { success: true, message: 'Google Gemini 1.5 Flash API connection successful' };
  } catch (error) {
    console.error('Google Gemini API test failed:', error);
    return { success: false, message: error.message };
  }
};

export default {
  getHealthAssistantResponse,
  getHealthInformation,
  getMedicineInformation,
  testAPIConnection
}; 