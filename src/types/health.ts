import { z } from "zod";

export const healthRecordFormSchema = z.object({
  record_date: z.string(),
  record_type: z.string().min(1, "Record type is required"),
  description: z.string().min(1, "Description is required"),
  cost: z.string()
    .transform((val) => {
      if (val === "") return null;
      const parsed = parseFloat(val);
      return isNaN(parsed) ? null : parsed;
    }),
  notes: z.string().optional(),
});

export type HealthRecordFormValues = z.infer<typeof healthRecordFormSchema>;

export const RECORD_TYPES = [
  { value: "medication", label: "Medication" },
  { value: "disease", label: "Disease" },
  { value: "treatment", label: "Treatment" },
  { value: "checkup", label: "Checkup" },
  { value: "other", label: "Other" },
] as const;