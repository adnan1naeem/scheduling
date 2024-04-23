// material-ui
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
// ==============================|| BASIC WIZARD - REVIEW ||============================== //

export default function Review({ patientId, fullName, selectedRecord }) {
  return (
    <>
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        Review Appointment
      </Typography>
      <List disablePadding>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary={"PatientId"} />
          <Typography gutterBottom>{`${patientId || "Mohsin Naeem"},`}</Typography>
        </ListItem>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary={"FullName"} />
          <Typography gutterBottom>{`${fullName || 197520},`}</Typography>
        </ListItem>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary={"Location"} />
          <Typography gutterBottom>{selectedRecord?.location_description}</Typography>
        </ListItem>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary={"Provider"} />
          <Typography gutterBottom>{selectedRecord?.provider_name}</Typography>
        </ListItem>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary={"Date"} />
          <Typography gutterBottom>{selectedRecord?.date}</Typography>
        </ListItem>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary={"Time"} />
          <Typography gutterBottom>{selectedRecord?.start}</Typography>
        </ListItem>
      </List>
    </>
  );
}
