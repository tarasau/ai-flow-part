import { styled } from 'solid-styled-components';

export const SidebarWrapper = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: white;
  left: 0;
  top: 0;
  height: 100%;
  width: 160px;
  z-index: 1;
  overflow-x: hidden;
  padding-top: 20px;
  background-color: ${({ theme }) => theme!.colors.primary};
  svg {
    cursor: pointer;
  }
`;

export const SidebarItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 0 20px;
`;

export const SidebarItem = styled.a`
  &:not(:last-child) {
    margin-bottom: 5px;
  }
`;
