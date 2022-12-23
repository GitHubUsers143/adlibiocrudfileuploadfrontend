// material

import { Stack, Container, Typography } from "@mui/material";

// components

import Page from "../../components/Page";

export default function Dashboard() {
  return (
    <Page title="Dashboard">
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Dashboard
          </Typography>
        </Stack>
      </Container>
    </Page>
  );
}
