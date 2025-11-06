module.exports = async (req, res) => {
  try {
    if (!req.query.code) {
      return res.status(400).json({ error: "Missing ?code parameter" });
    }
    return provider.callback(req, res);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
};
