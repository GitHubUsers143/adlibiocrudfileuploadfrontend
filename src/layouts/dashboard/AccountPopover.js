import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// @mui

import { alpha } from "@mui/material/styles";
import {
  Box,
  Divider,
  Typography,
  MenuItem,
  Avatar,
  IconButton,
} from "@mui/material";

// components

import MenuPopover from "../../components/MenuPopover";

// mocks_

import account from "../../_mock/account";

import { toast } from "material-react-toastify";
import "material-react-toastify/dist/ReactToastify.css";

import { useDispatch, useSelector } from "react-redux";
import { logoutInitiate } from "../../redux/actions";

toast.configure();

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const { user } = useSelector((state) => state.user);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const anchorRef = useRef(null);

  const [open, setOpen] = useState(null);

  const [_user, setUser] = useState([]);

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

  useEffect(() => {
    if (user.length !== 0) window.localStorage.setItem("user", user._id);

    getUser();
  }, [getUser, user._id, user.length]);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = (event) => {
    if (event.currentTarget.className.includes("backdrop")) setOpen(null);
  };

  const handleLogout = (event) => {
    dispatch(logoutInitiate());
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            "&:before": {
              zIndex: 1,
              content: "''",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              position: "absolute",
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src={account.photoURL} alt="photoURL" />
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          p: 0,
          mt: 1.5,
          ml: 0.75,
          "& .MuiMenuItem-root": {
            typography: "body2",
            borderRadius: 0.75,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {_user.firstName} {_user.lastName}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
            {_user.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: "dashed" }} />

        <Divider sx={{ borderStyle: "dashed" }} />

        <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </MenuPopover>
    </>
  );
}
