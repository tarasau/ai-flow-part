import { styled } from "solid-styled-components";
import { SignInWrapperProps } from "./sign-in.types";

export const SignInWrapper = styled.div<SignInWrapperProps>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: ${({ theme }) => theme!.colors.primary};
  color: white;
  pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};
`;

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  padding: 2rem;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 500px;
  align-items: center;
`;

export const InputWrapper = styled.div`
  margin-bottom: 1rem;
  width: 350px;
  text-align: start;
`;

export const StyledInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }
`;

export const StyledButton = styled.button`
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  background-color: #00008b; // Deep Blue
  color: white;
  cursor: pointer;
  &:hover {
    background-color: #0000cd;
  }
  width: 150px;
`;

export const StyledH2 = styled.h2`
  margin-bottom: 1rem;
  text-align: center;
`;

export const SmallText = styled.p`
  margin-top: 20px;
  font-size: 12px;
  text-align: left;
  a {
    color: #00008b;
    &:hover {
      color: #0000cd;
    }
  }
`;
