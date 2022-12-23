import * as Yup from "yup";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik, Form, FormikProvider } from "formik";

// material

import {
  Stack,
  TextField,
  IconButton,
  InputAdornment,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

// component

import Iconify from "../../../components/Iconify";
import { loginInitiate } from "../../../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "material-react-toastify";
import "material-react-toastify/dist/ReactToastify.css";

// ----------------------------------------------------------------------

toast.configure();

export default function LoginForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();

  const { loading, error, login_success } = useSelector((state) => state.user);

  useEffect(() => {
    if (error !== null)
      toast.error(error, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
      });
    if (login_success)
      toast.success("Logging In", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
        onClose: () => navigate("/dashboard", { replace: true }),
      });
  }, [error, login_success, navigate]);

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Email must be a valid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      remember: true,
    },
    validationSchema: LoginSchema,
    onSubmit: (values, actions) => {
      dispatch(loginInitiate(values));
      actions.setSubmitting(false);
    },
  });

  const { errors, touched, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <>
      <Backdrop sx={{ fontSize: 34, zIndex: "1" }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Stack spacing={3} sx={{ my: 2 }}>
            <TextField
              fullWidth
              autoComplete="username"
              type="email"
              label="Email address"
              {...getFieldProps("email")}
              error={Boolean(touched.email && errors.email)}
              helperText={touched.email && errors.email}
            />

            <TextField
              fullWidth
              autoComplete="current-password"
              type={showPassword ? "text" : "password"}
              label="Password"
              {...getFieldProps("password")}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleShowPassword} edge="end">
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
          </Stack>
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={loading}
          >
            Login
          </LoadingButton>
        </Form>
      </FormikProvider>
    </>
  );
}
