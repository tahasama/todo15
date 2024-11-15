import { z } from "zod";

const matchPsswrdSchema = z
  .object({
    psswrd: z.string().min(6, "Your password must be at least 6 characters."),
    confirmPsswrd: z
      .string()
      .min(6, "Your password must be at least 6 characters."),
  })
  .superRefine((val, ctx) => {
    if (val.psswrd !== val.confirmPsswrd) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPsswrd"],
        message: "Your passwords do not match, please try again.",
      });
    }
  });

export const formSchema = z
  .object({
    email: z.string().email(),
  })
  .and(matchPsswrdSchema);

export const signInSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  psswrd: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(6, "Password must atleasr 6 characters"),
});
