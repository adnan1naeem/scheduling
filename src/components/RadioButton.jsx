import React, { useEffect, useState, useRef } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import MainCard from 'components/MainCard';
import { DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRangeCalendar } from '@mui/x-date-pickers-pro/DateRangeCalendar';
import Button from '@mui/material/Button';
import moment from 'moment';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';

export default function RadioGroupForms({ setValue, value, setRadioSelected, radioSelected, startDate, endDate }) {
  const [selecteDateRange, setSelecteDateRange] = useState(false);
  const today = moment();

  useEffect(() => {
    if (value[1]) {
      startDate(value[0]);
      endDate(value[1]);
    }
  }, [value]);

  const handleRadioClick = () => {
    setRadioSelected('dateRange');
    setSelecteDateRange(true);
  };

  const handleTodayClick = () => {
    setRadioSelected('today');
    setValue([null, null]);
    setSelecteDateRange(false);
    startDate(today);
    endDate(today);
  };

  const handleTomorrowClick = () => {
    setRadioSelected('tomorrow');
    setValue([null, null]);
    const tomorrow = today.add(1, 'days');
    setSelecteDateRange(false);
    startDate(tomorrow);
    endDate(tomorrow);
  };

  const handleCloseDateRange = () => {
    setSelecteDateRange(false);
  };

  return (
    <div>
      <MainCard title="Date">
        <RadioGroup row aria-label="color" value={radioSelected}>
          <FormControlLabel onClick={() => handleTodayClick()} value="today" control={<Radio />} label="Today" />
          <FormControlLabel onClick={() => handleTomorrowClick()} value="tomorrow" control={<Radio />} label="Tomorrow" />
          <FormControlLabel
            value="dateRange"
            control={<Radio />}
            label={
              value[0] && value[1] ? (
                <div>{`Date Range: ${value[0].format('MM-DD-YYYY')} to ${value[1].format('MM-DD-YYYY')}`}</div>
              ) : (
                <div>{`Date Range`}</div>
              )
            }
            onClick={handleRadioClick}
            labelPlacement="end"
          />
        </RadioGroup>
      </MainCard>

      <Dialog open={selecteDateRange} onClose={handleCloseDateRange}>
        <Box sx={{ p: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoItem label="Select Range">
              <DateRangeCalendar value={value} onChange={(newValue) => setValue(newValue)} minDate={today} disablePast/>
            </DemoItem>
          </LocalizationProvider>
          <Button disabled={value[0] && value[1] ? false : true} variant="contained" onClick={handleCloseDateRange} sx={{ mt: 2 }}>
            Confirm
          </Button>
        </Box>
      </Dialog>
    </div>
  );
}
