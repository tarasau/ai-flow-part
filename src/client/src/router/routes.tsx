import { Route, Router } from '@solidjs/router';
import { DashboardPage } from '../modules/dashboard/dashboard.page.tsx';
import { FlowsPage } from '../modules/flows/flows.page.tsx';
import { paths } from './paths.ts';
import { RouteGuard } from './guard.tsx';
import { SignInPage } from '../modules/auth/sign-in/sign-in.page.tsx';
import { SignUpPage } from '../modules/auth/sign-up/sign-up.page.tsx';
import { AIProvidersPage } from '../modules/ai-providers/ai-providers.page.tsx';
import { FlowDetails } from '../modules/flows/flow-details/flow-details.page.tsx';

export const Routes = () => {
  return (
    <Router>
      <Route path={paths.signIn()} component={SignInPage} />
      <Route path={paths.signUp()} component={SignUpPage} />
      <Route path="/" component={RouteGuard}>
        <Route path={paths.dashboard()} component={DashboardPage} />
        <Route path={paths.flows()} component={FlowsPage} />
        <Route path={paths.flowDetails()} component={FlowDetails} />
        <Route path={paths.flowDetails()} component={FlowsPage} />
        <Route path={paths.aiProviders()} component={AIProvidersPage} />
      </Route>
    </Router>
  );
};
