import { useNavigate } from '@solidjs/router';
import { Component } from 'solid-js';
import { paths } from '../../router/paths';
import { SidebarItem, SidebarItemsContainer, SidebarWrapper } from './sidebar.styles';

export const Sidebar: Component = () => {
  const navigate = useNavigate();

  const logOut = () => {
    navigate(paths.signIn(), { replace: true });
  };

  return (
    <SidebarWrapper>
      <SidebarItemsContainer>
        <SidebarItem href={paths.dashboard()}>Dashboard</SidebarItem>
        <SidebarItem href={paths.flows()}>Flows</SidebarItem>
        <SidebarItem href={paths.aiProviders()}>AI Providers</SidebarItem>
      </SidebarItemsContainer>
      <button onClick={logOut}>Log Out</button>
    </SidebarWrapper>
  );
};
