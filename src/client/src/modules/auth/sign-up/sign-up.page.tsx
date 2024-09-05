import { useNavigate } from '@solidjs/router';
import { createForm } from '@tanstack/solid-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Component, Match, Switch, createSignal } from 'solid-js';
import {
  InputWrapper,
  SignUpWrapper,
  SmallText,
  StyledButton,
  StyledForm,
  StyledH2,
  StyledInput,
} from './sign-up.styles';
import { doNothing } from '@utils/do-nothing';
import { emailValidator } from '../auth.validators';
import { FieldInfo } from '../../../common/components/helpers/field-info.component';
import { sighUpValidator } from './sign-up.validators';
import { paths } from '../../../router/paths';
import { SignUpFormData } from './sign-up.types';
import { signUp } from '../auth.service';

export const SignUpPage: Component = () => {
  const navigate = useNavigate();
  const { mutate } = signUp();

  const [succesfullSignUp, setSuccesfullSignUp] = createSignal(false);

  const signUpHanlder = (value: SignUpFormData) => {
    mutate(value.email, {
      onSuccess: () => setSuccesfullSignUp(true),
    });
  };

  const form = createForm(() => ({
    defaultValues: {
      email: '',
    },
    onSubmit: async ({ value }) => {
      signUpHanlder(value);
    },
    validators: {
      onSubmit: sighUpValidator,
    },
    validatorAdapter: zodValidator,
  }));

  return (
    <SignUpWrapper disabled={false}>
      <StyledForm
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit().catch(doNothing);
        }}
      >
        <StyledH2>Sign Up</StyledH2>
        <InputWrapper>
          <form.Field
            name="email"
            validators={{
              onChange: emailValidator,
            }}
            children={(field) => (
              <>
                <label>
                  Join our waitlist: Enter your email address
                  <StyledInput
                    placeholder="example@email.com"
                    name={field().name}
                    value={field().state.value}
                    onBlur={field().handleBlur}
                    onInput={(e) => field().handleChange(e.target.value)}
                  />
                </label>
                <FieldInfo field={field} />
              </>
            )}
          />
        </InputWrapper>
        <Switch>
          <Match when={succesfullSignUp()}>
            <p>Thank you! Email added to waitlist</p>
          </Match>
          <Match when={!succesfullSignUp()}>
            <StyledButton type="submit">Submit</StyledButton>
          </Match>
        </Switch>
        <SmallText>
          Already have an account? <a onClick={() => navigate(paths.signIn())}>Sign In</a>
        </SmallText>
      </StyledForm>
    </SignUpWrapper>
  );
};
