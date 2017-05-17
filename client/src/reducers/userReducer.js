import {
  CLICK_LOGIN,
  CLICK_SIGNUP,
  CLICK_LOGOUT,
  LOGIN_USER,
  LOGIN_USER_FULFILLED,
  LOGIN_USER_REJECTED,
  SIGNUP_USER,
  SIGNUP_USER_FULFILLED,
  SIGNUP_USER_REJECTED,
  LOGOUT_USER,
  LOGOUT_USER_FULFILLED,
  LOGOUT_USER_REJECTED
} from '../constants/ActionTypes';

export default function reducer(state={
  loggedIn: false,
  clickedSignup: false,
  user: {
    uid: '',
    displayName: '',
    email: ''
  },
}, action) {

  switch (action.type) {
    case CLICK_SIGNUP: {
      return {...state, clickedSignup: true}
    }
    case CLICK_LOGIN: {
      return {...state, clickedSignup: false}
    }
    case CLICK_LOGOUT: {
      return {...state, loggedIn: false}
    }
    case LOGIN_USER: {
      return {...state, loggingIn: true}
    }
    case LOGIN_USER_REJECTED: {
      return {...state, loggingIn: false, error: action.payload}
    }
    case LOGIN_USER_FULFILLED: {
      return {
        ...state,
        loggingIn: false,
        loggedIn: true,
        user: action.payload.user,
      }
    }
    case SIGNUP_USER: {
      return {...state, signingUp: true}
    }
    case SIGNUP_USER_REJECTED: {
      return {...state, signingUp: false, clickedSignup: true, error: action.payload}
    }
    case SIGNUP_USER_FULFILLED: {
      return {
        ...state,
        signingUp: false,
        loggedIn: true,
        clickedSignup: false,
        user: action.payload.user,
      }
    }
    case LOGOUT_USER: {
      return {...state, loggingOut: true}
    }
    case LOGOUT_USER_REJECTED: {
      return {...state, loggingOut: false, error: action.payload}
    }
    case LOGOUT_USER_FULFILLED: {
      return {
        ...state,
        loggingOut: false,
        loggedIn: false,
        clickedSignup: false,
      }
    }
    default:
      return state;
  }
}
