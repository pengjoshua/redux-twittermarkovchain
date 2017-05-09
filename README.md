# twitter-markov-chain
A Markov chain generator app using user tweets. Made with React, Express, and Twitter API.

## Challenge  

We’d like you to build a Markov chain generator (https://en.wikipedia.org/wiki/Markov_chain). You can use any tools you wish, including any libraries or languages.  

Our only restriction is that the chain must be generated based on the tweets of any Twitter user. As a stretch goal we’d also like the ability to enter any Twitter username and see a generated Markov chain.

## Overview  

For this project, I used a mathematical structure called a Markov chain to model the statistical likelihood of a word in a tweet being followed by some other word in a tweet. I use this statistical information to generate new custom tweets by choosing the first word (at random) and then choosing subsequent words with a frequency proportional to how those words are arranged in the original text. This process will give me a string of text that may not be in the original text, but will share stylistic properties of the original text.

## Steps

First, I created a Twitter Developers account and gathered the `consumer_key`, `consumer_secret`, `access_token_key`, and `access_token_secret` in order to request data from the Twitter API (please replace with your own keys and secrets in `server/app.js`). To start, the app requests 25 (or a specified amount) user tweets using the Twitter API (`GET statuses/user_timeline`) with Axios with the username and count in the request parameters. Then, the app constructs a list of unique words that appear in these tweets. Next, for each word in this list, the app counts which words follow that word and with which frequency. Any text generated from this corpus maintains the same statistical properties.

## Technologies  

- React
- React-Bootstrap
- Node
- Express
- Axios
- Bluebird
- Twitter API

## Setup  

- Clone the repository or download and extract the project zip file
- Open a new terminal window/tab and navigate to the root of the project
- To install the dependencies, run `npm i` from the root of the project
- Additionally, run `npm i` from both the `client` folder and `server` folder
- Install `nodemon` for instant reloading by running `npm i -g nodemon`
- To start the server and simultaneously start the client, run `npm start` from the root directory
    - Open a browser and navigate to [http://localhost:3000](http://localhost:3000)
    - (To stop the server, hit `ctrl+c` in the terminal window)
- To run the Mocha/Chai unit tests, run `npm test`
    - (Stop the server before running tests, server cannot be running at the same time)

## Testing
- To run unit tests, run `npm test` from the root of the project in a terminal window

## References  
http://www.soliantconsulting.com/blog/2013/02/title-generator-using-markov-chains
