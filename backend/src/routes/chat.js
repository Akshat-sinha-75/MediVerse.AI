const express = require('express');
const { model } = require('../lib/gemini');
const { getAuthenticatedClient } = require('../lib/supabase');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

const SYSTEM_PROMPT = `You are MediVerse AI — a smart, practical healthcare assistant who acts like a trusted family doctor. You have access to the user's full medical history, records, and current medications.

PERSONALITY:
- Warm, confident, and reassuring — like a doctor who actually listens
- Direct and actionable — no generic filler
- Speak naturally, not like a legal disclaimer

WHAT YOU CAN DO:
- For **minor ailments** (headache, mild fever, cold, stomach ache, body pain, acidity, nausea, mild allergies): Suggest specific **OTC medications** with dosage (e.g., "Take Paracetamol 500mg every 6 hours" or "Try Ibuprofen 200mg after food")
- Recommend **home remedies** when appropriate (rest, hydration, specific foods, hot/cold compress)
- Look at the user's **medication list** and warn about interactions (e.g., "Since you're on X, avoid Y")
- **Infer patterns** from their medical history — if they frequently upload certain records, note trends
- Give **lifestyle tips** relevant to their condition
- Ask user for further details, like for example if fever, then temperature or persisting for how many days

RESPONSE FORMAT:
- Keep it short: 2-5 sentences for simple questions, max 8 for detailed ones
- Use **bold** for medication names and key actions
- Use bullet points only when listing multiple options/steps
- For greetings, reply warmly in 1-2 sentences

WHEN TO ESCALATE:
- Chest pain, breathing difficulty, high fever (>103°F/39.4°C for 3+ days), severe bleeding, sudden vision/speech changes → Say "Please see a doctor immediately" firmly
- Persistent symptoms beyond 3-5 days → Recommend a doctor visit
- Anything requiring prescription drugs → Mention they need a doctor's prescription

NEVER DO:
- Don't add "I'm not a doctor" to every response — only when truly necessary
- Don't refuse to help with basic health questions
- Don't give vague non-answers like "it depends, consult a professional" for simple issues`;

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { message, userId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Create authenticated Supabase client with user's JWT
    const userSupabase = getAuthenticatedClient(req.accessToken);

    // Fetch user's medical context + profile
    const [recordsRes, medsRes, profileRes] = await Promise.all([
      userSupabase
        .from('medical_records')
        .select('file_name, file_type, description, uploaded_at')
        .eq('user_id', userId)
        .limit(20),
      userSupabase
        .from('medications')
        .select('name, dosage, frequency, time_of_day, notes')
        .eq('user_id', userId)
        .eq('is_active', true),
      userSupabase
        .from('profiles')
        .select('full_name, date_of_birth, gender, blood_group, height_cm, weight_kg, allergies, chronic_conditions')
        .eq('id', userId)
        .single(),
    ]);

    const medicalRecords = recordsRes.data || [];
    const medications = medsRes.data || [];
    const profile = profileRes.data || {};

    // Calculate age and BMI
    const age = profile.date_of_birth
      ? Math.floor((Date.now() - new Date(profile.date_of_birth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
      : null;
    const bmi = profile.height_cm && profile.weight_kg
      ? (profile.weight_kg / Math.pow(profile.height_cm / 100, 2)).toFixed(1)
      : null;

    // Build context-rich prompt
    const contextPrompt = `${SYSTEM_PROMPT}

USER PROFILE:
Name: ${profile.full_name || 'Not provided'}
${age ? `Age: ${age} years` : ''}
${profile.gender ? `Gender: ${profile.gender}` : ''}
${profile.blood_group ? `Blood Group: ${profile.blood_group}` : ''}
${bmi ? `BMI: ${bmi} (Height: ${profile.height_cm}cm, Weight: ${profile.weight_kg}kg)` : ''}
${profile.allergies ? `⚠️ Allergies: ${profile.allergies}` : 'No known allergies'}
${profile.chronic_conditions ? `⚠️ Chronic Conditions: ${profile.chronic_conditions}` : 'No chronic conditions'}

Medical Records: ${medicalRecords.length > 0
        ? medicalRecords.map((r) => `${r.file_name} (${r.file_type || 'document'}, uploaded ${new Date(r.uploaded_at).toLocaleDateString()})`).join(', ')
        : 'No records uploaded yet'}

Current Medications: ${medications.length > 0
        ? medications.map((m) => `${m.name} - ${m.dosage}, ${m.frequency}${m.time_of_day ? `, ${m.time_of_day}` : ''}`).join('; ')
        : 'No medications listed'}

USER QUERY: ${message}`;

    // Generate response
    const result = await model.generateContent(contextPrompt);
    const reply = result.response.text();

    res.json({ reply });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({
      error: 'Failed to generate response',
      reply: 'I apologize, I encountered an issue processing your request. Please try again.',
    });
  }
});

module.exports = router;
