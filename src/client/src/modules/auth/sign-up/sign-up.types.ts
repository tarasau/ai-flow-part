import { z } from "zod";
import { sighUpValidator } from "./sign-up.validators";

export type SignUpWrapperProps = {
  disabled: boolean;
};

export type SignUpFormData = z.TypeOf<typeof sighUpValidator>;
