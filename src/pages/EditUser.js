import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";

// material

import {
  Stack,
  Container,
  Typography,
  TextField,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Button,
  ListSubheader,
  Collapse,
} from "@mui/material";

// components

import Page from "../components/Page";

import { useSelector } from "react-redux";
import * as Yup from "yup";
import { Form, FormikProvider, useFormik } from "formik";
import { LoadingButton } from "@mui/lab";
import { storage } from "../components/Firebase/firebase";
import { toast } from "material-react-toastify";
import "material-react-toastify/dist/ReactToastify.css";
import { getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";

// ----------------------------------------------------------------------

toast.configure();

const ROLE = [
  { value: "admin", label: "Admin" },
  { value: "user", label: "User" },
];

export default function EditUser() {
  const params = useParams();

  const { loading, user } = useSelector((state) => state.user);

  const [role, setRole] = useState("");

  const [file, setFile] = useState("");

  const [open, setOpen] = useState(false);

  const [files, setFiles] = useState([]);

  const EditUserSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("First name required"),
    lastName: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("Last name required"),
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
    },
    validationSchema: EditUserSchema,
    onSubmit: async (values, actions) => {
      if (
        values.firstName.trim().length === 0 &&
        values.lastName.trim().length === 0
      ) {
        formik.setFieldValue("firstName", "");
        formik.setFieldValue("lastName", "");
      } else if (values.firstName.trim().length === 0)
        formik.setFieldValue("firstName", "");
      else if (values.lastName.trim().length === 0)
        formik.setFieldValue("lastName", "");
      else {
        let newUser = {
          firstName: values.firstName,
          lastName: values.lastName,
          role: role,
        };
        newUser["token"] = window.localStorage.getItem("token");
        const requestOptions = {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...newUser }),
        };
        await fetch(
          `https://adlibiocrudfileuploadbackend.vercel.app/users/update/${params.id}`,
          requestOptions
        )
          .then(() => {
            if (file !== "") {
              const filesRef = ref(storage, `${params.id}/${file.name + v4()}`);
              uploadBytes(filesRef, file).then(() => {});
            }
            actions.setSubmitting(false);
            toast.success("User Updated!", {
              position: toast.POSITION.TOP_CENTER,
              autoClose: 2000,
              onClose: () => (window.location.href = "/user"),
            });
          })
          .catch((error) => {
            toast.error(error.message, {
              position: toast.POSITION.TOP_CENTER,
              autoClose: 2000,
            });
          });
      }
    },
    onReset: (actions) => {
      formik.setFieldValue("firstName", "");
      formik.setFieldValue("lastName", "");
      formik.setFieldValue("email", "");
      formik.setFieldValue("password", "");
      formik.setFieldValue("role", "");
      setFile("");
      actions.setSubmitting(false);
    },
  });

  const getUser = useCallback(async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + window.localStorage.getItem("token"),
      },
    };
    await fetch(
      `https://adlibiocrudfileuploadbackend.vercel.app/users/user/${params.id}`,
      requestOptions
    )
      .then(async (response) => {
        const { user } = await response.json();
        formik.setFieldValue("firstName", user.firstName);
        formik.setFieldValue("lastName", user.lastName);
        setRole(user.role);
      })
      .catch((error) => {
        toast.error(error, {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
        });
      });
  }, [params.id]);

  const getFiles = useCallback(async () => {
    const fileListsRef = ref(storage, `${params.id}`);
    listAll(fileListsRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setFiles((prev) => [...prev, url]);
        });
      });
    });
  }, [params.id]);

  useEffect(() => {
    getUser();
  }, [loading, user, getUser]);

  useEffect(() => {
    getFiles();
  }, [getFiles]);

  const handleChange = (event) => {
    setRole(event.target.value);
  };

  const selectFile = (e) => {
    setFile(e.target.files[0]);
  };

  const handleClick = () => {
    setOpen(!open);
  };

  const { errors, touched, handleSubmit, getFieldProps } = formik;

  return (
    <Page title="Edit User">
      <Container>
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

        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  id="firstName"
                  name="firstName"
                  fullWidth
                  label="First name"
                  {...getFieldProps("firstName")}
                  error={Boolean(touched.firstName && errors.firstName)}
                  helperText={touched.firstName && errors.firstName}
                />

                <TextField
                  id="lastName"
                  name="lastName"
                  fullWidth
                  label="Last name"
                  {...getFieldProps("lastName")}
                  error={Boolean(touched.lastName && errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                />
              </Stack>

              <TextField
                id="role"
                name="role"
                fullWidth
                select
                label="Role"
                value={role}
                onChange={handleChange}
              >
                {ROLE.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              <label htmlFor="btn-upload">
                <TextField
                  id="btn-upload"
                  name="btn-upload"
                  style={{ display: "none" }}
                  type="file"
                  accept="image/*"
                  onChange={selectFile}
                />
                <Button
                  className="btn-choose"
                  variant="outlined"
                  component="span"
                >
                  Choose File
                </Button>
              </label>

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

              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loading={loading}
              >
                Edit User
              </LoadingButton>
              <LoadingButton
                fullWidth
                size="large"
                type="reset"
                variant="contained"
                loading={loading}
              >
                Cancel
              </LoadingButton>
            </Stack>
          </Form>
        </FormikProvider>
      </Container>
    </Page>
  );
}
