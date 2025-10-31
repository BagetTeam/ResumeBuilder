import { z } from "zod";

export const ResumeData = z.object({
  resume: z.array(z.string()),
  datetime: z.number(),
});

export type ResumeData = z.infer<typeof ResumeData>;
