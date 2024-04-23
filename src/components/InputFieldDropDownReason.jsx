import React, { useState } from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import MainCard from './MainCard';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';

const CustomSelectReason = ({ name, options, title, onChange }) => {
  const [selectedValue, setSelectedValue] = useState('');

  const handleChange = (event) => {
    const { value } = event.target;
    setSelectedValue(value);
    onChange(value);
  };

  return (
    <div>
      <InputLabel id={`title`}>{title}</InputLabel>
      <FormControl sx={{mt:'1%'}} fullWidth>
        <InputLabel id={`select-${name}-label`}>{name}</InputLabel>
        <Select
          labelId={`select-${name}-label`}
          id={`select-${name}`}
          value={selectedValue}
          onChange={handleChange}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              <Chip key={selected} label={options?.find((option) => option?.value === selected)?.label} />
            </Box>
          )}
        >
          {options?.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default CustomSelectReason;
