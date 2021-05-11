import { bindActionCreators, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {LOCALSTORAGE_TOKEN, LOCALSTORAGE_USER} from "../utils/constants";

export interface AuthStateType {
  user: object;
  token: string;
};

export interface AuthDispatchType {
  setLogin: Function;
  setLogout: Function;
}

export const authMapStateToProps = ({
  authInfo: {
    user,
    token,
  }
}: { authInfo: AuthStateType }, ownProps: {}) => {
  return {
    user,
    token
  };
};

export const authMapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    setLogin,
    setLogout,
  }, dispatch);
};

const user = JSON.parse(localStorage.getItem(LOCALSTORAGE_USER) || '{}');
const token = localStorage.getItem(LOCALSTORAGE_TOKEN) || '';

const auth = createSlice({
  name: 'auth',
  initialState: {
    user,
    token,
  },
  reducers: {
    setLogin: (state, action: PayloadAction) => {
      const {
        user = {},
        token = '',
      }: any = action.payload;

      localStorage.setItem(LOCALSTORAGE_USER, JSON.stringify(user));
      localStorage.setItem(LOCALSTORAGE_TOKEN, token);

      return {
        ...state,
        token,
        user,
      };
    },
    setLogout: (state) => {
      localStorage.setItem(LOCALSTORAGE_USER, '{}');
      localStorage.setItem(LOCALSTORAGE_TOKEN, '');
      return {
        ...state,
        token: '',
      };
    }
  }
});

export const {
  setLogin,
  setLogout,
} = auth.actions;

export default auth.reducer;