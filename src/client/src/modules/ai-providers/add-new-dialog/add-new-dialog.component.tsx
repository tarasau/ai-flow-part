import Dialog from '@corvu/dialog';
import { Accessor, Component } from 'solid-js';
import {
  Button,
  ButtonContainer,
  DialogContent,
  DialogLabel,
  DialogOverlay,
  FieldContainer,
  Form,
  Input,
  InputLabel,
} from './add-new-dialog.styles';
import { createForm } from '@tanstack/solid-form';
import { z } from 'zod';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { doNothing } from '@utils/do-nothing';
import { ConfirmFormData, providerFormValidator } from './add-new-dialog.validators';
import { ProvidersType } from '@server/modules/ai-provider/ai-provider.types';
import { Select, Option } from '../../../common/components/select/select.component';

type Props = {
  open: Accessor<boolean>;
  cancel: () => void;
  confirm: (value: ConfirmFormData) => void;
};

const aiProviders = [
  { value: ProvidersType.Anthropic, label: 'Anthropic' },
  { value: ProvidersType.Gemini, label: 'Gemini' },
  { value: ProvidersType.Groq, label: 'Groq' },
  { value: ProvidersType.OpenAI, label: 'OpenAI' },
] satisfies Option<ProvidersType>[];

const defaultValues: ConfirmFormData = {
  name: '',
  aiProvider: null,
  apiKey: '',
};

export const AddNewDialog: Component<Props> = ({ open, cancel, confirm }) => {
  const form = createForm(() => ({
    defaultValues,
    onSubmit: async ({ value }) => {
      confirm(value);
    },
    validators: {
      onSubmit: providerFormValidator,
    },
    validatorAdapter: zodValidator,
  }));

  return (
    <Dialog
      open={open()}
      onOpenChange={(newOpen) => {
        if (!newOpen) {
          cancel();
        }
      }}
    >
      <Dialog.Portal>
        <DialogOverlay />
        <DialogContent>
          <DialogLabel>Add AI Provider</DialogLabel>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit().catch(doNothing);
            }}
          >
            <FieldContainer>
              <form.Field
                name="name"
                validators={{
                  onChange: z.string(),
                }}
                children={(field) => (
                  <>
                    <InputLabel>
                      Name
                      <Input
                        name={field().name}
                        type="text"
                        value={field().state.value}
                        onBlur={field().handleBlur}
                        onInput={(e) => field().handleChange(e.target.value)}
                        required
                      />
                    </InputLabel>
                  </>
                )}
              />
              <form.Field
                name="aiProvider"
                validators={{
                  onChange: z.nativeEnum(ProvidersType).nullable(),
                }}
                children={(field) => (
                  <>
                    <InputLabel>
                      API key
                      <Select
                        options={aiProviders}
                        value={field().state.value || undefined}
                        onChange={(value) => field().handleChange(value)}
                      />
                    </InputLabel>
                  </>
                )}
              />
              <form.Field
                name="apiKey"
                validators={{
                  onChange: z.string(),
                }}
                children={(field) => (
                  <>
                    <InputLabel>
                      API key
                      <Input
                        name={field().name}
                        type="text"
                        value={field().state.value}
                        onBlur={field().handleBlur}
                        onInput={(e) => field().handleChange(e.target.value)}
                        required
                      />
                    </InputLabel>
                  </>
                )}
              />
            </FieldContainer>
            <ButtonContainer>
              <Button onClick={cancel}>Cancel</Button>
              <Button type="submit">Confirm</Button>
            </ButtonContainer>
          </Form>
        </DialogContent>
      </Dialog.Portal>
    </Dialog>
  );
};
