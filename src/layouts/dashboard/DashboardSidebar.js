import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";

// material

import { styled } from "@mui/material/styles";
import { Box, Link, Drawer, Typography, Avatar } from "@mui/material";

// mock

import account from "../../_mock/account";

// hooks

import useResponsive from "../../hooks/useResponsive";

// components

import Scrollbar from "../../components/Scrollbar";
import NavSection from "../../components/NavSection";

import adminNavConfig from "./AdminNavConfig";
import userNavConfig from "./UserNavConfig";

import { toast } from "material-react-toastify";
import "material-react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";

toast.configure();

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;

const RootStyle = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("lg")]: {
    flexShrink: 0,
    width: DRAWER_WIDTH,
  },
}));

const AccountStyle = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: theme.palette.grey[500_12],
}));

// ----------------------------------------------------------------------

DashboardSidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func,
};

export default function DashboardSidebar({ isOpenSidebar, onCloseSidebar }) {
  const { user } = useSelector((state) => state.user);

  const [_user, setUser] = useState([]);

  const isDesktop = useResponsive("up", "lg");

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

    if (isOpenSidebar) {
      onCloseSidebar();
    }
    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        "& .simplebar-content": {
          height: 1,
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Box sx={{ py: 3, mb: 5, mx: 2.5 }}>
        <Link underline="none" component={RouterLink} to="#">
          <AccountStyle>
            <Avatar src={account.photoURL} alt="photoURL" />
            <Box sx={{ ml: 2 }}>
              <Typography
                wrap
                variant="subtitle2"
                sx={{ color: "text.primary" }}
              >
                {_user.firstName} {_user.lastName}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {_user.role === "admin" ? "Admin" : "User"}
              </Typography>
            </Box>
          </AccountStyle>
        </Link>
      </Box>

      <NavSection
        navConfig={_user.role === "admin" ? adminNavConfig : userNavConfig}
      />
    </Scrollbar>
  );

  return (
    <RootStyle>
      {!isDesktop && (
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: { width: DRAWER_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}

      {isDesktop && (
        <Drawer
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              bgcolor: "background.default",
              borderRightStyle: "dashed",
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </RootStyle>
  );
}
