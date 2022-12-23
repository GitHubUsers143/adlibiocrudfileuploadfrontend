import { useCallback, useEffect, useState } from "react";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";

// material

import { Stack, TextField, MenuItem } from "@mui/material";
import { LoadingButton } from "@mui/lab";

// component

import { toast } from "material-react-toastify";
import "material-react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";

// ----------------------------------------------------------------------

toast.configure();

const ROLE = [
  { value: "admin", label: "Admin" },
  { value: "user", label: "User" },
];

export default function ProfileForm() {
  const { loading } = useSelector((state) => state.user);

  const [role, setRole] = useState("");

  const [user, setUser] = useState([]);

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
        formik.setFieldValue("firstName", user.firstName);
        formik.setFieldValue("lastName", user.lastName);
        formik.setFieldValue("email", user.email);
        setRole(user.role);
      })
      .catch((error) => {
        toast.error(error, {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
        });
      });
  }, []);

  useEffect(() => {
    getUser();
  }, [getUser]);

  const ProfileSchema = Yup.object().shape({
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
      email: "",
      role: "",
    },
    validationSchema: ProfileSchema,
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
          `https://adlibiocrudfileuploadbackend.vercel.app/users/update/${user._id}`,
          requestOptions
        )
          .then(async (response) => {
            const { success, error } = await response.json();
            if (!success) {
              toast.error(error, {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
              });
            } else {
              toast.success("Profile Updated!", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
                onClose: () => (window.location.href = "/user"),
              });
            }
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
      formik.setFieldValue("role", "");
      actions.setSubmitting(false);
    },
  });

  const handleChange = (event) => {
    setRole(event.target.value);
  };

  const { errors, touched, handleSubmit, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              fullWidth
              label="First name"
              {...getFieldProps("firstName")}
              error={Boolean(touched.firstName && errors.firstName)}
              helperText={touched.firstName && errors.firstName}
            />

            <TextField
              fullWidth
              label="Last name"
              {...getFieldProps("lastName")}
              error={Boolean(touched.lastName && errors.lastName)}
              helperText={touched.lastName && errors.lastName}
            />
          </Stack>

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

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={loading}
          >
            Update Profile
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
