'use client';
import React from 'react';
import Grid from '@mui/material/Grid';
import BasicWizard from 'sections/forms/wizard/basic-wizard';

export default function SamplePage() {
  return (
    <Grid sx={{mt: -"5%"}} container spacing={2.5} justifyContent="center">
      <Grid item xs={12} md={6} lg={7}>
        <BasicWizard />
      </Grid>
    </Grid>
  )
}
