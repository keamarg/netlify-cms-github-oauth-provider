// success.js
module.exports = (req, res) => {
  const html = `<!doctype html><meta charset="utf-8"><title>Authorized</title>
    <p>You are being redirected to the authorized application…</p>
    <script>
      (function () {
        var hash = (location.hash || '').slice(1);
        var msg = 'authorization:github:' + hash;
        try {
          if (window.opener && !window.opener.closed) {
            window.opener.postMessage(msg, '*');
            window.close();
          } else {
            document.body.innerHTML =
              '<pre>'+msg+'</pre><p>Copy this back to the app if this window did not close automatically.</p>';
          }
        } catch (e) {
          console.error(e);
          document.body.innerHTML =
            '<p>Authentication succeeded, but automatic redirect failed. You can close this window.</p>';
        }
      })();
    </script>`;
  res.setHeader("content-type", "text/html; charset=utf-8");
  res.end(html);
};
