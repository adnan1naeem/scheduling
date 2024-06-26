// material-ui
import { useEffect, useState } from 'react';
import React from 'react';
import CustomSelect from 'components/InputFieldDropDown';
import MainCard from 'components/MainCard';
import RadioGroupForms from 'components/RadioButton';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import CustomSelectReason from 'components/InputFieldDropDownReason';
import moment from 'moment';

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
    "appointment_type_id": "182",
    "abbreviation": "2NPOVAWV",
    "description": "New Patient Annual Wellness Visit (Medicare only)"
  },
  {
    "appointment_type_id": "207",
    "abbreviation": "PNPVOV  ",
    "description": "First Time Behavioral Health Patient (video visit)"
  },
  {
    "appointment_type_id": "220",
    "abbreviation": "2OVCWE  ",
    "description": "Yearly Physical/ Sports Physical"
  },
  {
    "appointment_type_id": "228",
    "abbreviation": "2NPOVCWE",
    "description": "New Patient Comprehensive Wellness Exam"
  },
  {
    "appointment_type_id": "234",
    "abbreviation": "ACT OV  ",
    "description": "Routine Follow Up and/or Sick Visit"
  },
  {
    "appointment_type_id": "244",
    "abbreviation": "PSY-VOV ",
    "description": "Follow Up (video visit)"
  },
  {
    "appointment_type_id": "262",
    "abbreviation": "PSY - FU",
    "description": "Follow Up"
  },
  {
    "appointment_type_id": "273",
    "abbreviation": "PSY - NP",
    "description": "First Time Behavioral Health Patient"
  },
  {
    "appointment_type_id": "301",
    "abbreviation": "ACTTOC  ",
    "description": "Transition of Care Visit"
  },
  {
    "appointment_type_id": "304",
    "abbreviation": "2OVAWV  ",
    "description": "Annual Wellness Visit (Medicare Only)"
  },
  {
    "appointment_type_id": "311",
    "abbreviation": "ACTERFU ",
    "description": "ER Follow Up"
  }
];

export default function AddressForm({
  setValue,
  value,
  setRadioSelected,
  radioSelected,
  RangeStartDateFun,
  RangeEndDateFun,
  startDateFun,
  setLocationListFun,
  setProviderListFun,
  setSelectedReasonFun
}) {
  const [locatonList, setLocationList] = useState([]);
  const [reasonMap, setReasonMap] = useState(reasonStaticData);
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState([]);
  const [providerList, setProviderList] = useState([]);
  const [Reason, setReason] = useState();
  const [SelectedReason, setSelectedReason] = useState();

  const fetchLocationDataAndSetState = async (item, selectedOption = null) => {
    if (item?.length > 0) {
      const params = { provider: item };
      const locationData = await fetchData('location_provider', 'get', params);
      const locationOptions = locationData?.data
        ?.filter((location) => location?.desc !== 'BLUE SKY')
        .map((location) => ({
          value: location.abbr,
          label: location.desc
        }));
      if (selectedOption?.length <= 0) {
        setLocationList([...locationOptions]);
      }
      setReason(locationData?.app_typ);
    } else {
      const locationData = await fetchData('getlocation', 'get');
      const locationOptions = locationData?.data
        ?.filter((location) => location?.desc !== 'BLUE SKY')
        .map((location) => ({
          value: location.abbr,
          label: location.desc
        }));
      setLocationList(locationOptions);
    }
  };

  const fetchProvidersForLocation = async (item, selectedOption = null) => {
    if (item?.length > 0) {
      try {
        let params = { location: item };
        const providerData = await fetchData('provider_location', 'get', params);
        const ProviderOptions = providerData?.data?.map((provider) => ({
          value: provider?.provider,
          label: provider?.first_name || provider?.last_name ? `${provider?.first_name} ${provider?.last_name}` : provider?.full_name
        }));
        if (selectedOption?.length <= 0) {
          setProviderList(ProviderOptions);
        }else{
          setProviderList(ProviderOptions);
        }
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
    if (selectedLocation?.length > 0) {
      setLocationListFun(selectedLocation);
    } else {
      setLocationListFun(null);
    }
  }, [selectedLocation]);

  useEffect(() => {
    if (selectedProvider?.length >= 0) {
      setProviderListFun(selectedProvider);
    } else {
      setProviderListFun(null);
    }
  }, [selectedProvider]);

  let count = false;
  useEffect(() => {
    if(!count){
      count = true;
      fetchLocationDataAndSetState([]);
      fetchProvidersForLocation([]);
    }
  }, []);

  useEffect(() => {
    if (selectedLocation?.length <= 0 && selectedProvider?.length <= 0) {
      setReason(null);
    }
  }, [selectedLocation, selectedProvider, SelectedReason]);

  const handleLocationChange = (selectedOption) => {
    if(selectedLocation?.length > 0 || selectedProvider?.length <= 0){
      fetchProvidersForLocation(selectedOption);
    }
    setSelectedLocation(selectedOption);
    if(selectedOption?.length <= 0){
      fetchLocationDataAndSetState(selectedProvider, selectedOption);
    }
  };

  const handleProviderChange = (selectedOption) => {
    setSelectedProvider(selectedOption);
    fetchLocationDataAndSetState(selectedOption, selectedLocation);
    if(selectedOption?.length <= 0){
      fetchProvidersForLocation(selectedOption);
    }
  };

  const handleReasonChange = async (selectedOption) => {
    const SelectedValue = reasonMap.find((option) => option.abbreviation === selectedOption);
    setSelectedReasonFun(SelectedValue);
    if (selectedOption == '') {
      fetchProvidersForLocation(selectedLocation);
      fetchLocationDataAndSetState(selectedProvider);
      return;
    }
    try {
      if (selectedLocation?.length <= 0 && selectedProvider?.length <= 0) {
        await fetchData('get_prov_loc_from_visit', 'get', { visit_type: SelectedValue?.appointment_type_id })
          .then((res) => {
            const Reason_Location_Data = res?.data?.map((value) => ({
              value: value?.loc_abbr,
              label: value?.loc_desc
            }));
            const Reason_Provider_Data = res?.data?.map((provider) => ({
              value: provider?.pro_abbr,
              label: provider?.pro_fname || provider?.pro_lname ? `${provider?.pro_fname} ${provider?.pro_lname}` : provider?.full_name
            }));
            setProviderList([...Reason_Provider_Data]);
            setLocationList([...Reason_Location_Data]);
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        setSelectedReason([...SelectedValue]);
      }
    } catch (error) {
      console.error('Error fetching reason data:', error);
    }
  };

  useEffect(() => {
    if (startDate && endDate && startDate != endDate) {
      RangeStartDateFun(moment(startDate)?.format('MM-DD-YYYY'));
      RangeEndDateFun(moment(endDate)?.format('MM-DD-YYYY'));
    }
  }, [startDate, endDate]);

  useEffect(() => {
    setReasonMap(reasonStaticData);
    setSelectedReasonFun("");
  }, []);

  return (
    <>
      <RadioGroupForms
        setValue={(value) => setValue(value)}
        value={value}
        setRadioSelected={(value) => setRadioSelected(value)}
        radioSelected={radioSelected}
        RangeStartDate={(data) => setStartDate(data)}
        RangeEndDate={(data) => setEndDate(data)}
        startDate={(data) => startDateFun(data)}
      />
      <MainCard sx={{ mt: '3%' }} title="Filters">
        <Grid sx={{ mt: '1%' }}>
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
