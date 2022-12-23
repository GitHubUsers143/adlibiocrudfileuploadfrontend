import * as types from "./actionTypes";

const initialState = {
  loading: false,
  user: [],
  error: null,
  register_success: false,
  login_success: false,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.INITIATE:
      return {
        ...state,
        loading: false,
        user: [],
        error: null,
      };
    case types.REGISTER_START:
    case types.LOGIN_START:
    case types.LOGOUT_START:
      return {
        ...state,
        loading: true,
        user: [],
        error: null,
      };
    case types.REGISTER_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        register_success: true,
      };
    case types.LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload,
        error: null,
        login_success: true,
      };
    case types.LOGOUT_SUCCESS:
      return {
        ...state,
        loading: false,
        user: [],
        error: null,
        login_success: false,
      };
    case types.REGISTER_FAIL:
    case types.LOGIN_FAIL:
    case types.LOGOUT_FAIL:
      return {
        ...state,
        loading: false,
        user: [],
        error: action.payload,
        register_success: false,
        login_success: false,
      };
    default:
      return state;
  }
};

export default userReducer;
