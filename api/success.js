// success.js (root)
module.exports = (req, res) => {
  // The callback should have redirected here with the token in the hash,
  // e.g. /success#access_token=...&token_type=bearer&scope=repo
  // We forward that hash to the opener (Decap CMS) and close the window.
  const html = `<!doctype html>
  <html>
    <head><meta charset="utf-8"><title>Authorized</title></head>
    <body>
      <p>You are being redirected to the authorized application…</p>
      <script>
        (function () {
          // Forward the URL hash to the opener. Decap expects "authorization:github:{...}"
          var hash = (window.location.hash || '').slice(1); // without the leading '#'
          var message = 'authorization:github:' + hash;
  
          try {
            if (window.opener && !window.opener.closed) {
              // Allow any origin that opened us; your proxy already restricts origins server-side.
              window.opener.postMessage(message, '*');
              window.close();
            } else {
              // Fallback: leave the payload on screen if it's not a popup
              document.body.innerHTML = '<pre>' + message + '</pre><p>Copy this back to the app if this window did not close automatically.</p>';
            }
          } catch (e) {
            console.error(e);
            document.body.innerHTML = '<p>Authentication succeeded, but automatic redirect failed. You can close this window.</p>';
          }
        })();
      </script>
    </body>
  </html>`;
  res.setHeader("content-type", "text/html; charset=utf-8");
  res.send(html);
};
