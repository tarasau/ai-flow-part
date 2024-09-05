import { z } from "zod";
import { emailValidator, passwordValidator } from "../auth.validators";

export const sighInValidator = z.object({
  email: emailValidator,
  password: passwordValidator,
});
