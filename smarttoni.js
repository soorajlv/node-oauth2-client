'use strict';

const createApplication = require('./');
const { ClientCredentials, ResourceOwnerPassword, AuthorizationCode } = require('simple-oauth2');
const randomstring = require("randomstring");
const crypto = require("crypto");
const base64url = require("base64url");

createApplication(({ app, callbackUrl }) => {

  const client = new AuthorizationCode({
    client: {
      id: process.env.CLIENT_ID,
      secret: process.env.CLIENT_SECRET,
    },
    auth: {
      tokenHost: 'http://api-sf5.smarttoni.loc',
      tokenPath: '/auth/token',
      authorizePath: '/auth/authorize',
    },
  });

  //create code challenge and verifier for PKCE grant
  const code_verifier = randomstring.generate(128);
  const base64Digest = crypto
    .createHash("sha256")
    .update(code_verifier)
    .digest("base64");
  const code_challenge = base64url.fromBase64(base64Digest);
  const code_challenge_method = "S256";

  //create state for later verification
  const state = randomstring.generate(32);

  // Authorization uri definition
  const authorizationUri = client.authorizeURL({
    redirect_uri: callbackUrl,
    scope: 'briefing',
    state: state,
    code_challenge: code_challenge,
    code_challenge_method: code_challenge_method
  });

  // Initial page redirecting to Github
  app.get('/login', (req, res) => {
    console.log(authorizationUri);
    res.redirect(authorizationUri);
  });

  // Callback service parsing the authorization token and asking for the access token
  app.get('/auth', async (req, res) => {
    //state checks etc should be done
    const { code } = req.query;
    const options = {
      code,
      redirect_uri: callbackUrl,
      code_verifier
    };

    try {
      const accessToken = await client.getToken(options);

      console.log('The resulting token: ', accessToken.token);
      // should do the app specific settings to save the token, periodically check to refresh the token 
      //if the expiry time is within certain limit etc

      return res.status(200).render('success', { title: 'Result', 'token': accessToken.token });
    } catch (error) {
      console.error('Access Token Error', error.message);
      return res.status(500).render('fail', { title: 'Result', message: error.message, payload: error.data.payload });
    }
  });

  app.get('/', (req, res) => {
    res.render('home', { title: 'Home' })
  });
});