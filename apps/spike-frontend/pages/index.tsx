import React from 'react';
import styled from '@emotion/styled';
import {
  useQuery,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { request, gql } from 'graphql-request';
import { DataGrid, ColDef, ValueFormatterParams } from '@material-ui/data-grid';
import Button from '@material-ui/core/Button';

const endpoint = 'https://one-as-spikebe-d01.azurewebsites.net/graphql';

const StyledPage = styled.div`
  .page {
  }
`;

function useHumans() {
  return useQuery('humans', async () => {
    const {
      humans,
    } = await request(
      endpoint,
      gql`
        query {
          humans {
            name
            appearsIn
            id
            homePlanet
            friends {
              name
            }
          }
        }
      `
      );
    return humans;
  });
  // return {
  //   status: 'success',
  //   data: [
  //     {
  //       name: 'Luke',
  //       appearsIn: ['NEWHOPE', 'EMPIRE', 'JEDI'],
  //       id: '1',
  //       homePlanet: 'Tatooine',
  //       friends: [
  //         {
  //           name: 'R2-D2',
  //         },
  //         {
  //           name: 'C-3PO',
  //         },
  //       ],
  //     },
  //     {
  //       name: 'Vader',
  //       appearsIn: ['NEWHOPE', 'EMPIRE', 'JEDI'],
  //       id: '2',
  //       homePlanet: 'Tatooine',
  //       friends: [],
  //     },
  //   ],
  //   error: null,
  //   isFetching: false
  // };
}

const Humans = () => {
  const queryClient = useQueryClient();
  const { status, data, error, isFetching } = useHumans();
  const columns: ColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 130 },
    {
      field: 'appearsIn', headerName: 'Appears in', width: 200, valueFormatter: (params: ValueFormatterParams) => {
        return (params.value as string[]).join(', ');
    } },
    {
      field: 'homePlanet',
      headerName: 'Home planet',
      width: 200,
    },
    {
      field: 'friends',
      headerName: 'Friends',
      description: 'Friends of this character',
      sortable: false,
      width: 160,
      valueFormatter: (params: ValueFormatterParams) => {
        const vals = (params.value as any[]).map(friend => friend.name);
        return vals.join(', ');
      }
    },
  ];

  return (
    <div>
      <h1>Humans</h1>
      <div>
        {status === 'loading' ? (
          'Loading...'
        ) : status === 'error' ? (
          <span>Error: {(error as Error).message}</span>
        ) : (
          <>
            <div style={{ height: 400, width: '100%' }}>
              <Button variant="contained" color="secondary">
                New human
              </Button>
              <DataGrid
                rows={data}
                columns={columns}
                pageSize={5}
                checkboxSelection
              />
            </div>
            <div>{isFetching ? 'Background data refreshing...' : ' '}</div>
          </>
        )}
      </div>
    </div>
  );
};

export function Index() {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.@emotion/styled file.
   */
  return (
    <StyledPage>
      <Humans />
    </StyledPage>
  );
}

export default Index;
