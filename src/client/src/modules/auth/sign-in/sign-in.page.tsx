import { useNavigate } from '@solidjs/router';
import { Component, createEffect, createSignal, Show } from 'solid-js';
import { paths } from '../../../router/paths';
import {
  InputWrapper,
  SignInWrapper,
  SmallText,
  StyledButton,
  StyledForm,
  StyledH2,
  StyledInput,
} from './sign-in.styles';
import { createForm } from '@tanstack/solid-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { doNothing } from '@utils/do-nothing';
import { FieldInfo } from '../../../common/components/helpers/field-info.component';
import { SignInFormData } from './sign-in.types';
import { sighInValidator } from './sign-in.validators';
import { emailValidator, passwordValidator } from '../auth.validators';
import { signIn } from '../auth.service';
import { saveTokens } from '@infrastructure/save-token';

export const SignInPage: Component = () => {
  const navigate = useNavigate();
  const { mutate } = signIn();

  const [failedSignIn, setFailedSignIn] = createSignal(false);

  const signInHandler = (value: SignInFormData) => {
    mutate(value, {
      onSuccess: (tokens) => {
        saveTokens(tokens);
        navigate(paths.dashboard(), { replace: true });
      },
      onError: () => setFailedSignIn(true),
    });
  };

  createEffect(() => {
    if (sessionStorage.getItem('access_token')) {
      navigate(paths.dashboard(), { replace: true });
    }
  });

  const form = createForm(() => ({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      signInHandler(value);
    },
    validators: {
      onSubmit: sighInValidator,
    },
    validatorAdapter: zodValidator,
  }));

  return (
    <SignInWrapper disabled={false}>
      <StyledForm
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit().catch(doNothing);
        }}
      >
        <StyledH2>Sign In</StyledH2>
        <InputWrapper>
          <form.Field
            name="email"
            validators={{
              onChange: emailValidator,
            }}
            children={(field) => (
              <>
                <label>
                  Email
                  <StyledInput
                    placeholder="example@email.com"
                    name={field().name}
                    type="text"
                    value={field().state.value}
                    onBlur={field().handleBlur}
                    onInput={(e) => field().handleChange(e.target.value)}
                    required
                  />
                </label>
                <FieldInfo field={field} />
              </>
            )}
          />
        </InputWrapper>
        <InputWrapper>
          <form.Field
            name="password"
            validators={{
              onChange: passwordValidator,
            }}
            children={(field) => (
              <>
                <label>
                  Password
                  <StyledInput
                    name={field().name}
                    type="password"
                    value={field().state.value}
                    onBlur={field().handleBlur}
                    onInput={(e) => field().handleChange(e.target.value)}
                    required
                  />
                </label>
                <FieldInfo field={field} />
              </>
            )}
          />
        </InputWrapper>
        <Show when={failedSignIn()}>
          <p>Fail to Sign In. Please check email or password</p>
        </Show>
        <StyledButton type="submit">Sign In</StyledButton>
        <SmallText>
          Don't have an account? <a onClick={() => navigate(paths.signUp())}>Sign Up</a>
        </SmallText>
      </StyledForm>
    </SignInWrapper>
  );
};
