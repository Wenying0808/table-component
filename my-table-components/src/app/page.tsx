import Navbar from "@/app/components/navbar/navbar";
import { Container, Typography, Paper, List, ListItem, ListItemText, Grid2 } from '@mui/material';

export default function Home() {
  return (
    <div className="table-page">
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Table Components Introduction
        </Typography>
        <Typography variant="body1" component="h1" align="center" gutterBottom>
          Reusable React table components built with MUI and Tanstack Table
        </Typography>
        
        <Grid2 container spacing={4} sx={{ mt: 2 }}>
          <Grid2 size="grow">
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Basic Data Display
              </Typography>
              <Typography variant="body1" gutterBottom>
                A simple table component that displays data in a clean, organized format. Features include:
              </Typography>
              <List>
                <ListItem>
                  <ListItemText primary="Fetch Data from database by API" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Create, Read, Update, Delete table data by API" />
                </ListItem>
              </List>
            </Paper>
          </Grid2>

          <Grid2 size="grow">
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Table Interactions
              </Typography>
              <Typography variant="body1" gutterBottom>
                An enhanced table with additional functionality:
              </Typography>
              <List>
                <ListItem>
                  <ListItemText primary="Expand/collapse nestedrows" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Basic sorting functionality" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Search/filter capabilities" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Add/remove columns" />
                </ListItem>
                <ListItem>
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
