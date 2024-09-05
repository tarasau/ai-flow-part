import { Component, For, Show, createEffect, createSignal } from 'solid-js';
import {
  Button,
  Card,
  CardDetails,
  FlexBetween,
  FlexCenterGap4,
  FlexGap2,
  FontMedium,
  GridGap4,
  ProviderName,
  ProvidersContent,
  ProvidersDescription,
  ProvidersHeader,
  ProvidersTitle,
  RedTextButton,
  SpaceY4,
  StyledProviders,
  TextMutedForeground,
  TextSmall,
} from './ai-proiders.styles';
import { useConfirm } from '@infrastructure/use-confirm.ts';
import { ConfirmFormData } from './add-new-dialog/add-new-dialog.validators';
import { AddNewDialog } from './add-new-dialog/add-new-dialog.component';
import { addNewProviderCreator, deleteProviderCreator } from './ai-providers.service';
import { useQueryClient } from '@tanstack/solid-query';
import { getAll } from '../auth/auth.service';
import { ProvidersType } from '@server/modules/ai-provider/ai-provider.types';

export const AIProvidersPage: Component = () => {
  const [isOpen, start, confirm, , cancel] = useConfirm<ConfirmFormData>();
  const queryClient = useQueryClient();

  const query = getAll();

  const [providersList, setProvidersList] = createSignal(query?.data?.aiProvider || []);

  createEffect(() => setProvidersList(query?.data?.aiProvider || []));
  const { mutate: addNewProvider } = addNewProviderCreator();
  const { mutate: deleteProvider } = deleteProviderCreator();

  const handleStart = () => {
    start().then(({ isCancelled, value }) => {
      if (isCancelled || !value || !value.aiProvider) return;
      addNewProvider(
        { name: value.name, provider: { apiKey: value.apiKey }, type: value.aiProvider },
        {
          onSuccess: () => queryClient.invalidateQueries({ queryKey: ['getAll'] }),
        },
      );
    });
  };

  const removeProvider = (provider: ReturnType<typeof providersList>[0]) => {
    deleteProvider(provider.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['getAll'] });
      },
    });
  };

  const getProviderAuthInfo = (provider: ReturnType<typeof providersList>[0]) => {
    switch (provider.type) {
      default:
        return '';
        break;
      case ProvidersType.Groq:
        return provider.groqCredential.apiKey;
        break;
      case ProvidersType.Anthropic:
        return provider.anthropicCredential.apiKey;
        break;
      case ProvidersType.OpenAI:
        return provider.openAiCredential.apiKey;
        break;
      case ProvidersType.Gemini:
        return provider.geminiCredentials.apiKey;
        break;
    }
  };

  return (
    <>
      <AddNewDialog open={isOpen} cancel={cancel} confirm={confirm}></AddNewDialog>
      <StyledProviders>
        <ProvidersHeader>
          <ProvidersTitle>AI Providers</ProvidersTitle>
          <ProvidersDescription>
            Manage your AI providers keys for access to assistants
          </ProvidersDescription>
        </ProvidersHeader>
        <ProvidersContent>
          <SpaceY4>
            <FlexBetween>
              <FontMedium>Your AI Providers:</FontMedium>
              <Button onClick={handleStart}>Add New</Button>
            </FlexBetween>
            <Show when={!providersList()}>
              <div>No providers have been added yet. Click 'Add New' to list your first one.</div>
            </Show>
            <GridGap4>
              <For each={providersList()}>
                {(provider) => (
                  <Card>
                    <ProvidersContent as={FlexBetween}>
                      <FlexCenterGap4>
                        <KeyIcon />
                        <CardDetails>
                          <ProviderName>
                            <FontMedium>{provider.name}</FontMedium>: {provider.type}
                          </ProviderName>
                          <TextMutedForeground>{getProviderAuthInfo(provider)}</TextMutedForeground>
                          <TextSmall>{provider.createdAt}</TextSmall>
                        </CardDetails>
                      </FlexCenterGap4>
                      <FlexGap2>
                        <RedTextButton onClick={() => removeProvider(provider)}>
                          <TrashIcon />
                        </RedTextButton>
                      </FlexGap2>
                    </ProvidersContent>
                  </Card>
                )}
              </For>
            </GridGap4>
          </SpaceY4>
        </ProvidersContent>
      </StyledProviders>
    </>
  );
};

function KeyIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4" />
      <path d="m21 2-9.6 9.6" />
      <circle cx="7.5" cy="15.5" r="5.5" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}
