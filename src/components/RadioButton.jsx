import React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import MainCard from 'components/MainCard';

export default function RadioGroupForms() {
  return (
    <div>
      <MainCard title="Date">
        <RadioGroup row aria-label="color">
          <FormControlLabel value="today" control={<Radio />} label="Today" />
          <FormControlLabel value="tomorrow" control={<Radio />} label="Tomorrow" />
          <FormControlLabel
            value="dateRange"
            control={<Radio />}
            label={
              <div>
                &nbsp;&nbsp; Date Range <br /> 04-16-2024 to 04-16-2024
              </div>
            }
            labelPlacement="end"
          />
        </RadioGroup>
      </MainCard>
    </div>
  );
}
