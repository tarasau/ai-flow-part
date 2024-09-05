import { useParams } from '@solidjs/router';
import { getAll } from '../../auth/auth.service';
import { createSignal, Show } from 'solid-js';
import { FlowMount } from '@infrastructure/flow-mount';
import { AppMessagingService } from '../../dashboard/dashboard.types';
import { createMemo } from 'solid-js';
import { getPlugins } from '../flows.service';

export const FlowDetails = () => {
  const query = getAll();
  const messagingServiceSignal = createSignal<AppMessagingService | null>(null);
  const [messagingService] = messagingServiceSignal;
  const pluginsResponse = getPlugins();

  const { id } = useParams();

  const flowSchema = () => query?.data?.flow.find((el) => el.id.toString() === id)?.schema;
  const plugins = createMemo(() => pluginsResponse.data || []);

  return (
    <div>
      <h2>Flow {id}</h2>
      <Show when={flowSchema()} fallback={<div>Loading...</div>}>
        {(fs) => (
          <FlowMount flow={fs} plugins={plugins} messagingServiceSignal={messagingServiceSignal} />
        )}
      </Show>
    </div>
  );
};
