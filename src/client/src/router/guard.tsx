import { RouteSectionProps, useNavigate } from '@solidjs/router';
import { createEffect } from 'solid-js';
import { Component } from 'solid-js';
import { Sidebar } from '../modules/sidebar/sidebar.component';

export const RouteGuard: Component<RouteSectionProps> = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');

  createEffect(() => {
    if (!token) {
      navigate('/sign-in', { replace: true });
    }
  });

  return (
    <>
      <Sidebar />
      <div style={{ 'margin-left': '160px', padding: '20px', height: '100%' }}>{children}</div>
    </>
  );
};
