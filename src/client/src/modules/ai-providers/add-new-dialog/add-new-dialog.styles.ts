import Dialog, { Label } from '@corvu/dialog';
import { styled } from 'solid-styled-components';

export const DialogOverlay = styled(Dialog.Overlay)`
  position: fixed;
  inset: 0px;
  z-index: 50;
  background-color: rgb(0 0 0 / 0.5);
`;

export const DialogContent = styled(Dialog.Content)`
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  left: 50%;
  top: 50%;
  z-index: 50;
  max-width: 600px;
  min-width: 450px;
  transform: translate(-50%, -50%);
  border-radius: 0.5rem;
  border-width: 2px;
  border-color: hsl(258, 79%, 74%);
  background-color: ${({ theme }) => theme!.colors.primary};
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
  animation-duration: 200ms;
`;

export const DialogLabel = styled(Label)`
  font-size: 18px;
  margin-bottom: 20px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: start;
`;

export const InputLabel = styled.label`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const Input = styled.input`
  color: white;
  border: 1px solid #555;
  padding: 8px;
  border-radius: 4px;
`;

// export const StyledSelect = styled(Select)`
//   color: white;
//   border: 1px solid #555;
//   border-radius: 4px;
// `;
//
export const Button = styled.button`
  padding: 10px 15px;
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;
