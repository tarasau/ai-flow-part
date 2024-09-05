import { z } from "zod";

export const passwordValidator = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password cannot be longer than 128 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!#%*?&]{8,}$/,
    "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character",
  );

export const emailValidator = z.string().email("Invalid email address").min(5);
