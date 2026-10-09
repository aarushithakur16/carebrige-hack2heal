import fs from 'fs';

export interface OCRResult {
  text: string;
  confidence: number;
  pages: number[];
}

export const processDocumentOCR = async (filePath: string): Promise<OCRResult> => {
  // Mock OCR implementation for hackathon prototype
  // Wait to simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Read basic info if file exists, else mock
  let content = "MOCK_OCR_CONTENT";
  if (fs.existsSync(filePath)) {
    content = `Mocked OCR extraction for file ${filePath}. The patient needs Amoxicillin 500mg twice daily in the morning and evening. Also schedule a CBC on Oct 12 and a Chest X-Ray on Oct 14. Follow up with Cardiology on Oct 20.`;
  }
  
  return {
    text: content,
    confidence: 0.95,
    pages: [1]
  };
};
