// material-ui
'use client';
import React from 'react';
import MainCard from 'components/MainCard';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Table, TableHead, TableBody, TableRow, TableCell, TableContainer, TableSortLabel } from '@mui/material';
import { useState } from 'react';

export default function DenseTable({
  locatonList,
  providerList,
  nextAvailableSlotData,
  availableSlotData,
  selectedRecordFun,
  handleNextFun
}) {
  const [loading, setLoading] = React.useState(false);
  const [availableSlot, setAvailableSlot] = React.useState([...availableSlotData]);
  const [data, setData] = useState([...availableSlotData]);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  let count = false;
  React.useEffect(() => {
    (async () => {
      if (nextAvailableSlotData && !count) {
        count = true;
        setLoading(true);
        let params = {};
        if (locatonList?.length > 0) {
          params['location'] = locatonList;
        }
        if (providerList?.length > 0) {
          params['provider'] = providerList;
        }
        const providerData = await fetchData('nextAvailableApp', 'get', params);
        setAvailableSlot([...providerData?.data]);
        setData([...providerData?.data]);
        setLoading(false);
      }
    })();
  }, []);

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
    handleNextFun(true);
  };

  const handleSort = (column) => {
    const isAsc = sortBy === column && sortOrder === 'asc';
    setSortBy(column);
    setSortOrder(isAsc ? 'desc' : 'asc');
    const sortedData = [...data].sort((a, b) => {
      if (a[column]?.trim() < b[column]?.trim()) return isAsc ? -1 : 1;
      if (a[column]?.trim() > b[column]?.trim()) return isAsc ? 1 : -1;
      return 0;
    });
    setData([...sortedData]);
    setAvailableSlot([...sortedData]);
  };

  const handleDateSort = (column) => {
    const result = {};
    const isAsc = sortBy === column && sortOrder === 'asc';
    setSortBy(column);
    setSortOrder(isAsc ? 'desc' : 'asc');
    data?.forEach((item) => {
      const date = item.date;
      if (!result[date]) {
        result[date] = [];
      }
      result[date].push(item);
    });
    for (const date in result) {
      result[date]?.reverse();
    }
    const sortedDates = Object.keys(result);
    const combinedData = sortedDates.reduce((acc, date) => {
      return acc.concat(result[date]);
    }, []);

    setData(combinedData);
    setAvailableSlot(combinedData);
  };

  return (
    <MainCard>
      {loading ? (
        <Box sx={{ padding: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress sx={{ color: '#292754' }} />
        </Box>
      ) : (
        <TableContainer sx={{ maxHeight: 540, overflowY: 'auto' }}>
          <Table sx={{ width: '100%' }} size="small">
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'location'}
                    direction={sortBy === 'location' ? sortOrder : 'asc'}
                    onClick={() => handleSort('location')}
                  >
                    Location
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'provider'}
                    direction={sortBy === 'provider' ? sortOrder : 'asc'}
                    onClick={() => handleSort('provider')}
                  >
                    Provider
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'date'}
                    direction={sortBy === 'date' ? sortOrder : 'asc'}
                    onClick={() => handleSort('date')}
                  >
                    Date
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'start'}
                    direction={sortBy === 'start' ? sortOrder : 'asc'}
                    onClick={() => handleDateSort('start')}
                  >
                    Time
                  </TableSortLabel>
                </TableCell>
                <TableCell>Confirm</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {availableSlot?.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.location_description}</TableCell>
                  <TableCell>{row.provider_name}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.start}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleNext(row)}
                      variant="contained"
                      sx={{
                        backgroundColor: '#292754',
                        '&:hover': {
                          backgroundColor: '#292754'
                        },
                        '&:active': {
                          backgroundColor: 'white',
                          '&::after': {
                            opacity: 0.1
                          }
                        }
                      }}
                    >
                      {'confirm'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </MainCard>
  );
}
