/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import styled from '@emotion/styled';
import {
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query';
import { request, gql } from 'graphql-request';
import { DataGrid, ColDef, ValueFormatterParams } from '@material-ui/data-grid';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';

const endpoint = 'https://one-as-spikebe-d01.azurewebsites.net/graphql';

const mockHumans = [
  {
    name: 'Luke',
    appearsIn: ['NEWHOPE', 'EMPIRE', 'JEDI'],
    id: '1',
    homePlanet: 'Tatooine',
    friends: [
      {
        id: '3',
        name: 'R2-D2',
      },
      {
        id: '4',
        name: 'C-3PO',
      },
    ],
  },
  {
    name: 'Vader',
    appearsIn: ['NEWHOPE', 'EMPIRE', 'JEDI'],
    id: '2',
    homePlanet: 'Tatooine',
    friends: [],
  },
];

const mockDroids = [
  {
    name: 'R2-D2',
    appearsIn: ['NEWHOPE', 'EMPIRE', 'JEDI'],
    id: '3',
    primaryFunction: 'Astromech',
    friends: [
      {
        name: 'Luke',
        id: '1',
      },
      {
        name: 'C-3PO',
        id: '4',
      },
    ],
  },
  {
    name: 'C-3PO',
    appearsIn: ['NEWHOPE', 'EMPIRE', 'JEDI'],
    id: '4',
    primaryFunction: 'Protocol',
    friends: [
      {
        name: 'Luke',
        id: '1',
      },
      {
        name: 'R2-D2',
        id: '3',
      },
    ],
  },
];

const StyledPage = styled.div`
  .page {
  }
`;

const StyledList = styled.ul`
  display: inline-block;
  li {
    display: inline-block;
    margin: 2px;
    zoom: 1;
  }
  li a {
    padding: 2px;
  }
`;

function useHumans() {
  // return useQuery('humans', async () => {
  //   const {
  //     humans,
  //   } = await request(
  //     endpoint,
  //     gql`
  //       query {
  //         humans {
  //           name
  //           appearsIn
  //           id
  //           homePlanet
  //           friends {
  //             name
  //           }
  //         }
  //       }
  //     `
  //     );
  //   return humans;
  // });
  return {
    status: 'success',
    data: mockHumans,
    error: null,
    isFetching: false,
  };
}

function useDroid(droidId: string) {
  // return useQuery(
  //   ['droid', droidId],
  //   async () => {
  //     const { droid } = await request(
  //       endpoint,
  //       gql`
  //       query {
  //         droid(id: ${droidId}) {
  //           id
  //           name
  //           primaryFunction
  //           friends {
  //             name
  //           }
  //           appearsIn
  //         }
  //       }
  //       `
  //     );

  //     return droid;
  //   },
  //   {
  //     enabled: !!droidId,
  //   }
  // );
  return {
    status: 'success',
    data: mockDroids.find(droid => droid.id === droidId),
    error: null,
    isFetching: false,
  };
}

function useHuman(humanId: string) {
  return useQuery(
    ['human', humanId],
    async () => {
      const { human } = await request(
        endpoint,
        gql`
        query {
          human(id: ${humanId}) {
            id
            name
            homePlanet
            friends {
              id
              name
            }
            appearsIn
          }
        }
        `
      );

      return human;
    },
    {
      enabled: !!humanId,
    }
  );
}

const useCreateHuman = () => {
  const queryClient = useQueryClient();
  const createHuman = (formData) => {
    return request(
      endpoint,
      gql`
        mutation {
          createHuman(human: formData) {
            id
            name
            homePlanet
            friends {
              id
              name
            }
            appearsIn
          }
        }
        `
    )
  };

  return useMutation(createHuman, {
    // Notice the second argument is the variables object that the `mutate` function receives
    onSuccess: (data, variables) => {
      queryClient.setQueryData(['humans', { id: variables.id }], data);
    },
  });
};

const AddHumanDialog = ({ open, handleClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [homePlanet, setHomePlanet] = useState('');

  const close = () => {
    setName('');
    setHomePlanet('');
    handleClose();
  }

  const submit = () => {
    if (!name) {
      return;
    }
    onSubmit({ name, homePlanet });
    close();
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Create Human</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To create a new human, supply their name and optionally their home
          planet...
        </DialogContentText>
        <TextField autoFocus error={!name} helperText={!name && 'Name is required'} value={name} onChange={(e) => setName(e.target.value)} margin="dense" id="name" label="Name" fullWidth />
        <TextField autoFocus value={homePlanet} onChange={(e) => setHomePlanet(e.target.value)} margin="dense" id="home-planet" label="Home planet" fullWidth />
      </DialogContent>
      <DialogActions>
        <Button onClick={close} color="secondary">
          Too dangerous. Abort!
        </Button>
        <Button onClick={submit} color="primary" disabled={!name}>
          Let's do it
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const Humans = ({ setDroidId }) => {
  const queryClient = useQueryClient();
  const { status, data, error, isFetching } = useHumans();
  const [openDialog, setOpenDialog] = useState(false);
  const handleClose = () => setOpenDialog(false);
  const mutation = useCreateHuman();
  const onSubmit = (data) => {
    console.log('MUTATING', data);
    mutation.mutate(data);
  };
  const columns: ColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 130 },
    {
      field: 'appearsIn',
      headerName: 'Appears in',
      width: 200,
      valueFormatter: (params: ValueFormatterParams) => {
        return (params.value as string[]).join(', ');
      },
    },
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
      align: 'left',
      width: 200,
      renderCell: (params: ValueFormatterParams) => (
        <StyledList>
          {(params.value as any[]).map((friend) => (
            <li key={friend.name}>
              <a
                onClick={() => setDroidId(friend.id)}
                href="#"
                key={friend.name}
              >
                {friend.name}
              </a>
            </li>
          ))}
        </StyledList>
      ),
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
              <Button variant="contained" color="secondary" onClick={() => setOpenDialog(true)}>
                New human
              </Button>
              <DataGrid rows={data} columns={columns} pageSize={5} />
            </div>
            <div>{isFetching ? 'Background data refreshing...' : ' '}</div>
            <AddHumanDialog open={openDialog} handleClose={handleClose} onSubmit={onSubmit} />
          </>
        )}
      </div>
    </div>
  );
};

