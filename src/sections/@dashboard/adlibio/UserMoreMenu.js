import { useRef, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
// material
import {
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
// component
import Iconify from "../../../components/Iconify";
import { toast } from "material-react-toastify";

// ----------------------------------------------------------------------

export default function UserMoreMenu({ _id, refresh }) {
  const ref = useRef(null);

  const [isOpen, setIsOpen] = useState(false);

  const [link] = useState(`edit/${_id}`);

  const onDelete = async () => {
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + window.localStorage.getItem("token"),
      },
    };
    await fetch(
      `https://adlibiocrudfileuploadbackend.vercel.app/users/delete/${_id}`,
      requestOptions
    )
      .then(async (response) => {
        const { success, error } = await response.json();
        if (!success)
          toast.error(error, {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 2000,
          });
        else
          toast.success("User Deleted!", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 2000,
            onClose: () => refresh(),
          });
      })
      .catch((error) => {
        toast.error(error.message, {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
        });
      });
  };

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Iconify icon="eva:more-vertical-fill" width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: "100%" },
        }}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem
          component={RouterLink}
          to={link}
          sx={{ color: "text.secondary" }}
        >
          <ListItemIcon>
            <Iconify icon="eva:edit-fill" width={24} height={24} />
          </ListItemIcon>
          <ListItemText
            primary="Edit"
            primaryTypographyProps={{ variant: "body2" }}
          />
        </MenuItem>
        <MenuItem onClick={onDelete} sx={{ color: "text.secondary" }}>
          <ListItemIcon>
            <Iconify icon="eva:trash-fill" width={24} height={24} />
          </ListItemIcon>
          <ListItemText
            primary="Delete"
            primaryTypographyProps={{ variant: "body2" }}
          />
        </MenuItem>
      </Menu>
    </>
  );
}
