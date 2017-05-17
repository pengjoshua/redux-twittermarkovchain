# twitter-markov-chain
A Markov chain generator app using user tweets. Made with React, Redux, Express, Google Firebase, and the Twitter API. Used Firebase for user authentication and save/delete tweet functionality. Complete with Mocha/Chai unit tests and Selenium Webdriver end-to-end tests.

## Overview  

For this project, I used a mathematical structure called a Markov chain (https://en.wikipedia.org/wiki/Markov_chain) to model the statistical likelihood of a word in a tweet being followed by some other word in a tweet. I use this statistical information to generate new custom tweets by choosing the first word (at random) and then choosing subsequent words with a frequency proportional to how those words are arranged in the original text. This process will give me a string of text that may not be in the original text, but will share stylistic properties of the original text.

You can now log in and can save your favorite generated Markov chains (tweets) to a Google Firebase database. Since tweets are linked to a user's uid, each user can save, retrieve, and delete their own generated tweets. Firebase assigns a key which I have assigned to each tweet's id so that each tweet can be individually deleted from the database.

## Steps

First, I created a Twitter Developers account and gathered the `consumer_key`, `consumer_secret`, `access_token_key`, and `access_token_secret` in order to request data from the Twitter API (please replace with your own keys and secrets in `server/app.js`). To start, the app requests 18 (or a specified amount) user tweets using the Twitter API (`GET statuses/user_timeline`) with Axios with the username and count in the request parameters. Then, the app constructs a list of unique words that appear in these tweets. Next, for each word in this list, the app counts which words follow that word and with which frequency. Any text generated from this corpus maintains the same statistical properties.

## Technologies  

- React
- React-Bootstrap
- FontAwesome
- Redux, React-Redux
- Redux-Logger, Redux-Thunk, Redux-Promise-Middleware
- Node
- Express
- Express-Validator
- Axios
- Bluebird
- Twitter API
- Google Firebase Database and User Authentication
- Mocha
- Chai
- Selenium Webdriver (chromedriver)

## Setup  

- Clone the repository or download and extract the project zip file
- Open a new terminal window/tab and navigate to the root of the project
- To install the dependencies, run `npm i` from the root of the project
- Additionally, run `npm i` from both the `client` folder and `server` folder
- To start the server and simultaneously start the client, run `npm start` from the root directory
    - Open a browser and navigate to [http://localhost:3000](http://localhost:3000)
    - (To stop the server, hit `ctrl+c` in the terminal window)
- To run the Mocha/Chai unit tests, run `npm test`
    - (Stop the server before running tests, server cannot be running at the same time)

## Testing
- To run Mocha/Chai unit tests, run `npm test` from the root of the project in a terminal window
    - (Stop the server before running unit tests)
- To run Selenium Webdriver end-to-end tests, run `npm run selenium` from the root of the project in a terminal window
    - Selenium will open a new Google Chrome browser window
    - (Stop the server before running end-to-end tests)

## Methods and Functionality
(in `client/src/App.js`)

#### *componentDidMount*   
This lifecycle method retrieves 18 tweets from @openmessageio when the App container mounts. Tweets are retrieved from the Twitter API `GET statuses/user_timeline` passing in the Twitter handle and count.

#### *choice*   
Returns a random array index.

#### *makeTweet*   
Makes the Markov chain (tweet) with a recursive call.

#### *displayTweet*   
Display the generated tweet.  

#### *handleGenerateSubmit*    
Handles the 'generate' button submit and retrieves tweets from the Twitter API `GET statuses/user_timeline` passing in the Twitter handle and count.  

#### *handleSignupSubmit*  
Handles signup and signup button visibility and makes an API call to `POST /signup` passing in the displayName, password, password2, and email.

#### *handleLoginSubmit*  
Handles login and login button visibility and makes an API call to `POST /login` passing in the email and password.

#### *clickSignupButton, clickLoginButton, clickLogoutButton*  
Click handlers for signup/login button visibility.

#### *saveFavorite*  
Makes an API call to `POST /favorites` to save a generated tweet. Passes in uid (user id associated with the generated tweet), handle (i.e. @openmessageio), username (Brandless), text, and created_at timestamp.

#### *getFavorites*  
Makes an API call to `GET /favorites` to retrieve all tweets. The tweets are later filtered according to the user that they are assigned to using the tweet uid (in Tweets and Favorites child components).  

#### *deleteFavorite*  
Handling a favorite tweet delete button click and makes an API call to `DELETE /favorites` passing the tweet id.

#### *render*  
The top right userInfo section will be 1 of 3 possibilities:  
1. login form  
2. signup form  
3. 'You are logged in as ...' notification  

The rest is Bootstrap grid formatting with the Tweets and Favorites child components handling the display of fetched and saved tweets, respectively.

## References  
http://www.soliantconsulting.com/blog/2013/02/title-generator-using-markov-chains
