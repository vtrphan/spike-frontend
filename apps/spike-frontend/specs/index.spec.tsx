import React from 'react';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import Index from '../pages/index';

describe('Index', () => {
  let qClient;

  beforeAll(() => {
    qClient = new QueryClient();
  });

  it('should render successfully', () => {
    const { baseElement } = render(<QueryClientProvider client={qClient}><Index /></QueryClientProvider>);
    expect(baseElement).toBeTruthy();
  });
});
