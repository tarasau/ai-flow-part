import { createSignal, For } from 'solid-js';

export type Option<T> = {
  value: T;
  label: string;
};

type SelectProps<T> = {
  options: Option<T>[];
  value?: T;
  onChange?: (value: T) => void;
};

export const Select = <T extends string>(props: SelectProps<T>) => {
  const [selected, setSelected] = createSignal(props.value);

  const handleChange = (event: Event) => {
    const target = event.target as HTMLSelectElement;
    setSelected(target.value as Parameters<typeof setSelected>[0]);
    props.onChange?.(target.value as T);
  };

  return (
    <select value={selected()} onChange={handleChange}>
      <For each={props.options}>
        {(option, index) => <option value={option.value}>{option.label}</option>}
      </For>
    </select>
  );
};
