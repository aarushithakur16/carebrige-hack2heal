import { ExtractionSchema, ExtractedData } from '../types/extraction';

export const extractMedicalData = async (ocrText: string): Promise<ExtractedData> => {
  const apiKey = process.env.LLM_API_KEY;
  const prompt = `
You are a medical data extraction assistant. Your task is to extract information strictly from the provided OCR text of a medical document into a structured JSON format.

CRITICAL RULES:
1. DO NOT diagnose diseases.
2. DO NOT prescribe treatments.
3. DO NOT change medication doses.
4. DO NOT invent medicines, appointments, tests, or warning signs.
5. ONLY extract information explicitly present in the source document.
6. The output MUST be valid JSON conforming to the schema below.
7. Include the field "status" with the exact string "DRAFT — REQUIRES USER VERIFICATION".

JSON SCHEMA:
{
  "medicines": [{ "name": "", "dose_text": "", "frequency": "", "timing": "" }],
  "appointments": [{ "date": "", "department": "" }],
  "tests": [{ "test_name": "", "due_date": "" }],
  "care_instructions": [{ "instruction": "" }],
  "warning_signs": [{ "warning": "" }],
  "status": "DRAFT — REQUIRES USER VERIFICATION"
}

OCR TEXT:
"""
${ocrText}
"""
`;

  if (!apiKey) {
    console.log('[Extraction Service] No LLM_API_KEY provided. Returning mock drafted extraction.');
    const mockData = {
      medicines: [{ name: "Amoxicillin", dose_text: "500mg", frequency: "Twice daily", timing: "Morning and Evening" }],
      appointments: [],
      tests: [],
      care_instructions: [{ instruction: "Rest recommended." }],
      warning_signs: [],
      status: "DRAFT — REQUIRES USER VERIFICATION"
    };
    // Validate mock against our schema to ensure correctness
    return ExtractionSchema.parse(mockData);
  }

  try {
    console.log('[Extraction Service] Calling LLM API...');
    
    // Example using standard OpenAI-compatible API format (can be swapped for Gemini/Anthropic as needed)
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o', // or another supported model
        response_format: { type: "json_object" },
        messages: [
          {
            role: 'system',
            content: 'You are a precise medical data extraction tool that outputs valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.0 // Strict extraction, no creativity
      })
    });

    if (!response.ok) {
      throw new Error(`LLM API returned status: ${response.status}`);
    }

    const data = await response.json();
    const jsonString = data.choices[0].message.content;
    
    const parsedData = JSON.parse(jsonString);

    // Validate the complete JSON structure against the Zod schema
    // This will throw an error and reject malformed AI output
    const validatedData = ExtractionSchema.parse(parsedData);
    
    return validatedData;

  } catch (error) {
    console.error('[Extraction Service] Extraction failed:', error);
    throw new Error('Failed to extract data or AI output was malformed.');
  }
};
