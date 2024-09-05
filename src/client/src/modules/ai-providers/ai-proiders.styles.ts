import { styled } from 'solid-styled-components';

export const StyledProviders = styled.div`
  width: 100%;
  max-width: 2xl;
`;
export const Card = styled.div`
  border-radius: 8px;
  border: max(1px, 0.0625rem) solid #30363db3;
  padding: 10px;
`;
export const ProvidersHeader = styled.div`
  margin-bottom: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
export const ProvidersTitle = styled.h2`
  width: 50%;
  text-align: start;
`;
export const ProvidersDescription = styled.h4`
  width: 50%;
  text-align: start;
`;
export const ProvidersContent = styled.div``;
export const CardDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: baseline;
  margin-right: 10px;
`;
export const ProviderName = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
export const Button = styled.button``;
export const SpaceY4 = styled.div`
  & > * + * {
    margin-top: 1rem;
  }
`;
export const FlexBetween = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
export const FontMedium = styled.div`
  font-weight: 500;
`;
export const GridGap4 = styled.div`
  display: grid;
  gap: 1rem;
`;
export const FlexCenterGap4 = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;
export const TextMutedForeground = styled.div`
  color: white;
`;
export const TextSmall = styled.div`
  font-size: 0.875rem;
`;
export const FlexGap2 = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;
export const RedTextButton = styled.button`
  padding: 0.4em 0.8em;
  color: red;
`;
