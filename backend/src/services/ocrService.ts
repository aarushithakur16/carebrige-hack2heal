export interface OCRResult {
  text: string;
  confidence: number;
  pages: string[];
}

export const processDocumentOCR = async (filePath: string): Promise<OCRResult> => {
  // Mock OCR implementation for hackathon prototype
  console.log(`[OCR Service] Processing document: ${filePath}`);
  
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  return {
    text: "MOCK_OCR_TEXT: Patient exhibits mild symptoms. Prescribed 500mg Amoxicillin. Rest recommended.",
    confidence: 0.95,
    pages: ["Page 1: Patient details and diagnosis.", "Page 2: Prescription information."]
  };
};
