// material-ui
import { useEffect, useState } from 'react';
import React from 'react';
import CustomSelect from 'components/InputFieldDropDown';
import MainCard from 'components/MainCard';
import RadioGroupForms from 'components/RadioButton';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import CustomSelectReason from 'components/InputFieldDropDownReason';
// ==============================|| BASIC WIZARD - ADDRESS ||============================== //

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
let reasonStaticData = [
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

export default function AddressForm({ clearForm, startDateFun, endDateFun, setLocationListFun, setProviderListFun, setSelectedReasonFun }) {
  const [locatonList, setLocationList] = useState([]);
  const [reasonMap, setReasonMap] = useState(reasonStaticData)
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState([]);
  const [providerList, setProviderList] = useState([]);
  const [Reason, setReason] = useState();
  const [selectedReasonData, setSelectedReasonData] = useState([]);
  const [SelectedReason, setSelectedReason] = useState()

  useEffect(() => {
    fetchDataAndSetState();
  }, []);

  const fetchDataAndSetState = async (item) => {
    if (item?.length > 0) {
      const params = { provider: item };
      const locationData = await fetchData('location_provider', 'get', params);
      const locationOptions = locationData?.data
        ?.filter(location => location?.desc !== 'BLUE SKY')
        .map(location => ({
          value: location.abbr,
          label: location.desc
        }));
        if(selectedLocation.length <= 0){
          setLocationList(locationOptions);
        }
      setReason(locationData?.app_typ);
    } else {
      const locationData = await fetchData('getlocation', 'get');
      const locationOptions = locationData?.data
        ?.filter(location => location?.desc !== 'BLUE SKY')
        .map(location => ({
          value: location.abbr,
          label: location.desc
        }));
        if(selectedLocation.length <= 0){
          setLocationList(locationOptions);
        }
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

  useEffect(() => {
    if (selectedLocation?.length <= 0 && selectedProvider?.length <= 0) {
      setReason(null);
    }
  }, [selectedLocation, selectedProvider, SelectedReason]);

  const handleLocationChange = (selectedOption) => {
    setSelectedLocation(selectedOption);
  };

  useEffect(() => {
    if (selectedLocation?.length > 0) {
      setLocationListFun(selectedLocation)
    } else {
      setLocationListFun(null)
    }
  }, [selectedLocation])

  useEffect(() => {
    if (selectedProvider?.length > 0) {
      setProviderListFun(selectedProvider)
    } else {
      setProviderListFun(null)
    }
  }, [selectedProvider])

  useEffect(() => {
    const fetchProvidersForLocation = async () => {
      if (selectedLocation.length > 0) {
        try {
          let params = { location: selectedLocation };
          const providerData = await fetchData('provider_location', 'get', params);
          const ProviderOptions = providerData?.data?.map((provider) => ({
            value: provider?.provider,
            label: provider?.first_name || provider?.last_name ? `${provider?.first_name} ${provider?.last_name}` : provider?.full_name
          }));
          setProviderList(ProviderOptions);
          setReason(providerData?.app_typ);
        } catch (error) {
          console.error('Error fetching provider data:', error);
        }
      } else {
        try {
          const providerData = await fetchData('getprovider', 'get');
          const ProviderOptions = providerData?.data?.map((provider) => ({
            value: provider?.provider,
            label: provider?.first_name || provider?.last_name ? `${provider?.first_name} ${provider?.last_name}` : provider?.full_name
          }));
          setProviderList(ProviderOptions);
          setReason(null);
        } catch (error) {
          console.error('Error fetching provider data:', error);
        }
      }
    };
    if(selectedProvider?.length <= 0){
      fetchProvidersForLocation();
    }
  }, [selectedLocation]);

  const handleProviderChange = (selectedOption) => {
    fetchDataAndSetState(selectedOption);
    setSelectedProvider(selectedOption);
  };

  const handleReasonChange = async (selectedOption) => {
    setSelectedReasonFun(selectedOption);
    const SelectedValue = reasonMap.find((option) => option.abbreviation === selectedOption);
    try {
      if (selectedLocation?.length <= 0 && selectedProvider?.length <= 0) {
        console.log(SelectedValue?.appointment_type_id, 'SelectedValue?.appointment_type_id');
        await fetchData('get_prov_loc_from_visit', 'get', { visit_type: SelectedValue?.appointment_type_id })
          .then((res) => {
            setSelectedReasonData(res);
            const Reason_Location_Data = res?.data?.map((value) => ({
              value: value?.loc_abbr,
              label: value?.loc_desc
            }));
            const Reason_Provider_Data = res?.data?.map((provider) => ({
              value: provider?.pro_abbr,
              label: provider?.pro_fname || provider?.pro_lname
            }));
            console.log(JSON?.stringify(res, null, 2) + 'ReasonDataList');
            console.log(JSON?.stringify(Reason_Provider_Data, null, 2) + 'Reason_Provider_Data');
            setProviderList(Reason_Provider_Data);
            setLocationList(Reason_Location_Data);
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        setSelectedReason(SelectedValue);
      }
    } catch (error) {
      console.error('Error fetching reason data:', error);
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      startDateFun(startDate.format('MM-DD-YYYY'))
      endDateFun(endDate.format('MM-DD-YYYY'))
    }
  }, [startDate, endDate])

  useEffect(() => {
    setReasonMap(reasonStaticData)
  }, [])

  return (
    <>
      <Typography
        onClick={() => window.location.reload()}
        variant="h6"
        sx={{ zIndex: 1, width: "20%", right: 0, paddingTop: '2%', position: 'absolute', color: '#0E98BA', }}>Clear Form</Typography>
      <MainCard title="Book Appointment">
        <RadioGroupForms
          startDate={(data) => setStartDate(data)}
          endDate={(data) => setEndDate(data)}
        />
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
      </MainCard>
    </>

  );
}
