import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Grid, Row, Col, Button, FormGroup } from 'react-bootstrap';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Tweets from '../components/Tweets';
import Favorites from '../components/Favorites';
import FontAwesome from 'react-fontawesome';
import '../../public/style.css';
import javascript_time_ago from 'javascript-time-ago';
javascript_time_ago.locale(require('javascript-time-ago/locales/en'));
require('javascript-time-ago/intl-messageformat-global');
require('intl-messageformat/dist/locale-data/en');
const timeAgo = new javascript_time_ago('en-US');
import {
  loginUser,
  signupUser,
  logoutUser,
  clickLogin,
  clickSignup,
  clickLogout,
} from "../actions/userActions";
import {
  clickGenerate,
  fetchTweets,
  saveTweet,
  fetchFavorites,
  deleteTweet,
} from "../actions/tweetsActions";
import * as userActions from '../actions/userActions';
import * as tweetsActions from '../actions/tweetsActions';
// const twitter = timeAgo.style.twitter();

// Constants for default values
const startCount = 18;

class App extends Component {
  constructor(props) {
    super(props);
  }

  // get 18 tweets from @openmessageio to start
  componentDidMount() {
    this.props.dispatch(fetchTweets('openmessageio', startCount));
  }

  // Handling the 'generate' button submit
  // Get tweets from Twitter API and passes the Twitter handle and count
  handleGenerateSubmit(e) {
    e.preventDefault();
    if (this.refs.handle.value === '') alert('Twitter username is required');
    let usercount = (this.refs.count.value === '' || this.refs.count.value > 18) ? startCount : this.refs.count.value;
    clickGenerate(this.refs.handle.value, usercount);
    this.props.dispatch(fetchTweets(this.refs.handle.value, usercount));
    this.refs.handle.value = '';
    this.refs.count.value = '';
  }

  // Handling signup and signup button visibility
  // API call to POST /signup passing in the displayName, password, password2, and email
  handleSignupSubmit(e) {
    e.preventDefault();
    let preventSignup = false;
    if (this.refs.displayName.value === '') preventSignup = true;
    if (this.refs.password.value === '' || this.refs.password.value.length < 6) preventSignup = true;
    if (this.refs.password2.value === '' || this.refs.password2.value.length < 6) preventSignup = true;
    if (this.refs.email.value === '') preventSignup = true;

    if (!preventSignup) {
      let displayName = this.refs.displayName.value;
      let email = this.refs.email.value;
      let password = this.refs.password.value;
      let password2 = this.refs.password2.value;
      let saveTweet = this.props.tweets.saveTweet;
      this.props.dispatch(signupUser(displayName, email, password, password2, saveTweet));
      this.refs.displayName.value = '';
      this.refs.password.value = '';
      this.refs.password2.value = '';
      this.refs.email.value = '';
    }
  }

  // Handling login and login button visibility
  // API call to POST /login passing in the email and password
  handleLoginSubmit(e) {
    e.preventDefault();
    let preventLogin = false;
    if (this.refs.password.value === '' || this.refs.password.value.length < 6) preventLogin = true;
    if (this.refs.email.value === '') preventLogin = true;

    if (!preventLogin) {
      let email = this.refs.email.value;
      let password = this.refs.password.value;
      let saveTweet = this.props.tweets.saveTweet;
      this.props.dispatch(loginUser(email, password, saveTweet));
      this.refs.password.value = '';
      this.refs.email.value = '';
    }
  }

  // Click handlers for signup/login button visibility
  clickSignupButton() {
    this.props.dispatch(clickSignup());
  }

  clickLoginButton() {
    this.props.dispatch(clickLogin());
  }

  clickLogoutButton() {
    this.props.dispatch(clickLogout());
    this.props.dispatch(logoutUser(this.props.user.user.displayName));
  }

  // API call to POST /favorites to save a generated tweet
  // Passes in uid (user id associated with the generated tweet),
  // handle (i.e. @openmessageio), username (Open Message), text, and created_at timestamp
  saveFavorite() {
    let uid = this.props.user.user.uid;
    let handle = this.props.tweets.saveTweet.handle;
    let username = this.props.tweets.saveTweet.username;
    let text = this.props.tweets.saveTweet.text;
    let created_at = this.props.tweets.saveTweet.created_at;
    this.props.dispatch(saveTweet(uid, handle, username, text, created_at));
  }

  // API call to GET /favorites to retrieve all tweets
  // the tweets are later filtered according to the user that they are assigned to using the tweet uid
  getFavorites() {
    this.props.dispatch(fetchFavorites());
  }

  // Handling a favorite tweet delete button click
  // API call to DELETE /favorites passing the tweet id
  deleteFavorite(tweet) {
    this.props.dispatch(deleteTweet(tweet));
  }

