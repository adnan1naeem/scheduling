// material-ui
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
// ==============================|| BASIC WIZARD - REVIEW ||============================== //

export default function Review({ reason, fullName, selectedRecord }) {
  return (
    <>
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        Review Appointment
      </Typography>
      <List disablePadding>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary={'Full Name'} />
          <Typography gutterBottom>{`${fullName || 'Mohsin Naeem'}`}</Typography>
        </ListItem>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary={'Location'} />
          <Typography gutterBottom>{selectedRecord?.location_description}</Typography>
        </ListItem>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary={'Provider'} />
          <Typography gutterBottom>{selectedRecord?.provider_name}</Typography>
        </ListItem>
        {reason &&
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary={'Reason'} />
          <Typography gutterBottom>{reason?.description}</Typography>
        </ListItem>}
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary={'Date'} />
          <Typography gutterBottom>{selectedRecord?.date}</Typography>
        </ListItem>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary={'Time'} />
          <Typography gutterBottom>{selectedRecord?.start}</Typography>
        </ListItem>
      </List>
    </>
  );
}
