import React, { useState } from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const CustomSelect = ({ name, options, title, onChange }) => {
  const [selectedValues, setSelectedValues] = useState([]);
  const [open, setOpen] = React.useState(false);

  const handleChange = (event) => {
    setOpen(false);
    const {
      target: { value },
    } = event;
    setSelectedValues(
      typeof value === 'string' ? value.split(',') : value,
    );
    onChange(value);
  };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 300,
      },
    },
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
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
      deepPurple: palette.augmentColor({ color: deepPurple  })
    }
  });

  return (
    <div>
      <InputLabel id={`title`}>{title}</InputLabel>
      <FormControl sx={{mt:'1%'}} fullWidth>
        <InputLabel id={`select-${name}-label`}>{name}</InputLabel>
        <Select
          labelId={`select-${name}-label`}
          id={`select-${name}`}
          multiple
          value={selectedValues}
          onChange={handleChange}
          open={open}
          onClose={handleClose}
          onOpen={handleOpen}
          input={<OutlinedInput label="Tag" />}
          renderValue={(selected) => selected?.map((value) => options?.find((option) => option?.value === value)?.label).join(', ')}
          MenuProps={MenuProps}
        >
          {(options === undefined || options?.length <= 0) ? <Box sx={{ ml: 2 }}><ListItemText primary={"No record found!"} /></Box> : null}
          {options?.map((name) => (
           
            <MenuItem key={name} value={name?.value}>
            <ThemeProvider theme={theme}>
              <Checkbox color="deepPurple"  checked={selectedValues.indexOf(name?.value) > -1} />
              <ListItemText primary={name?.label} />
              </ThemeProvider>
            </MenuItem>
           
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default CustomSelect;
