// index.js — dual-compat for simple-oauth2 v1–3 (create) and v4–5 (AuthorizationCode)
console.log("[oauth-proxy] index.js loaded v3");

const oauthLib = require("simple-oauth2");
const authMiddleWareInit = require("./auth.js");
const callbackMiddleWareInit = require("./callback");

const oauthProvider = process.env.OAUTH_PROVIDER || "github";

// Detect API shape
const HasAuthCodeClass = !!oauthLib.AuthorizationCode;

const oauthConfig = {
  client: {
    id: process.env.OAUTH_CLIENT_ID,
    secret: process.env.OAUTH_CLIENT_SECRET,
  },
  auth: {
    tokenHost: process.env.GIT_HOSTNAME || "https://github.com",
    tokenPath: process.env.OAUTH_TOKEN_PATH || "/login/oauth/access_token",
    authorizePath: process.env.OAUTH_AUTHORIZE_PATH || "/login/oauth/authorize",
  },
};

let oauth2;
if (HasAuthCodeClass) {
  // v4/v5 API
  console.log("[oauth-proxy] using simple-oauth2 AuthorizationCode API");
  const { AuthorizationCode } = oauthLib;
  oauth2 = new AuthorizationCode(oauthConfig);
} else {
  // v1–v3 API
  console.log("[oauth-proxy] using simple-oauth2 legacy create() API");
  oauth2 = oauthLib.create(oauthConfig);
}

function indexMiddleWare(req, res) {
  res.send(`Hello<br>
    <a href="/auth" target="${process.env.AUTH_TARGET || "_self"}">
      Log in with ${oauthProvider.toUpperCase()}
    </a>`);
}

module.exports = {
  auth: authMiddleWareInit(oauth2),
  callback: callbackMiddleWareInit(oauth2, oauthProvider, { HasAuthCodeClass }),
  success: require("./success"),
  index: indexMiddleWare,
};
