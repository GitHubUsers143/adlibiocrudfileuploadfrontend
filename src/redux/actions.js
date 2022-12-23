import * as types from "./actionTypes";
import { auth, db } from "../components/Firebase/firebase";
import { toast } from "material-react-toastify";
import "material-react-toastify/dist/ReactToastify.css";
import { storage } from "../components/Firebase/firebase";
import { ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";

toast.configure();

const initiate = () => ({
  type: types.INITIATE,
});

const registerStart = () => ({
  type: types.REGISTER_START,
});

const registerSuccess = (user) => ({
  type: types.REGISTER_SUCCESS,
  payload: user,
});

const registerFail = (error) => ({
  type: types.REGISTER_FAIL,
  payload: error,
});

const userStart = () => ({
  type: types.USER_START,
});

const userSuccess = (user) => ({
  type: types.USER_SUCCESS,
  payload: user,
});

const userFail = (error) => ({
  type: types.USER_FAIL,
  payload: error,
});

const loginStart = () => ({
  type: types.LOGIN_START,
});

const loginSuccess = (user) => ({
  type: types.LOGIN_SUCCESS,
  payload: user,
});

const loginFail = (error) => ({
  type: types.LOGIN_FAIL,
  payload: error,
});

const logoutStart = () => ({
  type: types.LOGOUT_START,
});

const logoutSuccess = (user) => ({
  type: types.LOGOUT_SUCCESS,
});

const logoutFail = (error) => ({
  type: types.LOGOUT_FAIL,
  payload: error,
});

export const Initiate = (values) => {
  return async function (dispatch) {
    dispatch(initiate());
  };
};

export const registerInitiate = (values, type) => {
  return async function (dispatch) {
    dispatch(registerStart());
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values }),
    };
    await fetch(
      "https://adlibiocrudfileuploadbackend.vercel.app/users/add",
      requestOptions
    )
      .then(async (response) => {
        const { success, user, error } = await response.json();
        if (!success) {
          dispatch(registerFail(error));
        } else {
          let _user = {
            _id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
          };
          if (type !== "register" && values.file !== "") {
            const filesRef = ref(
              storage,
              `${user._id}/${values.file.name + v4()}`
            );
            uploadBytes(filesRef, values.file).then(() => {});
          }
          dispatch(registerSuccess(_user));
          if (type === "register") {
            toast.success("Registered", {
              position: toast.POSITION.TOP_CENTER,
              autoClose: 2000,
            });
          } else
            toast.success("User Saved!", {
              position: toast.POSITION.TOP_CENTER,
              autoClose: 2000,
              onClose: () => (window.location.href = "/user"),
            });
        }
      })
      .catch((error) => {
        dispatch(registerFail(error));
        toast.error(error.message, {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
        });
      });
  };
};

export const loginInitiate = (values) => {
  return async function (dispatch) {
    dispatch(loginStart());
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values }),
    };
    await fetch(
      "https://adlibiocrudfileuploadbackend.vercel.app/users/login",
      requestOptions
    )
      .then(async (response) => {
        const { success, user, token, error } = await response.json();
        if (!success) {
          dispatch(loginFail(error));
        } else {
          let _user = {
            _id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
          };
          dispatch(loginSuccess(_user));
          window.localStorage.setItem("token", token);
        }
      })
      .catch((error) => {
        dispatch(loginFail(error));
        toast.error(error.message, {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
        });
      });
  };
};

export const logoutInitiate = (values) => {
  return function (dispatch) {
    dispatch(logoutStart());
    dispatch(logoutSuccess());
  };
};
