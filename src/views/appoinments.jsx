// material-ui
import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import MainCard from 'components/MainCard';
import Button from '@mui/material/Button';

export default function DenseTable({ availableSlot, selectedRecordFun, handleNextFun }) {
  const handleNext = (row) => {
    selectedRecordFun(row);
    handleNextFun(true)
  }

  return (
    <MainCard content={false} title="Available Slot" >
      <TableContainer>
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
            {availableSlot?.map((row) => (
              <TableRow hover key={row?.index}>
                <TableCell sx={{ pl: 3 }} component="th" scope="row">
                  {row?.location_description}
                </TableCell>
                <TableCell>{row?.provider_name}</TableCell>
                <TableCell>{row?.date}</TableCell>
                <TableCell>{row?.start}</TableCell>
                <Button onClick={() => handleNext(row)} variant="contained" sx={{ backgroundColor: '#FFDF01', my: 3, ml: 1 }}>
                  {'confirm'}
                </Button>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </MainCard>
  );
}
