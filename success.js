// success.js — post token to opener, then close; also try redirect if no opener.
module.exports = (req, res) => {
  const html = `<!doctype html><meta charset="utf-8"><title>Authorized</title>
    <p>You are being redirected to the authorized application…</p>
    <script>
      (function () {
        // Hash contains: access_token=...&token_type=...&scope=...
        var hash = (location.hash || '').slice(1);
        var msg  = 'authorization:github:' + hash;
  
        function send() {
          try {
            if (window.opener && !window.opener.closed) {
              // Prefer exact origin to be strict; '*' also works
              window.opener.postMessage(msg, 'https://keamarg.github.io');
              window.close();
              return true;
            }
          } catch (e) {}
          return false;
        }
  
        if (!send()) {
          // If no opener (wasn't a popup), try to send via BroadcastChannel (modern browsers)
          try {
            var bc = new BroadcastChannel('decap-auth');
            bc.postMessage(msg);
            // try to bounce the user to the admin page
            location.replace('https://keamarg.github.io/AiA/admin/');
          } catch (e) {
            // Final fallback: show the payload for manual copy
            document.body.innerHTML =
              '<pre>' + msg + '</pre><p>Copy this into the app console if the window did not close.</p>';
          }
        }
      })();
    </script>`;
  res.setHeader("content-type", "text/html; charset=utf-8");
  res.end(html);
};
