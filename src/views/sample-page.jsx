'use client';
import { useEffect, useState } from 'react';
import React from 'react';
import CustomSelect from 'components/InputFieldDropDown';
import MainCard from 'components/MainCard';
import RadioGroupForms from 'components/RadioButton';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import NextLink from 'next/link';
import axios from 'axios';
import CustomSelectReason from '../components/InputFieldDropDownReason';

const reasonMap = [
  {
    appointment_type_id: '155',
    abbreviation: 'ACT PHY',
    description: 'Physical'
  },
  {
    appointment_type_id: '234',
    abbreviation: 'ACT OV',
    description: 'ILL/Sick/Acute Visit'
  },
  {
    appointment_type_id: '268',
    abbreviation: 'ACTNPOV',
    description: 'Routine/Regular Office Visit'
  },
  {
    appointment_type_id: '280',
    abbreviation: 'ACTWIAWV',
    description: 'Virtual Office Visit'
  },
  {
    appointment_type_id: '285',
    abbreviation: 'ACTPHGYN',
    description: "Women's Health/Pap Smear/GYN Exam"
  }
];

const fetchData = async (url, method, params) => {
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

export default function SamplePage() {
  const [locatonList, setLocationList] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState([]);
  const [providerList, setProviderList] = useState([]);
  const [Reason, setReason] = useState();
  const [selectedReasonData, setSelectedReasonData] = useState([]);
  const [SelectedReason,setSelectedReason]=useState()
  useEffect(() => {
    const fetchDataAndSetState = async () => {
      if (providerList.length > 0) {
        const params = { provider: [selectedProvider] };
        const locationData = await fetchData('location_provider', 'get', params);
        const locationOptions = locationData?.data?.map((location) => ({
          value: location.abbr,
          label: location.desc
        }));
        setLocationList(locationOptions);
        setReason(locationData?.app_typ);
      } else {
        const locationData = await fetchData('getlocation', 'get');
        console.log(locationData?.data, 'providerData');
        const locationOptions = locationData?.data?.map((location) => ({
          value: location.abbr,
          label: location.desc
        }));
        setLocationList(locationOptions);
      }
    };
    fetchDataAndSetState();
  }, []);

  useEffect(() => {
    if (selectedLocation?.length <= 0 && selectedProvider?.length <= 0) {
      setReason(null);
    }
  }, [selectedLocation, selectedProvider]);
  const handleLocationChange = (selectedOption) => {
    setSelectedLocation(selectedOption);
  };

  useEffect(() => {
    const fetchProvidersForLocation = async () => {
      try {
        if (locatonList.length > 0) {
          const params = { location: [selectedLocation] };
          const providerData = await fetchData('provider_location', 'get', params);
          console.log(providerData?.data, 'selected providerData has this is ');
          const ProviderOptions = providerData?.data?.map((provider) => ({
            value: provider?.provider,
            label: provider?.first_name || provider?.last_name ? `${provider?.first_name} ${provider?.last_name}` : provider?.full_name
          }));
          setProviderList(ProviderOptions);
          setReason(providerData?.app_typ);
        } else {
          const providerData = await fetchData('getprovider', 'get');
          console.log(providerData?.data, 'providerData');
          const ProviderOptions = providerData?.data?.map((provider) => ({
            value: provider?.provider,
            label: provider?.first_name || provider?.last_name ? `${provider?.first_name} ${provider?.last_name}` : provider?.full_name
          }));
          setProviderList(ProviderOptions);
          setReason(null);
        }
      } catch (error) {
        console.error('Error fetching provider data:', error);
      }
    };

    fetchProvidersForLocation();
  }, [selectedLocation]);

  const handleProviderChange = (selectedOption) => {
    setSelectedProvider(selectedOption);
  };
  const handleReasonChange = async (selectedOption) => {
    const SelectedValue = reasonMap.find((option) => option.abbreviation === selectedOption);
    try {
      if(selectedLocation?.length<=0 ||selectedProvider?.length<=0){
        const ReasonDataList = await fetchData('get_prov_loc_from_visit', 'get', { visit_type: SelectedValue?.appointment_type_id });
        setSelectedReasonData(ReasonDataList);
        console.log(selectedReasonData);
        const Reason_Location_Data = selectedReasonData?.data?.map((value) => ({
          value: value?.loc_abbr,
          label: value?.loc_desc
        }));
        const Reason_Provider_Data = selectedReasonData?.data?.map((provider) => ({
          value: provider?.pro_abbr,
          label: provider?.pro_fname || provider?.pro_lname
        }));
        setProviderList(Reason_Provider_Data);
        setLocationList(Reason_Location_Data);
      }
      else{
        setSelectedReason(SelectedValue)
      }
    } catch (error) {
      console.error('Error fetching reason data:', error);
    }
  };

  const reasons = reasonMap?.map((reason) => ({
    value: reason?.abbreviation,
    label: reason?.description,
    type_id: reason?.appointment_type_id
  }));
  const ReasonData = Reason?.map((reason) => ({
    value: reason?.abbreviation,
    label: reason?.description,
    type_id: reason?.appointment_type_id
  }));
  const options = ReasonData?.length > 0 ? ReasonData : reasons;

  return (
    <MainCard title="Book Appointment">
      <RadioGroupForms />
      <Grid sx={{ mt: '3%' }}>
        <CustomSelect
          name="Select Location"
          options={locatonList}
          title="Location"
          value={selectedLocation}
          onChange={handleLocationChange}
        />
      </Grid>
      <Grid sx={{ mt: '3%' }}>
        <CustomSelect name="Select Provider" options={providerList} title="Provider" onChange={handleProviderChange} />
      </Grid>
      <Grid sx={{ mt: '3%' }}>
        <CustomSelectReason name="Reason" options={options} onChange={handleReasonChange} title="Reason" />
      </Grid>
      <Grid item xs={12} lg={3} sx={{ mt: '3%' }}>
        <NextLink href="/appoinments" passHref legacyBehavior>
          <Button variant="contained" sx={{ width: { xs: '100%', lg: '30%' } }}>
            Available Slot
          </Button>
        </NextLink>
      </Grid>
      <Grid item xs={12} lg={3} sx={{ mt: '2%' }}>
        <Button variant="contained" sx={{ width: { xs: '100%', lg: '30%' } }}>
          Next Available Slot
        </Button>
      </Grid>
    </MainCard>
  );
}
