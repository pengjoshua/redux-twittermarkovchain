import {
  CLICK_LOGIN,
  CLICK_SIGNUP,
  CLICK_LOGOUT,
  LOGIN_USER_FULFILLED,
  LOGIN_USER_REJECTED,
  SIGNUP_USER_FULFILLED,
  SIGNUP_USER_REJECTED,
  LOGOUT_USER_FULFILLED,
  LOGOUT_USER_REJECTED
} from '../constants/ActionTypes';
import { fetchFavorites } from './tweetsActions';
import axios from 'axios';

export function loginUser(email, password, tweet) {
  return function(dispatch) {
    axios.post('/login', {
      email,
      password,
    })
    .then(res => {
      if (res.data.msg !== 'success') {
        dispatch({
          type: LOGIN_USER_REJECTED,
          payload: {
            loggedIn: false,
            clickedSignup: false,
            message: `Sorry, we could not log you in.`
          }
        });
        console.log(res.data.errors ? res.data.errors : res.data.error);
      } else {
        let saveTweet = Object.assign({}, tweet, { uid: res.data.uid });
        dispatch({
          type: LOGIN_USER_FULFILLED,
          payload: {
            loggedIn: true,
            clickedSignup: false,
            message: `Thanks ${res.data.displayName}, you are now logged in!`,
            saveTweet: saveTweet,
            user: {
              uid: res.data.uid,
              displayName: res.data.displayName,
              email: res.data.email,
            },
          }
        });
        dispatch(fetchFavorites());
      }
    })
    .catch(err => dispatch({type: LOGIN_USER_REJECTED, payload: err}));
  };
}

export function signupUser(displayName, email, password, password2, tweet) {
  return function(dispatch) {
    axios.post('/signup', {
      displayName,
      email,
      password,
      password2,
    })
    .then(res => {
      if (res.data.msg !== 'success') {
        dispatch({
          type: SIGNUP_USER_REJECTED,
          payload: {
            loggedIn: false,
            clickedSignup: true,
            message: `Sorry ${displayName}, we could not create a new account for you.`
          }
        });
        console.log(res.data.errors ? res.data.errors : res.data.error);
      } else {
        let saveTweet = Object.assign({}, tweet, { uid: res.data.uid });
        dispatch({
          type: SIGNUP_USER_FULFILLED,
          payload: {
            loggedIn: true,
            clickedSignup: false,
            message: `Congrats ${res.data.displayName}, you are now signed up and logged in!`,
            saveTweet: saveTweet,
            user: {
              uid: res.data.uid,
              displayName: res.data.displayName,
              email: res.data.email,
            },
          }
        });
        dispatch(fetchFavorites());
      }
    })
    .catch(err => dispatch({type: SIGNUP_USER_REJECTED, payload: err}));
  };
}

export function logoutUser(displayName) {
  return function(dispatch) {
    axios.get('/logout', { displayName })
    .then(res => {
      dispatch({
        type: LOGOUT_USER_FULFILLED,
        payload: {
          clickedSignup: false,
          loggedIn: false,
        }
      });
    })
    .catch(err => dispatch({type: LOGOUT_USER_REJECTED, payload: err}));
  }
}

export function clickSignup() {
  return { type: CLICK_SIGNUP, payload: {clickedSignup: true} };
}

export function clickLogin() {
  return { type: CLICK_LOGIN, payload: {clickedSignup: false} };
}

export function clickLogout() {
  return { type: CLICK_LOGOUT, payload: {loggedIn: false} };
}
