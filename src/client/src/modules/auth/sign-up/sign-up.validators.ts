import { z } from "zod";
import { emailValidator } from "../auth.validators";

export const sighUpValidator = z.object({
  email: emailValidator,
});
