import { bindActionCreators, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {LOCALSTORAGE_TOKEN} from "../utils/constants";

export interface AuthStateType {
  userId: string;
};

export interface AuthDispatchType {
  setLoginInfo: Function;
  setLogout: Function;
}

export const authMapStateToProps = ({
  authInfo: {
    userId,
  }
}: { authInfo: AuthStateType }, ownProps: {}) => {
  return { userId };
};

export const authMapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    setLoginInfo,
    setLogout,
  }, dispatch);
};

const userId = localStorage.getItem(LOCALSTORAGE_TOKEN) || '';

const auth = createSlice({
  name: 'auth',
  initialState: {
    userId,
  },
  reducers: {
    setLoginInfo: (state, action: PayloadAction) => {
      const { userId = '' }: any = action.payload;
      localStorage.setItem(LOCALSTORAGE_TOKEN, userId);
      return {
        ...state,
        userId,
      };;
    },
    setLogout: (state) => {
      localStorage.setItem(LOCALSTORAGE_TOKEN, '');
      return {
        ...state,
        userId: '',
      };
    }
  }
});

export const {
  setLoginInfo,
  setLogout,
} = auth.actions;

export default auth.reducer;