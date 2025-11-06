// index.js
const { AuthorizationCode } = require("simple-oauth2");
const authMiddleWareInit = require("./auth.js");
const callbackMiddleWareInit = require("./callback");

const oauthProvider = process.env.OAUTH_PROVIDER || "github";

const oauth2 = new AuthorizationCode({
  client: {
    id: process.env.OAUTH_CLIENT_ID,
    secret: process.env.OAUTH_CLIENT_SECRET,
  },
  auth: {
    // For GitHub (or GH Enterprise via GIT_HOSTNAME)
    tokenHost: process.env.GIT_HOSTNAME || "https://github.com",
    tokenPath: process.env.OAUTH_TOKEN_PATH || "/login/oauth/access_token",
    authorizePath: process.env.OAUTH_AUTHORIZE_PATH || "/login/oauth/authorize",
  },
});

function indexMiddleWare(req, res) {
  res.send(`Hello<br>
    <a href="/auth" target="${process.env.AUTH_TARGET || "_self"}">
      Log in with ${oauthProvider.toUpperCase()}
    </a>`);
}

module.exports = {
  auth: authMiddleWareInit(oauth2),
  callback: callbackMiddleWareInit(oauth2, oauthProvider),
  success: require("./success"),
  index: indexMiddleWare,
};
