'use client';

import React, { useEffect, useState } from 'react';

// material-ui
import Button from '@mui/material/Button';
import Step from '@mui/material/Step';
import Stepper from '@mui/material/Stepper';
import StepLabel from '@mui/material/StepLabel';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import CircularProgress from '@mui/material/CircularProgress';
import moment from "moment";

// project imports
import AddressForm from './AddressForm';
import Review from './Review';
import MainCard from 'components/MainCard';
import AnimateButton from 'components/@extended/AnimateButton';
import DenseTable from 'views/appoinments';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import axios from 'axios';
// ==============================|| FORMS WIZARD - BASIC ||============================== //

export default function BasicWizard() {
  const [activeStep, setActiveStep] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [locatonList, setLocationList] = useState([]);
  const [providerList, setProviderList] = useState([]);
  const [reason, setReason] = useState(null);
  // step options
  const steps = ['Search Schedule', 'Select Available Slot', 'Confirm Appointment'];

  function getStepContent(step) {
    switch (step) {
      case 0:
        return <AddressForm
          handleNextFun={(next) => handleNext()}
          startDateFun={(data) => setStartDate(data)}
          endDateFun={(data) => setEndDate(data)}
          setLocationListFun={(data) => setLocationList(data)}
          setProviderListFun={(data) => setProviderList(data)}
          setSelectedReasonFun={(data) => setReason(data)}
        />;
      case 1:
        return <DenseTable availableSlot={availableSlot} selectedRecordFun={(data) => setSelectedRecord(data)} handleNextFun={(next) => handleNext()} />;
      case 2:
        return <Review selectedRecord={selectedRecord} />;
      default:
        throw new Error('Unknown step');
    }
  }

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  // console.log(JSON.stringify(selectedRecord, null, 2));
  // const fetchData = async (url, method, params) => {
  //   let config = {
  //     method: method,
  //     maxBodyLength: Infinity,
  //     url: `https://sbapi.epicpc.com/api/${url}`,
  //     headers: {
  //       Authorization:
  //         'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTAuMC4xLjE0Mi9hcGkvbG9naW4iLCJpYXQiOjE2OTIwMDA0MDQsIm5iZiI6MTY5MjAwMDQwNCwianRpIjoicWVoVjFhVTZ5R0c1RHFtOCIsInN1YiI6IjEiLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.FHQT06K6DLf2mtHfD1QV0PLS5YpKNoqoOB725PQJGgA'
  //     },
  //     params: params
  //   };

  //   try {
  //     const response = await axios.request(config);
  //     return response.data;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // const handleConfirmAppointment = async () => {
  //   // const params = {
  //   //   "patientId": patientProfile.patientNumber,
  //   //   "datetime": "$date ${event.time}",
  //   //   "duration": event.duration,
  //   //   "location": event.location,
  //   //   "patient_name":
  //   //     '${patientProfile.firstName} ${patientProfile.lastName}',
  //   //   "practitioner": event.provider,
  //   //   "reason_for_visit":
  //   //     event.visitType.isEmpty ? 'ACT OV' : event.visitType.trim(),
  //   //   "visitType":
  //   //     event.visitType.isEmpty ? 'ACT OV' : event.visitType.trim(),
  //   //   "self_schedule": 1
  //   // };
  //   // const providerData = await fetchData('appointments/save', 'get', params);
  //   handleNext();
  // };

  const [loading, setLoading] = React.useState(false);
  const [availableSlot, setAvailableSlot] = React.useState([]);
  let count = false;
  React.useEffect(() => {
    if (!count) {
      count = true
      getAvailableSlot();
    }
  }, [])

  useEffect(() => {
    if (startDate && endDate) {
      alert('date');
      getAvailableSlot();
    }
    if (locatonList?.length > 0) {
      alert('location');
      getAvailableSlot();
    }
    if (providerList?.length > 0) {
      alert('provider');
      getAvailableSlot();
    }
  }, [startDate, endDate, locatonList, providerList])

  const getAvailableSlot = async () => {
    setLoading(true);
    let params = {};
    if (locatonList?.length > 0) {
      params['location'] = locatonList
    }
    if (providerList?.length > 0) {
      params['provider'] = providerList
    } if (!startDate) {
      params['sdate'] = moment(new Date()).format("MM-DD-YYYY")
      params['edate'] = moment(new Date()).format("MM-DD-YYYY")
    } else {
      params['sdate'] = moment(startDate).format("MM-DD-YYYY")
      params['edate'] = moment(endDate).format("MM-DD-YYYY")
    }
    const providerData = await fetchAvailableSlot('appointments', 'get', params);
    setAvailableSlot([...providerData?.data]);
    setLoading(false);
  }

  const fetchAvailableSlot = async (url, method, params) => {
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

    console.log(JSON.stringify(config, null, 2), "configconfigconfig");

    try {
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const getAppointmentUpdate = () => {
    let allData = false;
    if (startDate != null && endDate != null && (locatonList?.length > 0 && locatonList) && (providerList?.length > 0 && providerList) && reason != null) {
      allData = false
    }
    return allData
  };

  return (
    <MainCard title="Appointment">
      <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <>
        {activeStep === steps.length ? (
          <>
            <Typography variant="h5" gutterBottom>
              Thank you for your Appointment.
            </Typography>
            <Typography variant="subtitle1">
              We have emailed your Appointment confirmation, and will send you an update when your Appointment status has
              been changed.
            </Typography>
            <Stack direction="row" justifyContent="flex-end">
              <AnimateButton>
                <Button variant="contained" color="error" onClick={() => setActiveStep(0)} sx={{ my: 3, ml: 1 }}>
                  Reset
                </Button>
              </AnimateButton>
            </Stack>
          </>
        ) : (
          <>
            {loading ?
              <Box sx={{ padding: 10, display: 'flex', alignItems: 'center', justifyContent: "center" }}>
                <CircularProgress />
              </Box> :
              <>{getStepContent(activeStep)}</>}
            <Stack direction="row" justifyContent={activeStep !== 0 ? 'space-between' : 'flex-end'}>
              {activeStep !== 0 && (
                <Button onClick={handleBack} sx={{ my: 3, ml: 1 }}>
                  Back
                </Button>
              )}
              {activeStep == 0 && <Box spacing={30}
                sx={{ display: 'flex', flexWrap: "wrap" }}
                justifyContent={'center'}
                alignItems={'center'}>
                <Grid item sx={{ mt: '3%' }}>
                  <Button variant="contained" sx={{ backgroundColor: '#2470AC', width: { xs: '100%', lg: '100%' } }}>
                    Next Available Slot
                  </Button>
                </Grid>
                <Box sx={{
                  mr: { xs: 1, sm: 5 },
                }}></Box>
                <Grid item sx={{ mt: '3%' }}>
                  <Button onClick={() => handleNext()} variant="contained" sx={{ backgroundColor: '#0B8588', width: { xs: '100%', lg: '100%' } }}>
                    <span style={{ marginRight: '8px' }}>Available Slot</span>({availableSlot?.length})
                  </Button>
                </Grid>
              </Box>}
              {activeStep == 1 && null}
              {activeStep == 2 &&
                <AnimateButton>
                  <LoadingButton disabled={getAppointmentUpdate()} variant="contained" onClick={handleConfirmAppointment} sx={{ backgroundColor: '#FFDF01', my: 3, ml: 1 }}>
                    Confirm Appointment
                  </LoadingButton>
                </AnimateButton>
              }
            </Stack>
          </>
        )}
      </>
    </MainCard>
  );
}
