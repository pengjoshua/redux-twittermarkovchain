import {
  CLICK_GENERATE,
  DISPLAY_TWEET,
  FETCH_TWEETS_FULFILLED,
  FETCH_TWEETS_REJECTED,
  SAVE_TWEET_FULFILLED,
  SAVE_TWEET_REJECTED,
  FETCH_FAVORITES_FULFILLED,
  FETCH_FAVORITES_REJECTED,
  DELETE_TWEET_FULFILLED,
  DELETE_TWEET_REJECTED
} from '../constants/ActionTypes';
import axios from 'axios';

const minLength = 4 + Math.floor(4 * Math.random());

export function clickGenerate(handle, count) {
  return {
    type: CLICK_GENERATE,
    payload: {
      clickedSave: false,
      handle,
      count,
    }
  }
}

export function displayTweet(uid, username, handle, text) {
  return {
    type: DISPLAY_TWEET,
    payload: {
      saveTweet: {
        uid,
        username,
        handle,
        text,
        created_at: new Date(),
      }
    }
  }
}

// Return random array index
function choice(array) {
  const i = Math.floor(array.length * Math.random());
  return array[i];
}

// Making the Markov chain (tweet) with a recursive call
function makeTweet(minLength, terminals, startWords, wordStats) {
  let word = choice(startWords);
  let tweet = [word];
  while (wordStats[word]) {
      let nextWords = wordStats[word];
      word = choice(nextWords);
      tweet.push(word);
      if (tweet.length > minLength && terminals[word]) break;
  }
  if (tweet.length < minLength) return makeTweet(minLength, terminals, startWords, wordStats);
  return tweet.join(' ');
}

export function fetchTweets(handle, count) {
  return function(dispatch) {
    axios.get('/' + handle + '/' + count)
    .then(res => {
      let terminals = {};
      let startWords = [];
      let wordStats = {};
      let texts = res.data.map(tweet => tweet.text);
      for (let i = 0; i < texts.length; i++) {
        let words = texts[i].split(' ');
        terminals[words[words.length - 1]] = true;
        startWords.push(words[0]);
        for (let j = 0; j < words.length - 1; j++) {
          if (wordStats[words[j]]) wordStats[words[j]].push(words[j + 1]);
          else wordStats[words[j]] = [words[j + 1]];
        }
      }
      let text = makeTweet(minLength, terminals, startWords, wordStats);
      let uid = '';
      let username = res.data[0].user.name;
      dispatch({
        type: FETCH_TWEETS_FULFILLED,
        payload: {
          tweets: res.data,
          count: res.data.length,
          text: res.data.map(tweet => tweet.text),
          username: res.data[0].user.name,
          handle,
        }
      });
      dispatch(displayTweet(uid, username, handle, text));
    })
    .catch(err => dispatch({type: FETCH_TWEETS_REJECTED, payload: err}));
  }
}

export function saveTweet(uid, handle, username, text, created_at) {
  return function(dispatch) {
    axios.post('/favorites', {
      uid,
      handle,
      username,
      text,
      created_at,
    })
    .then(res => {
      dispatch({type: SAVE_TWEET_FULFILLED, payload: res.data});
      dispatch(fetchFavorites());
    })
    .catch(err => dispatch({type: SAVE_TWEET_REJECTED, payload: err}));
  }
}

export function fetchFavorites() {
  return function(dispatch) {
    axios.get('/favorites')
    .then(res => dispatch({type: FETCH_FAVORITES_FULFILLED, payload: res.data}))
    .catch(err => dispatch({type: FETCH_FAVORITES_REJECTED, payload: err}));
  }
}

export function deleteTweet(tweet) {
  return function(dispatch) {
    axios.delete('/favorites/' + tweet.id)
    .then(res => {
      dispatch({type: DELETE_TWEET_FULFILLED, payload: res.data});
      dispatch(fetchFavorites());
    })
    .catch(err => dispatch({type: DELETE_TWEET_REJECTED, payload: err}));
  }
}
