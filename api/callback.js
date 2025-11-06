// callback.js (root) — exchanges ?code and redirects to /success#access_token=...
module.exports =
  (oauth2, providerName = "github") =>
  async (req, res) => {
    const code = req.query.code;
    if (!code) return res.status(400).send("Missing ?code");

    try {
      const result = await oauth2.authorizationCode.getToken({
        code,
        redirect_uri: process.env.REDIRECT_URL,
      });

      const token = oauth2.accessToken.create(result);
      const access = token.token.access_token;
      const tokenType = token.token.token_type || "bearer";
      const scope = token.token.scope || "";

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
