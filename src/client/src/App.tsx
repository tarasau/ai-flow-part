import { QueryClient, QueryClientProvider } from '@tanstack/solid-query';
import { Routes } from './router/routes.tsx';
import { ThemeProvider } from 'solid-styled-components';
import { useTheme } from '@infrastructure/theme/theme.hook.ts';
import './App.css';
import { CodeExecutor, CodeExecutorProvider } from '@infrastructure/code-executor.tsx';

const queryClient = new QueryClient();
const codeExecutor = new CodeExecutor();

export const App = () => {
  const theme = useTheme();

  return (
    <CodeExecutorProvider value={codeExecutor}>
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <Routes />
        </QueryClientProvider>
      </ThemeProvider>
    </CodeExecutorProvider>
  );
};
