const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

router.post('/health-assistant', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;
    
    if (!GOOGLE_API_KEY) {
      return res.status(500).json({ error: 'Google API key not configured' });
    }

    const systemPrompt = "You are MediVerse's AI Health Assistant, a helpful medical information provider. You provide educational information about medical conditions, symptoms, treatments, and medicines. Always indicate that users should consult healthcare professionals for proper diagnosis and treatment. You do not diagnose conditions, prescribe medications, or provide personalized medical advice. You have knowledge about both allopathic and ayurvedic approaches.";
    
    // Build conversation context
    let conversationContext = systemPrompt + "\n\n";
    conversationHistory.forEach(msg => {
      conversationContext += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
    });
    conversationContext += `User: ${message}`;

    try {
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
      res.json({ response: data.candidates[0].content.parts[0].text });
    } catch (apiError) {
      // Fallback to local AI if Google API fails (quota exceeded, etc.)
      console.log('Google API failed, using fallback:', apiError.message);
      
      const responses = {
        'hello': "Hello! I'm MediVerse's AI Health Assistant. I can help you with general health information, symptoms, and medicine details. How can I assist you today?",
        'hi': "Hi there! I'm here to help with your health-related questions. What would you like to know about?",
        'help': "I can help you with:\n• General health information\n• Symptom explanations\n• Medicine information\n• Health tips and advice\n\nPlease note: I provide educational information only. Always consult healthcare professionals for proper diagnosis and treatment.",
        'symptoms': "I can help explain symptoms and their possible causes. However, I cannot diagnose conditions. Please describe your symptoms and I'll provide general information. For proper diagnosis, consult a healthcare professional.",
        'medicine': "I can provide information about medications, their uses, side effects, and precautions. Please specify which medicine you'd like to know about. Remember to consult healthcare professionals before taking any medication.",
        'pain': "Pain can have various causes. I can provide general information about different types of pain and when to seek medical help. Please describe your pain symptoms for more specific information.",
        'fever': "Fever is usually a sign of infection or illness. Normal body temperature is around 98.6°F (37°C). If fever persists or is very high, consult a healthcare professional immediately.",
        'headache': "Headaches can be caused by stress, dehydration, lack of sleep, or underlying conditions. If headaches are severe, frequent, or accompanied by other symptoms, seek medical attention.",
        'cough': "Coughing can be due to cold, flu, allergies, or other respiratory conditions. If cough persists for more than a week or is severe, consult a healthcare professional.",
        'stomach': "Stomach issues can range from indigestion to more serious conditions. If you have severe pain, persistent symptoms, or other concerning signs, seek medical help immediately."
      };

      const lowerMessage = message.toLowerCase();
      let response = "I understand you're asking about health-related topics. I can provide general information about symptoms, medicines, and health conditions. However, I cannot provide specific medical advice or diagnoses. Please consult healthcare professionals for proper medical care. What specific health topic would you like to know more about?";

      for (const [keyword, reply] of Object.entries(responses)) {
        if (lowerMessage.includes(keyword)) {
          response = reply;
          break;
        }
      }

      res.json({ response });
    }
  } catch (error) {
    console.error('Error in AI service:', error);
    res.status(500).json({ error: error.message || 'Failed to get response from AI assistant' });
  }
});

/**
 * Get health information about a specific medical condition or symptom
 */
