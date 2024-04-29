import React, { useEffect, useState } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import MainCard from 'components/MainCard';
import moment from 'moment';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { DateRange } from 'react-date-range';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import './style.scss';

export default function RadioGroupForms({ RangeStartDate, RangeEndDate, setValue, value, setRadioSelected, radioSelected, startDate }) {
  const [selecteDateRange, setSelecteDateRange] = useState(false);
  const today = moment();

  useEffect(() => {
    if (value[0]?.endDate) {
      RangeStartDate(value[0]?.startDate);
      RangeEndDate(value[0]?.endDate);
    }
  }, [value]);

  const handleRadioClick = () => {
    setValue([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection'
      }
    ]);
    setRadioSelected('dateRange');
    setSelecteDateRange(true);
  };

  const handleTodayClick = () => {
    setRadioSelected('today');
    setValue([
      {
        startDate: '',
        endDate: '',
        key: 'selection'
      }
    ]);
    setSelecteDateRange(false);
    startDate(today);
  };

  const handleTomorrowClick = () => {
    setRadioSelected('tomorrow');
    setValue([
      {
        startDate: '',
        endDate: '',
        key: 'selection'
      }
    ]);
    const tomorrow = today.add(1, 'days');
    setSelecteDateRange(false);
    startDate(tomorrow);
  };

  const handleCloseDateRange = () => {
    setSelecteDateRange(false);
  };

  const deepPurple = {
    50: '#41257b',
    100: '#41257b',
    200: '#41257b',
    300: '#41257b',
    400: '#41257b',
    500: '#41257b',
    600: '#41257b',
    700: '#41257b',
    800: '#41257b',
    900: '#41257b',

    A100: '#41257b',
    A200: '#41257b',
    A400: '#41257b',
    A700: '#41257b'
  };

  const { palette } = createTheme();
  const theme = createTheme({
    palette: {
      deepPurple: palette.augmentColor({ color: deepPurple })
    }
  });

  const handleBackdropClick = (event) => {
    event.stopPropagation();
  };

  return (
    <div>
      <MainCard title="Date">
        <RadioGroup row aria-label="color" value={radioSelected}>
          <ThemeProvider theme={theme}>
            <FormControlLabel onClick={() => handleTodayClick()} value="today" control={<Radio color="deepPurple" />} label="Today" />
            <FormControlLabel
              onClick={() => handleTomorrowClick()}
              value="tomorrow"
              control={<Radio color="deepPurple" />}
              label="Tomorrow"
            />
            <FormControlLabel
              value="dateRange"
              control={<Radio color="deepPurple" />}
              label={
                radioSelected === 'dateRange'
                  ? `Date Range: ${moment(value[0]?.startDate)?.format('MM-DD-YYYY')} to ${moment(value[0]?.endDate)?.format('MM-DD-YYYY')}`
                  : 'Date Range'
              }
              onClick={handleRadioClick}
              labelPlacement="end"
            />
          </ThemeProvider>
        </RadioGroup>
      </MainCard>

      <Dialog open={selecteDateRange} onClose={handleCloseDateRange} onClick={handleBackdropClick}>
        <Box sx={{ display: 'flex', flexDirection: 'column', padding: 2 }}>
          <IconButton disabled={value[0]?.startDate === value[0]?.endDate} aria-label="close" onClick={handleCloseDateRange} sx={{ position: 'absolute', top: 1, right: 8, color: 'grey' }}>
            <CloseIcon />
          </IconButton>
          <Box sx={{marginTop:3}}/>
          <DateRange
            onChange={(item) => setValue([item.selection])}
            months={2}
            minDate={moment().toDate()}
            ranges={value}
            direction="horizontal"
            rangeColors={['#41257b', 'transparent', '#41257b']}
          />
          {/* Confirm Button */}
          <Button
            disabled={value[0]?.startDate === value[0]?.endDate}
            variant="contained"
            onClick={handleCloseDateRange}
            sx={{
              mt: 2,
              backgroundColor: '#41257b',
              width: 100,
              '&:hover': {
                backgroundColor: '#41257b'
              }
            }}
          >
            Confirm
          </Button>
        </Box>
      </Dialog>
    </div>
  );
}
