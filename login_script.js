// at the very top of login_script.js (or wherever ORIGINS is validated)
const raw = process.env.ORIGINS || "";
const ORIGINS = raw
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

if (ORIGINS.length === 0) {
  throw new Error(
    "process.env.ORIGINS must include at least one origin (comma-separated if multiple)."
  );
}

// if the rest of the script expects `ORIGINS`, keep using this array
module.exports = { ORIGINS }; // or export nothing if the script uses ORIGINS from closure
