import React, { useState } from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import MainCard from './MainCard';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';

const CustomSelect = ({ name, options, title, onChange }) => {
  const [selectedValues, setSelectedValues] = useState([]);

  const handleChange = (event) => {
    const { value } = event.target;
    setSelectedValues(value);
    onChange(value);
  };

  return (
    <MainCard title={title}>
      <FormControl fullWidth>
        <InputLabel id={`select-${name}-label`}>{name}</InputLabel>
        <Select
          labelId={`select-${name}-label`}
          id={`select-${name}`}
          multiple
          value={selectedValues}
          onChange={handleChange}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected?.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
        >
          {options?.map((option) => (
            <MenuItem key={option?.value} value={option?.value}>
              {option?.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </MainCard>
  );
};

export default CustomSelect;
