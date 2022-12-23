import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// material

import {
  Stack,
  Button,
  Container,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  MenuItem,
} from "@mui/material";

// components

import Page from "../components/Page";
import Iconify from "../components/Iconify";

// mock

import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { Form, FormikProvider, useFormik } from "formik";
import { registerInitiate } from "../redux/actions";
import { LoadingButton } from "@mui/lab";
import { toast } from "material-react-toastify";
import "material-react-toastify/dist/ReactToastify.css";

// ----------------------------------------------------------------------

toast.configure();

const ROLE = [
  { value: "admin", label: "Admin" },
  { value: "user", label: "User" },
];

export default function NewUser() {
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);

  const { loading, error } = useSelector((state) => state.user);

  const [file, setFile] = useState("");

  useEffect(() => {
    if (error !== null) {
      toast.error(error, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
      });
    }
  }, [error]);

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("First name required"),
    lastName: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("Last name required"),
    email: Yup.string()
      .email("Email must be a valid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "",
    },
    validationSchema: RegisterSchema,
    onSubmit: (values, actions) => {
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
        values["file"] = file;
        values["token"] = window.localStorage.getItem("token");
        dispatch(registerInitiate(values, "user"));
        actions.setSubmitting(false);
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

  const { errors, touched, handleSubmit, getFieldProps } = formik;

  const selectFile = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <Page title="New User">
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
                id="email"
                name="email"
                fullWidth
                type="email"
                label="Email address"
                {...getFieldProps("email")}
                error={Boolean(touched.email && errors.email)}
                helperText={touched.email && errors.email}
              />

              <TextField
                id="password"
                name="password"
                fullWidth
                type={showPassword ? "text" : "password"}
                label="Password"
                {...getFieldProps("password")}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        <Iconify
                          icon={
                            showPassword ? "eva:eye-fill" : "eva:eye-off-fill"
                          }
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                error={Boolean(touched.password && errors.password)}
                helperText={touched.password && errors.password}
              />

              <TextField
                id="role"
                name="role"
                fullWidth
                select
                label="Role"
                value={formik.values.role}
                onChange={formik.handleChange}
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

              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loading={loading}
              >
                Save
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