const Droid = ({ droidId, setDroidId }) => {
  const queryClient = useQueryClient();
  const { status, data, error, isFetching } = useDroid(droidId);
  const columns: ColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 130 },
    {
      field: 'appearsIn',
      headerName: 'Appears in',
      width: 200,
      valueFormatter: (params: ValueFormatterParams) => {
        return (params.value as string[]).join(', ');
      },
    },
    {
      field: 'primaryFunction',
      headerName: 'Primary func.',
      width: 200,
    },
    {
      field: 'friends',
      headerName: 'Friends',
      description: 'Friends of this droid',
      sortable: false,
      width: 160,
      valueFormatter: (params: ValueFormatterParams) =>
        (params.value as any[]).map((friend) => friend.name).join(', ')
    },
  ];

  return (
    <div>
      <h1>Droid: {data.name}</h1>
      <div>
        {status === 'loading' ? (
          'Loading...'
        ) : status === 'error' ? (
          <span>Error: {(error as Error).message}</span>
        ) : (
          <>
            <div style={{ height: 400, width: '100%' }}>
              <Button onClick={() => setDroidId(-1)}>Back</Button>
              <DataGrid rows={[data]} columns={columns} pageSize={5} />
            </div>
            <div>{isFetching ? 'Background data refreshing...' : ' '}</div>
          </>
        )}
      </div>
    </div>
  );
};

const Human = ({ humanId, setHumanId }) => {
  const queryClient = useQueryClient();
  const { status, data, error, isFetching } = useHuman(humanId);
  const columns: ColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 130 },
    {
      field: 'appearsIn',
      headerName: 'Appears in',
      width: 200,
      valueFormatter: (params: ValueFormatterParams) => {
        return (params.value as string[]).join(', ');
      },
    },
    {
      field: 'homePlanet',
      headerName: 'Home planet',
      width: 200,
    },
    {
      field: 'friends',
      headerName: 'Friends',
      description: 'Friends of this human',
      sortable: false,
      width: 160,
      valueFormatter: (params: ValueFormatterParams) => (
        <ul>
          {(params.value as any[]).map((friend) => (
            <li key={friend.id}>
                {friend.name}
            </li>
          ))}
        </ul>
      ),
    },
  ];

  return (
    <div>
      <h1>Human</h1>
      <div>
        {status === 'loading' ? (
          'Loading...'
        ) : status === 'error' ? (
          <span>Error: {(error as Error).message}</span>
        ) : (
          <>
            <div style={{ height: 400, width: '100%' }}>
              <Button onClick={() => setHumanId(-1)}>Back</Button>
              <DataGrid rows={[data]} columns={columns} pageSize={5} />
            </div>
            <div>{isFetching ? 'Background data refreshing...' : ' '}</div>
          </>
        )}
      </div>
    </div>
  );
};

export function Index() {
  const [droidId, setDroidId] = React.useState(-1);
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.@emotion/styled file.
   */

  return (
    <StyledPage>
      {droidId > -1 ? (
        <Droid droidId={droidId} setDroidId={setDroidId} />
      ) : (
        <Humans setDroidId={setDroidId}/>
      )}
    </StyledPage>
  );
}

export default Index;
