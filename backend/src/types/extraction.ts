import { z } from 'zod';

export const MedicineSchema = z.object({
  name: z.string(),
  dose_text: z.string(),
  frequency: z.string(),
  timing: z.string()
});

export const AppointmentSchema = z.object({
  date: z.string(),
  department: z.string()
});

export const TestSchema = z.object({
  test_name: z.string(),
  due_date: z.string()
});

export const CareInstructionSchema = z.object({
  instruction: z.string()
});

export const WarningSignSchema = z.object({
  warning: z.string()
});

export const ExtractionSchema = z.object({
  medicines: z.array(MedicineSchema),
  appointments: z.array(AppointmentSchema),
  tests: z.array(TestSchema),
  care_instructions: z.array(CareInstructionSchema),
  warning_signs: z.array(WarningSignSchema),
  status: z.literal("DRAFT — REQUIRES USER VERIFICATION")
});

export type ExtractedData = z.infer<typeof ExtractionSchema>;
