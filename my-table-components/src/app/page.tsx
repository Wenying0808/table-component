import Navbar from "@/app/components/navbar/navbar";
import { Container, Typography, Paper, List, ListItem, ListItemText, Grid2, ListItemIcon } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import { colors } from '@/app/styles/colors';

const PaperStyle = {
  p: 3,
  height: '100%',
  borderRadius: '16px',
  backgroundColor: colors.thunder,
  color: colors.white
}

const CircleIconStyle = {
  fontSize: 8,
  color: colors.white
}

export default function Home() {
  return (
    <div className="table-page">
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Table Components Intro
        </Typography>
        <Typography variant="body1" component="h1" align="center" gutterBottom>
          Reusable React Table Components Built By MUI and Tanstack Table
        </Typography>
        
        <Grid2 container spacing={4} sx={{ mt: 10 , ml: 5, mr: 5}}>
          <Grid2 size="grow">
            <Paper sx={PaperStyle}>
              <Typography variant="h5" gutterBottom>
                Basic Data Display
              </Typography>
              <Typography variant="body1" gutterBottom>
                A simple table component that displays data in a clean, organized format. Features include:
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CircleIcon sx={CircleIconStyle} />
                  </ListItemIcon>
                  <ListItemText primary="Fetch Data from database by API" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CircleIcon sx={CircleIconStyle} />
                  </ListItemIcon>
                  <ListItemText primary="Create, Read, Update, Delete table data by API" />
                </ListItem>
              </List>
            </Paper>
          </Grid2>

          <Grid2 size="grow">
            <Paper sx={PaperStyle}>
              <Typography variant="h5" gutterBottom>
                Table Interactions
              </Typography>
              <Typography variant="body1" gutterBottom>
                An enhanced table with additional functionality:
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CircleIcon sx={CircleIconStyle} />
                  </ListItemIcon>
                  <ListItemText primary="Expand/collapse nestedrows" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CircleIcon sx={CircleIconStyle} />
                  </ListItemIcon>
                  <ListItemText primary="Basic sorting functionality" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CircleIcon sx={CircleIconStyle} />
                  </ListItemIcon>
                  <ListItemText primary="Search/filter capabilities" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CircleIcon sx={CircleIconStyle} />
                  </ListItemIcon>
                  <ListItemText primary="Add/remove columns" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CircleIcon sx={CircleIconStyle} />
                  </ListItemIcon>
                  <ListItemText primary="Reorder columns" />
                </ListItem>
              </List>
            </Paper>
          </Grid2>
        </Grid2>
      </Container>
    </div>
  );
}
