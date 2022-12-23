// @mui

import { styled } from "@mui/material/styles";
import { Card, Container } from "@mui/material";

// hooks

import useResponsive from "../hooks/useResponsive";

// components

import Page from "../components/Page";

// sections

import { ProfileForm } from "../sections/auth/profile";

// ----------------------------------------------------------------------

const RootStyle = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "flex",
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: "100%",
  maxWidth: 464,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled("div")(({ theme }) => ({
  maxWidth: 480,
  margin: "auto",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function Register() {
  const mdUp = useResponsive("up", "md");

  return (
    <Page title="Profile">
      <RootStyle>
        {mdUp && (
          <SectionStyle>
            <img
              alt="register"
              src="/static/illustrations/illustration_register.png"
            />
          </SectionStyle>
        )}

        <Container>
          <ContentStyle>
            <ProfileForm />
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
