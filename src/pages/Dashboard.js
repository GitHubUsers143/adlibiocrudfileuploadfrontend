// @mui

import { useTheme } from "@mui/material/styles";

import {
  Grid,
  Container,
  Typography,
  Stack,
  TextField,
  ListSubheader,
  ListItem,
  ListItemText,
  Collapse,
  List,
} from "@mui/material";

// components

import Page from "../components/Page";

// sections

import { AppCurrentVisits } from "../sections/@dashboard/app";

import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { toast } from "material-react-toastify";
import "material-react-toastify/dist/ReactToastify.css";
import { getDownloadURL, listAll, ref } from "firebase/storage";
import { storage } from "../components/Firebase/firebase";

toast.configure();

// ----------------------------------------------------------------------

export default function Dashboard() {
  const theme = useTheme();

  const { loading, user } = useSelector((state) => state.user);

  const [admins, setAdmins] = useState(0);

  const [users, setUsers] = useState(0);

  const [_user, setUser] = useState(0);

  const [open, setOpen] = useState(false);

  const [files, setFiles] = useState([]);

  const getUsers = useCallback(async () => {
    if (user.length !== 0) window.localStorage.setItem("user", user._id);
    let _adminCount = 0;
    let _userCount = 0;
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + window.localStorage.getItem("token"),
      },
    };
    await fetch(
      "https://adlibiocrudfileuploadbackend.vercel.app/users/",
      requestOptions
    )
      .then(async (response) => {
        const { success, users, error } = await response.json();
        if (!success)
          toast.error(error, {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 2000,
          });
        else if (users.length > 0)
          users.forEach((user) => {
            if (user.role === "admin") _adminCount += 1;
            else _userCount += 1;
          });
        setAdmins(_adminCount);
        setUsers(_userCount);
      })
      .catch((error) => {
        toast.error(error, {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
        });
      });
  }, [user._id, user.length]);

  const getUser = useCallback(async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + window.localStorage.getItem("token"),
      },
    };
    await fetch(
      `https://adlibiocrudfileuploadbackend.vercel.app/users/user/${window.localStorage.getItem(
        "user"
      )}`,
      requestOptions
    )
      .then(async (response) => {
        const { user } = await response.json();
        setUser(user);
      })
      .catch((error) => {
        toast.error(error, {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
        });
      });
  }, []);

  const getFiles = useCallback(async () => {
    const fileListsRef = ref(storage, `${_user._id}`);
    listAll(fileListsRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setFiles((prev) => [...prev, url]);
        });
      });
    });
  }, [_user._id]);

  useEffect(() => {
    getUsers();
    getUser();
  }, [loading, getUsers, getUser, getFiles]);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Dashboard
        </Typography>

        <Grid container spacing={3}>
          {_user.role === "admin" && (
            <Grid item xs={12} md={6} lg={4}>
              <AppCurrentVisits
                title="Users"
                chartData={[
                  { label: "Admin", value: admins },
                  { label: "User", value: users },
                ]}
                chartColors={[
                  theme.palette.primary.main,
                  theme.palette.chart.blue[0],
                ]}
              />
            </Grid>
          )}
        </Grid>
        {_user.role === "user" && (
          <>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              mb={5}
            >
              <Typography variant="h4" gutterBottom>
                User Information
              </Typography>
            </Stack>
            <Stack spacing={3}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  disabled={true}
                  id="firstName"
                  name="firstName"
                  fullWidth
                  label="First name"
                  value={_user.firstName}
                />

                <TextField
                  disabled={true}
                  id="lastName"
                  name="lastName"
                  fullWidth
                  label="Last name"
                  value={_user?.lastName}
                />

                <TextField
                  disabled={true}
                  id="email"
                  name="email"
                  fullWidth
                  label="Email"
                  value={_user?.email}
                />
              </Stack>

              <TextField
                disabled={true}
                id="role"
                name="role"
                fullWidth
                label="Role"
                value={_user?.role === "user" ? "User" : "Admin"}
              />

              <List
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={
                  <ListSubheader component="div" id="nested-list-subheader">
                    Files
                  </ListSubheader>
                }
              >
                <ListItem button onClick={handleClick}>
                  <ListItemText primary="Open Lists of Files" />
                </ListItem>
                <Collapse in={open} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {files.map((file, key) => (
                      <ListItem
                        button
                        key={key}
                        onClick={() =>
                          window.open(file, "_blank", "noopener,noreferrer")
                        }
                      >
                        <ListItemText primary={file.toString()} />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </List>
            </Stack>
          </>
        )}
      </Container>
    </Page>
  );
}
