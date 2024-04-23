// material-ui
import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import MainCard from 'components/MainCard';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

// table data
function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9)
];

export default function DenseTable({ nextAvailableSlotData, availableSlotData, selectedRecordFun, handleNextFun }) {
  const [loading, setLoading] = React.useState(false);
  const [availableSlot, setAvailableSlot] = React.useState([...availableSlotData]);

  React.useEffect(() => {
    (async () => {
      if (nextAvailableSlotData) {
        setLoading(true);
        const params = {};
        const providerData = await fetchData('nextAvailableApp', 'get', params);
        setAvailableSlot([...providerData?.data]);
        setLoading(false);
      }
    })();
  }, [])

  const fetchData = async (url, method, params) => {
    let config = {
      method: method,
      maxBodyLength: Infinity,
      url: `https://sbapi.epicpc.com/api/${url}`,
      headers: {
        Authorization:
          'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTAuMC4xLjE0Mi9hcGkvbG9naW4iLCJpYXQiOjE2OTIwMDA0MDQsIm5iZiI6MTY5MjAwMDQwNCwianRpIjoicWVoVjFhVTZ5R0c1RHFtOCIsInN1YiI6IjEiLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.FHQT06K6DLf2mtHfD1QV0PLS5YpKNoqoOB725PQJGgA'
      },
      params: params
    };

    try {
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const handleNext = (row) => {
    selectedRecordFun(row);
    handleNextFun(true)
  }

  return (
    <MainCard content={false} title="Available Slot" >
      {loading ?
        <Box sx={{ padding: 10, display: 'flex', alignItems: 'center', justifyContent: "center" }}>
          <CircularProgress sx={{ color: '#292754' }} />
        </Box> :
        <TableContainer sx={{ maxHeight: 500, overflowY: 'auto' }}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ pl: 3 }}>Location</TableCell>
                <TableCell sx={{ pl: 3 }}>Provider</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Check</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {availableSlot?.map((row, index) => (
                <TableRow hover key={index}>
                  <TableCell sx={{ pl: 3 }} component="th" scope="row">
                    {row?.location_description}
                  </TableCell>
                  <TableCell>{row?.provider_name}</TableCell>
                  <TableCell>{row?.date}</TableCell>
                  <TableCell>{row?.start}</TableCell>
                  <Button onClick={() => handleNext(row)} variant="contained" sx={{
                    backgroundColor: '#292754', my: 3, ml: 1, mr: 1,
                    '&:hover': {
                      backgroundColor: '#292754'
                    },
                    '&:active': {
                      backgroundColor: 'white',
                      '&::after': {
                        opacity: 0.1
                      }
                    }
                  }}>
                    {'confirm'}
                  </Button>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      }
    </MainCard>
  );
}