  render() {
    // The top right userInfo section will be 1 of 3 possibilities:
    // 1. login form
    // 2. signup form
    // 3. 'You are logged in' notification
    let userInfo;
    if (!this.props.user.loggedIn && this.props.user.clickedSignup) {
      userInfo = (
        <div className="userInfo">
          <h5 className="user">Please fill in the following fields to sign up</h5>
          <form onSubmit={this.handleSignupSubmit.bind(this)}>
            <FormGroup>
              <input
                className="form-control signup-name"
                type="text"
                ref="displayName"
                placeholder="Enter your name"
              />
            </FormGroup>
            <FormGroup>
              <input
                className="form-control signup-email"
                type="text"
                ref="email"
                placeholder="Enter your email address"
              />
            </FormGroup>
            <FormGroup>
              <input
                className="form-control signup-password"
                type="password"
                ref="password"
                placeholder="Enter your password (between 6 to 20 characters)"
              />
            </FormGroup>
            <FormGroup>
              <input
                className="form-control signup-password2"
                type="password"
                ref="password2"
                placeholder="Confirm your password"
              />
            </FormGroup>
            <Button className="button-signup" bsStyle="info" type='submit'>
              <FontAwesome name="plus" />&nbsp;Sign Up
            </Button>
            &nbsp;&nbsp;
            <Button className="button" bsStyle="warning" type="button" onClick={this.clickLoginButton.bind(this)}>
              <FontAwesome name="reply" />&nbsp;Back
            </Button>
          </form>
        </div>
      );
    } else if (!this.props.user.loggedIn && !this.props.user.clickedSignup) {
      userInfo = (
        <div className="userInfo">
          <h5 className="user">Please log in to save generated Markov chains (tweets)</h5>
          <form onSubmit={this.handleLoginSubmit.bind(this)}>
            <FormGroup>
              <input
                className="form-control login-email"
                type="text"
                ref="email"
                placeholder="Enter your email address"
              />
            </FormGroup>
            <FormGroup>
              <input
                className="form-control login-password"
                type="password"
                ref="password"
                placeholder="Enter your password"
              />
            </FormGroup>
            <Button className="button-login" bsStyle="primary" type='submit'>
              <FontAwesome name="twitter-square" />&nbsp;Log In
            </Button>
            &nbsp;&nbsp;
            <Button className="button-register" bsStyle="info" type="button" onClick={this.clickSignupButton.bind(this)}>
              <FontAwesome name="plus-square" />&nbsp;Sign Up
            </Button>
          </form>
        </div>
      );
    } else {
      userInfo = (
        <div className="userInfo">
          <h5 className="user loggedin">You are logged in as {this.props.user.user.displayName}!</h5>
          <Button className="button-logout" bsStyle="danger" onClick={this.clickLogoutButton.bind(this)}>
            <FontAwesome name="minus-square" />&nbsp;Log Out
          </Button>
        </div>
      );
    }

    return (
      <div className="App">
        <Header />
        <Grid>
          <Row>
            <Col className="container" xs={12} md={6} lg={6}>
              <div className="tweetInfo">
                <h5 className="subtitle">Generate Markov chains based on user tweets!</h5>
                <form onSubmit={this.handleGenerateSubmit.bind(this)}>
                  <FormGroup>
                    <input
                      className="form-control handle-generate"
                      type="text"
                      ref="handle"
                      placeholder="Enter Twitter handle (i.e. openmessageio)"
                    />
                  </FormGroup>
                  <FormGroup>
                    <input
                      className="form-control number-generate"
                      type="number"
                      ref="count"
                      placeholder={"Enter tweet amount (" + startCount + " if left blank, 18 max)"}
                    />
                  </FormGroup>
                  <Button className="button-generate" bsStyle="info" type='submit'>
                    <FontAwesome name="twitter" />&nbsp;Generate
                  </Button>
                </form>
              </div>
            </Col>
            <Col className="container" xs={12} md={6} lg={6}>
              {userInfo}
            </Col>
          </Row>
          <hr />
          <Row>
            <Col className="container" xs={12} md={12} lg={12}>
              <div className="generated">
                <h4 className="subtitle">Generated Markov chain (tweet)!</h4>
                <span className="generatedtitle">
                  <h5 className="generatedtitle"><strong>{this.props.tweets.username}</strong> @{this.props.tweets.handle} <i>{timeAgo.format(new Date())}</i></h5>
                </span>
                <h5 className="generatedtext">{this.props.tweets.saveTweet.text}</h5>
                  { this.props.user.loggedIn ?
                  <Button className="button-save" bsStyle="info" onClick={this.saveFavorite.bind(this)}>
                    <FontAwesome name="star" />&nbsp;Save
                  </Button> : ''
                  }
              </div>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col className="container" xs={12} md={6} lg={6}>
              <Tweets
                tweets={this.props.tweets.tweets}
                count={this.props.tweets.tweets.length}
                handle={this.props.tweets.handle}
                username={this.props.tweets.saveTweet.username}
              />
            </Col>
            <Col className="container" xs={12} md={6} lg={6}>
              {this.props.user.loggedIn ?
                <Favorites
                  tweets={this.props.tweets.favorites}
                  uid={this.props.user.user.uid}
                  id={this.props.tweets.deleteTweet.id}
                  onClick={this.deleteFavorite.bind(this)}
                /> : ''
              }
            </Col>
          </Row>
          <div className="bottom"></div>
        </Grid>
        <Footer />
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return { tweets: state.tweets, user: state.user };
}

function mapDispatchToProps(dispatch) {
  return { action: bindActionCreators(Object.assign({}, tweetsActions, userActions)), dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
