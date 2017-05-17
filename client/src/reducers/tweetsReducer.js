import {
  CLICK_GENERATE,
  DISPLAY_TWEET,
  FETCH_TWEETS,
  FETCH_TWEETS_FULFILLED,
  FETCH_TWEETS_REJECTED,
  SAVE_TWEET,
  SAVE_TWEET_FULFILLED,
  SAVE_TWEET_REJECTED,
  FETCH_FAVORITES,
  FETCH_FAVORITES_FULFILLED,
  FETCH_FAVORITES_REJECTED,
  DELETE_TWEET,
  DELETE_TWEET_FULFILLED,
  DELETE_TWEET_REJECTED
} from '../constants/ActionTypes';

const startCount = 18;

export default function reducer(state={
  tweets: [],
  favorites: [],
  text: '',
  count: startCount,
  username: '',
  saveTweet: {
    uid: '',
    username: '',
    handle: '',
    text: '',
    created_at: '',
    id: ''
  },
  deleteTweet: {
    uid: '',
    username: '',
    handle: '',
    text: '',
    created_at: '',
    id: ''
  },
}, action) {

  switch (action.type) {
    case CLICK_GENERATE: {
      return {
        ...state,
        clickedSave: false,
        handle: action.payload.handle,
        count: action.payload.count
      }
    }
    case DISPLAY_TWEET: {
      return {
        ...state,
        saveTweet: action.payload.saveTweet,
      }
    }
    case FETCH_TWEETS: {
      return {...state, fetching: true}
    }
    case FETCH_TWEETS_REJECTED: {
      return {...state, fetching: false, error: action.payload}
    }
    case FETCH_TWEETS_FULFILLED: {
      return {
        ...state,
        fetching: false,
        fetched: true,
        tweets: action.payload.tweets,
        count: action.payload.count,
        text: action.payload.text,
        username: action.payload.username,
        handle: action.payload.handle,
      }
    }
    case SAVE_TWEET: {
      return {...state, saving: true}
    }
    case SAVE_TWEET_REJECTED: {
      return {...state, saving: false, error: action.payload}
    }
    case SAVE_TWEET_FULFILLED: {
      return {
        ...state,
        saving: false,
        saved: true,
        clickedSave: true,
        saveTweet: {
          uid: action.payload.uid,
          username: action.payload.username,
          handle: action.payload.handle,
          text: action.payload.text,
          created_at: action.payload.created_at,
          id: action.payload.id,
        }
      }
    }
    case FETCH_FAVORITES: {
      return {...state, retrieving: true}
    }
    case FETCH_FAVORITES_REJECTED: {
      return {...state, retrieving: false, error: action.payload}
    }
    case FETCH_FAVORITES_FULFILLED: {
      return {
        ...state,
        retrieving: false,
        retrieved: true,
        favorites: action.payload,
      }
    }
    case DELETE_TWEET: {
      return {...state, deleting: true}
    }
    case DELETE_TWEET_REJECTED: {
      return {...state, deleting: false, error: action.payload}
    }
    case DELETE_TWEET_FULFILLED: {
      return {
        ...state,
        deleting: false,
        deleted: true,
        deleteTweet: action.payload,
      }
    }
    default:
      return state;
  }
}