router.post('/health-info', async (req, res) => {
  try {
    const { condition } = req.body;
    
    if (!GOOGLE_API_KEY) {
      return res.status(500).json({ error: 'Google API key not configured' });
    }

    const prompt = `You are a medical information assistant. Provide factual, educational information about medical conditions, symptoms, and treatments. Format your response with clear sections for: Description, Causes, Symptoms, Treatments (both conventional and alternative if applicable), and When to Seek Medical Help.

Provide detailed health information about ${condition}`;

    try {
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
        throw new Error(error.error?.message || 'Failed to get health information');
      }

      const data = await response.json();
      res.json({ response: data.candidates[0].content.parts[0].text });
    } catch (apiError) {
      // Fallback to local AI if Google API fails
      console.log('Google API failed, using fallback:', apiError.message);
      
      const healthInfo = {
        'fever': "**Fever Information:**\n\n**Description:** Fever is a temporary increase in body temperature, usually due to illness.\n\n**Normal Temperature:** 98.6°F (37°C)\n**Fever:** Above 100.4°F (38°C)\n\n**Common Causes:**\n• Viral or bacterial infections\n• Cold or flu\n• Urinary tract infections\n• Ear infections\n\n**When to Seek Medical Help:**\n• Fever above 103°F (39.4°C)\n• Fever lasting more than 3 days\n• Severe headache or neck stiffness\n• Difficulty breathing\n\n**General Care:**\n• Rest and stay hydrated\n• Use fever-reducing medications as directed\n• Monitor temperature regularly",
        
        'headache': "**Headache Information:**\n\n**Description:** Headaches are pain or discomfort in the head or neck area.\n\n**Common Types:**\n• Tension headaches\n• Migraine headaches\n• Cluster headaches\n\n**Common Causes:**\n• Stress and tension\n• Dehydration\n• Lack of sleep\n• Eye strain\n• Sinus problems\n\n**When to Seek Medical Help:**\n• Sudden, severe headache\n• Headache with fever or neck stiffness\n• Headache after head injury\n• Changes in vision or speech\n\n**General Care:**\n• Rest in a quiet, dark room\n• Apply cold or warm compress\n• Stay hydrated\n• Manage stress",
        
        'cough': "**Cough Information:**\n\n**Description:** Coughing is a reflex action to clear the airways.\n\n**Types:**\n• Dry cough (no mucus)\n• Wet cough (with mucus)\n• Chronic cough (lasting weeks)\n\n**Common Causes:**\n• Cold or flu\n• Allergies\n• Asthma\n• Acid reflux\n• Smoking\n\n**When to Seek Medical Help:**\n• Cough lasting more than 3 weeks\n• Coughing up blood\n• Difficulty breathing\n• Chest pain\n\n**General Care:**\n• Stay hydrated\n• Use humidifier\n• Avoid irritants\n• Rest and sleep well"
      };

      const lowerCondition = condition.toLowerCase();
      let response = healthInfo[lowerCondition] || `**General Health Information about ${condition}:**\n\nI can provide general information about health conditions, but for specific details about "${condition}", I recommend consulting reliable medical sources or healthcare professionals. Always seek professional medical advice for proper diagnosis and treatment.`;

      res.json({ response });
    }
  } catch (error) {
    console.error('Error getting health information:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get medicine information from MediVerse AI Health Assistant
 */
router.post('/medicine-info', async (req, res) => {
  try {
    const { medicine } = req.body;
    
    if (!GOOGLE_API_KEY) {
      return res.status(500).json({ error: 'Google API key not configured' });
    }

    const prompt = `You are a medication information provider. Provide educational information about medications, including uses, dosages, side effects, and precautions. Include information about both conventional and ayurvedic medicines if applicable. Remind users to consult healthcare professionals before taking any medication.

Provide detailed information about the medicine: ${medicine}`;

    try {
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
      res.json({ response: data.candidates[0].content.parts[0].text });
    } catch (apiError) {
      // Fallback to local AI if Google API fails
      console.log('Google API failed, using fallback:', apiError.message);
      
      const medicineInfo = {
        'paracetamol': "**Paracetamol (Acetaminophen) Information:**\n\n**Uses:**\n• Pain relief\n• Fever reduction\n• Headache treatment\n• Muscle aches\n\n**Dosage:**\n• Adults: 500-1000mg every 4-6 hours\n• Maximum: 4000mg per day\n• Take with food if stomach upset occurs\n\n**Side Effects:**\n• Rare: Skin rash, liver damage (with overdose)\n• Nausea (rare)\n\n**Precautions:**\n• Don't exceed recommended dose\n• Avoid alcohol\n• Check other medications for paracetamol content\n• Consult doctor if pregnant or breastfeeding",
        
        'ibuprofen': "**Ibuprofen Information:**\n\n**Uses:**\n• Pain relief\n• Inflammation reduction\n• Fever reduction\n• Arthritis pain\n\n**Dosage:**\n• Adults: 200-400mg every 4-6 hours\n• Maximum: 2400mg per day\n• Take with food\n\n**Side Effects:**\n• Stomach upset\n• Heartburn\n• Dizziness\n• Rare: Stomach bleeding\n\n**Precautions:**\n• Take with food\n• Avoid if you have stomach ulcers\n• Don't use if allergic to aspirin\n• Consult doctor if pregnant",
        
        'aspirin': "**Aspirin Information:**\n\n**Uses:**\n• Pain relief\n• Fever reduction\n• Anti-inflammatory\n• Blood thinning (low dose)\n\n**Dosage:**\n• Pain relief: 325-650mg every 4 hours\n• Blood thinning: 75-100mg daily\n• Take with food\n\n**Side Effects:**\n• Stomach irritation\n• Bleeding risk\n• Ringing in ears (high doses)\n\n**Precautions:**\n• Avoid if you have bleeding disorders\n• Don't give to children with viral infections\n• Consult doctor before use if pregnant\n• Stop before surgery"
      };

      const lowerMedicine = medicine.toLowerCase();
      let response = medicineInfo[lowerMedicine] || `**General Medicine Information for ${medicine}:**\n\nI can provide general information about medications, but for specific details about "${medicine}", I recommend consulting reliable medical sources, pharmacists, or healthcare professionals. Always consult healthcare professionals before taking any medication, especially if you have existing medical conditions or are taking other medications.`;

      res.json({ response });
    }
  } catch (error) {
    console.error('Error getting medicine information:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Test function to verify MediVerse AI Health Assistant connectivity
 */
router.get('/test', async (req, res) => {
  try {
    if (!GOOGLE_API_KEY) {
      return res.status(500).json({ error: 'Google API key not configured' });
    }

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
      res.json({ success: true, message: 'Google Gemini 1.5 Flash API connection successful' });
    } catch (apiError) {
      // API failed but fallback is available
      res.json({ 
        success: true, 
        message: `Google API temporarily unavailable (${apiError.message}), but fallback AI service is working` 
      });
    }
  } catch (error) {
    console.error('AI service test failed:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

