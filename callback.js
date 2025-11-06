// callback.js — works with both simple-oauth2 APIs
module.exports =
  (oauth2, providerName = "github", opts = {}) =>
  async (req, res) => {
    const code = req.query.code;
    if (!code) return res.status(400).send("Missing ?code");

    const redirectUri = process.env.REDIRECT_URL;

    try {
      let access,
        tokenType = "bearer",
        scope = "";

      if (opts.HasAuthCodeClass && typeof oauth2.getToken === "function") {
        // v4/v5
        const result = await oauth2.getToken({
          code,
          redirect_uri: redirectUri,
        });
        const token = result.token || result;
        access = token.access_token;
        tokenType = token.token_type || tokenType;
        scope = token.scope || scope;
      } else {
        // v1–v3
        const result = await oauth2.authorizationCode.getToken({
          code,
          redirect_uri: redirectUri,
        });
        const created = oauth2.accessToken.create(result);
        const token = created.token || created;
        access = token.access_token;
        tokenType = token.token_type || tokenType;
        scope = token.scope || scope;
      }

      const hash =
        "#access_token=" +
        encodeURIComponent(access) +
        "&token_type=" +
        encodeURIComponent(tokenType) +
        "&scope=" +
        encodeURIComponent(scope) +
        "&provider=" +
        encodeURIComponent(providerName);

      return res.redirect("/success" + hash);
    } catch (e) {
      console.error("[oauth-proxy] callback error:", e);
      return res.status(500).send("OAuth error: " + (e.message || e));
    }
  };
