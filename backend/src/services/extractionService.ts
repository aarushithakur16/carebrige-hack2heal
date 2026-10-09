import { ExtractionSchema, ExtractedData } from '../types/extraction';

export const extractMedicalData = async (ocrText: string): Promise<{ data: ExtractedData, rawOutput: string }> => {
  // In a real scenario, this would call an LLM (e.g. OpenAI or Gemini)
  // using process.env.LLM_API_KEY
  // For the mock, we simulate LLM JSON generation based on OCR text
  
  // Note: LLM prompt instructions in a real service:
  // "You must only extract information present in the source document.
  // It must NOT: diagnose disease, prescribe treatment, change medication doses,
  // invent medicines, invent appointments, invent tests, invent warning signs."
  
  await new Promise(resolve => setTimeout(resolve, 1000));

  const mockExtractedData = {
    medicines: [
      { name: 'Amoxicillin', dose_text: '500mg', frequency: 'Twice daily', timing: 'Morning and evening' }
    ],
    appointments: [
      { date: 'Oct 20', department: 'Cardiology' }
    ],
    tests: [
      { test_name: 'Complete Blood Count (CBC)', due_date: 'Oct 12' },
      { test_name: 'Chest X-Ray', due_date: 'Oct 14' }
    ],
    care_instructions: [
      { instruction: 'Rest and drink plenty of fluids.' }
    ],
    warning_signs: [
      { warning: 'Fever above 101F.' }
    ]
  };

  // Validate strict JSON output via Zod
  const validationResult = ExtractionSchema.safeParse(mockExtractedData);

  if (!validationResult.success) {
    throw new Error('Malformed AI output: Failed strict schema validation.');
  }

  return {
    data: validationResult.data,
    rawOutput: JSON.stringify(mockExtractedData)
  };
};
