module.exports = (req, res) => {
  res.setHeader("content-type", "application/json");
  const raw = process.env.ORIGINS || "";
  const parsed = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  res.end(
    JSON.stringify(
      {
        ORIGINS: raw,
        parsed,
        hasClientId: !!process.env.OAUTH_CLIENT_ID,
        environment: process.env.VERCEL_ENV,
      },
      null,
      2
    )
  );
};
