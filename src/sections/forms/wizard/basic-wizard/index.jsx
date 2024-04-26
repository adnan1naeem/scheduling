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
import moment from 'moment';
import { useSearchParams } from 'next/navigation';
import Image from 'next/legacy/image';
import logoImage from '/public/assets/images/contact/image.png';

// project imports
import AddressForm from './AddressForm';
import Review from './Review';
import AnimateButton from 'components/@extended/AnimateButton';
import DenseTable from 'views/appoinments';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import axios from 'axios';
import FullScreenLoading from './FullScreenLoading';
// ==============================|| FORMS WIZARD - BASIC ||============================== //

export default function BasicWizard() {
  const [activeStep, setActiveStep] = useState(0);
  const [bookAppintment, setBookAppintment] = useState(false);
  const [radioSelected, setRadioSelected] = useState('today');
  const [value, setValue] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);
  const [loading, setLoading] = React.useState(false);
  const [availableSlot, setAvailableSlot] = React.useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [nextAvailableSlotData, setNextAvailableSlotData] = useState(false);
  const [rangeSelected, setRangeSelected] = useState(false);
  const [rangeStartDate, setRangeStartDate] = useState(null);
  const [rangeEndDate, setRangeEndDate] = useState(null);
  const [locatonList, setLocationList] = useState([]);
  const [providerList, setProviderList] = useState([]);
  const [reason, setReason] = useState(null);
  const searchParams = useSearchParams();
  const [fullNameParam, setFullNameParam] = useState(null);
  const [patientIdParam, setPatientIdParam] = useState(null);

  useEffect(() => {
    const fullName = searchParams.get('fullName');
    const patientId = searchParams.get('patientId');
    setFullNameParam(fullName);
    setPatientIdParam(patientId);
  }, []);

  // step options
  const steps = ['Search Schedule', 'Select Available Slot', 'Confirm Appointment'];

  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <AddressForm
            setValue={(value) => setValue(value)}
            value={value}
            setRadioSelected={(value) => setRadioSelected(value)}
            radioSelected={radioSelected}
            rangeSelected={rangeSelected}
            setRangeSelected={(next) => setRangeSelected(next)}
            clearForm={(next) => clearFormRecord()}
            RangeStartDateFun={(data) => setRangeStartDate(data)}
            RangeEndDateFun={(data) => setRangeEndDate(data)}
            startDateFun={(data) => getAvailableSlot(data)}
            setLocationListFun={(data) => setLocationList(data)}
            setProviderListFun={(data) => setProviderList(data)}
            setSelectedReasonFun={(data) => setReason(data)}
          />
        );
      case 1:
        return (
          <DenseTable
            locatonList={locatonList}
            providerList={providerList}
            nextAvailableSlotData={nextAvailableSlotData}
            availableSlotData={availableSlot}
            selectedRecordFun={(data) => setSelectedRecord(data)}
            handleNextFun={(next) => handleNext()}
          />
        );
      case 2:
        return <Review fullName={fullNameParam} selectedRecord={selectedRecord} />;
      default:
        throw new Error('Unknown step');
    }
  }

  const clearFormRecord = () => {
    setLocationList([]);
    setProviderList([]);
    setReason([]);
  };

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleNextAvailableSlot = async () => {
    setNextAvailableSlotData(true);
    handleNext();
  };

  const handleConfirmAppointment = async () => {
    setBookAppintment(true);
    const params = {
      patientId: patientIdParam || 197520,
      datetime: `${moment(selectedRecord?.date)?.format('MM/DD/YYYY')} ${selectedRecord?.start}`,
      duration: selectedRecord?.duration,
      location: selectedRecord?.location?.trim(),
      patient_name: fullNameParam || 'Mohsin Naeem',
      practitioner: selectedRecord?.provider?.trim(),
      reason_for_visit: !reason ? 'ACT OV' : reason?.trim(),
      visitType: !reason ? 'ACT OV' : reason,
      self_schedule: 1
    };

    bookAppiontmentFun('appointments/save', 'POST', params);
  };

  let count = false;
  React.useEffect(() => {
    if (!count) {
      count = true;
      getAvailableSlot();
    }
  }, []);

  useEffect(() => {
    if (rangeStartDate && rangeEndDate && rangeStartDate != rangeEndDate) {
      getAvailableSlot();
    } else if (locatonList?.length > 0 || locatonList == null) {
      getAvailableSlot();
    } else if (providerList?.length > 0 || providerList == null) {
      getAvailableSlot();
    } else if (reason?.length > 0 || reason == null) {
      getAvailableSlot();
    }
  }, [rangeStartDate, rangeEndDate, locatonList, providerList, reason]);

  const getAvailableSlot = async (startDate = null) => {
    setLoading(true);
    let params = {};
    if (locatonList?.length > 0) {
      params['location'] = locatonList;
    }
    if (providerList?.length > 0) {
      params['provider'] = providerList;
    }
    if (startDate) {
      params['sdate'] = moment(startDate).format('MM-DD-YYYY');
      params['edate'] = moment(startDate).format('MM-DD-YYYY');
    } else if (!rangeStartDate) {
      params['sdate'] = moment(new Date()).format('MM-DD-YYYY');
      params['edate'] = moment(new Date()).format('MM-DD-YYYY');
    } else {
      params['sdate'] = moment(rangeStartDate).format('MM-DD-YYYY');
      params['edate'] = moment(rangeEndDate).format('MM-DD-YYYY');
    }
    const providerData = await fetchApiData('appointments', 'get', params);
    setAvailableSlot([...providerData?.data]);
    setLoading(false);
  };

  const bookAppiontmentFun = async (url, method, params) => {
    try {
      await axios
        .post('https://eh-axios-server.vercel.app/fetch-data', {
          url: `https://hero.epicpc.com/api/${url}`,
          type: method,
          requestData: params
        })
        .then((res) => {
          setBookAppintment(false);
          if (res?.data?.responseData?.success) {
            handleNext();
          } else {
            // alert("Try agian later!")
          }
        })
        .catch((err) => {
          console.log(JSON.stringify(err, null, 2), 'error');
          console.log(JSON.stringify(err?.response, null, 2), 'error message');
          setBookAppintment(false);
        });
    } catch (error) {
      setBookAppintment(false);
      throw error;
    }
  };

  const fetchApiData = async (url, method, params) => {
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
    if (
      rangeStartDate != null &&
      rangeEndDate != null &&
      locatonList?.length > 0 &&
      locatonList &&
      providerList?.length > 0 &&
      providerList &&
      reason != null
    ) {
      allData = false;
    }
    return allData;
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          position: 'absolute',
          zIndex: 1,
          left: 0,
          marginBottom: '3%',
          '@media screen and (min-width: 30px) and (max-width: 1023px)': {
            position: 'relative'
          }
        }}
      >
        <Image src={logoImage} width={150} height={80} />
      </Box>

      <Box borderRadius={3} sx={{ backgroundColor: 'white', padding: 1 }}>
        {loading && <FullScreenLoading />}
        <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
          {steps?.map((label) => (
            <Step key={label}>
              <StepLabel
                StepIconProps={{
                  sx: {
                    '&.Mui-active': {
                      color: '#292754'
                    },
                    '&.Mui-completed': {
                      color: '#292754'
                    }
                  }
                }}
              >
                {label}
              </StepLabel>
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
                Your Appointment is confirmed, we will send you an update when your Appointment status has been changed.
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
              {getStepContent(activeStep)}
              <Stack direction="row" justifyContent={activeStep !== 0 ? 'space-between' : 'start'}>
                {activeStep !== 0 && (
                  <Button onClick={handleBack} sx={{ my: 3, ml: 1, color: '#292754' }}>
                    Back
                  </Button>
                )}
                {activeStep == 0 && (
                  <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                    <Button
                      onClick={() => window.location.reload()}
                      variant="contained"
                      sx={{
                        height: 40,
                        width: 120,
                        backgroundColor: '#292754',
                        my: '1.5%',
                        mr: 5,
                        '&:hover': {
                          backgroundColor: '#292754'
                        },
                        '&:active': {
                          backgroundColor: 'white',
                          '&::after': {
                            opacity: 0.1
                          }
                        }
                      }}
                    >
                      {'Clear Form'}
                    </Button>
                    <Box
                      spacing={30}
                      sx={{ display: 'flex', flexWrap: 'wrap', paddingBottom: 1 }}
                      justifyContent={'center'}
                      alignItems={'center'}
                    >
                      <Grid item sx={{ mt: '3%' }}>
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: '#2470AC',
                            width: { xs: '100%', lg: '100%' },
                            '&:hover': {
                              backgroundColor: '#2470AC'
                            },
                            '&:active': {
                              backgroundColor: 'white',
                              '&::after': {
                                opacity: 0.1
                              }
                            }
                          }}
                          onClick={handleNextAvailableSlot}
                        >
                          Next Available Slots
                        </Button>
                      </Grid>
                      <Box
                        sx={{
                          mr: { xs: 1, sm: 5 }
                        }}
                      ></Box>
                      <Grid item sx={{ mt: '3%' }}>
                        <Button
                          onClick={() => {
                            setNextAvailableSlotData(false);
                            handleNext();
                          }}
                          variant="contained"
                          sx={{
                            backgroundColor: '#0B8588',
                            width: { xs: '100%', lg: '100%' },
                            '&:hover': {
                              backgroundColor: '#0B8588'
                            },
                            '&:active': {
                              backgroundColor: 'white',
                              '&::after': {
                                opacity: 0.1
                              }
                            }
                          }}
                        >
                          <span style={{ marginRight: '8px' }}>Available Slots</span>({availableSlot?.length})
                        </Button>
                      </Grid>
                    </Box>
                  </Box>
                )}
                {activeStep == 1 && null}
                {activeStep == 2 && (
                  <AnimateButton>
                    <LoadingButton
                      disabled={getAppointmentUpdate()}
                      variant="contained"
                      onClick={handleConfirmAppointment}
                      sx={{
                        backgroundColor: '#0B8588',
                        my: 3,
                        ml: 1,
                        '&:hover': {
                          backgroundColor: '#0B8588'
                        },
                        '&:active': {
                          backgroundColor: 'white',
                          '&::after': {
                            opacity: 0.1
                          }
                        }
                      }}
                      loading={bookAppintment}
                    >
                      Confirm Appointment
                    </LoadingButton>
                  </AnimateButton>
                )}
              </Stack>
            </>
          )}
        </>
      </Box>
    </>
  );
}
