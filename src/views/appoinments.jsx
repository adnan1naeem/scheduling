// material-ui
"use client"
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

export default function DenseTable({ locatonList, providerList, nextAvailableSlotData, availableSlotData, selectedRecordFun, handleNextFun }) {
  const [loading, setLoading] = React.useState(false);
  const [availableSlot, setAvailableSlot] = React.useState([...availableSlotData]);

  React.useEffect(() => {
    (async () => {
      if (nextAvailableSlotData) {
        setLoading(true);
        let params = {};
        if (locatonList?.length > 0) {
          params['location'] = locatonList
        }
        if (providerList?.length > 0) {
          params['provider'] = providerList
        }
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
