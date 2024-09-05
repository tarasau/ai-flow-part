import { z } from "zod";
import { sighInValidator } from "./sign-in.validators";

export type SignInWrapperProps = {
  disabled: boolean;
};

export type SignInFormData = z.TypeOf<typeof sighInValidator>;
