import React, { useEffect, useState } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import MainCard from 'components/MainCard';
import dayjs from 'dayjs';
import { DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRangeCalendar } from '@mui/x-date-pickers-pro/DateRangeCalendar';
import Button from '@mui/material/Button';
import moment from 'moment';

export default function RadioGroupForms({ startDate, endDate }) {
  const [selecteDateRange, setSelecteDateRange] = useState(false);
  const [value, setValue] = useState([
    null,
    null,
  ]);
  const today = moment();

  useEffect(() => {
    if (value[1]) {
      startDate(value[0])
      endDate(value[1])
    }
  }, [value])

  const handleRadioClick = () => {
    setSelecteDateRange(true)
  };

  const handleTodayClick = () => {
    setValue([null, null]);
    setSelecteDateRange(false)
    startDate(today)
    endDate(today)
  };

  const handleTomorrowClick = () => {
    setValue([null, null]);
    const tomorrow = today.add(1, 'days');
    setSelecteDateRange(false)
    startDate(tomorrow)
    endDate(tomorrow)
  };

  return (
    <div>
      <MainCard title="Date">
        <RadioGroup row aria-label="color">
          <FormControlLabel onClick={() => handleTodayClick()} value="today" control={<Radio />} label="Today" />
          <FormControlLabel onClick={() => handleTomorrowClick()} value="tomorrow" control={<Radio />} label="Tomorrow" />
          <FormControlLabel
            value="dateRange"
            control={<Radio />}
            label={
              value[0] && value[1] ?
                <div>
                  {`Date Range: ${value[0].format("MM-DD-YYYY")} to ${value[1].format("MM-DD-YYYY")}`}
                </div> :
                <div>
                  {`Date Range`}
                </div>
            }
            onClick={handleRadioClick}
            labelPlacement="end"
          />
        </RadioGroup>
      </MainCard>

      {selecteDateRange &&
        <>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoItem label="Select Range">
              <DateRangeCalendar
                value={value}
                onChange={(newValue) => setValue(newValue)}
              />
            </DemoItem>
          </LocalizationProvider>
          <Button disabled={value[0] && value[1] ? false : true} variant="contained" onClick={() => setSelecteDateRange(false)} sx={{ my: 3, ml: 1 }}>
            {'confirm'}
          </Button>
        </>
      }

    </div>
  );
}
