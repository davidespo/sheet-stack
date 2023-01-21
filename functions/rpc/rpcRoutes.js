const { gcp } = require("../utils/log");
const { SheetsClient } = require("../utils/spreadsheets");

const router = require("express").Router();

const cli = new SheetsClient();

router.post("/read", async (req, res) => {
  const { sheetId, range } = req.body;
  try {
    const data = await cli.read(sheetId, range);
    res.status(200).json(data);
  } catch (error) {
    gcp.error(error.message, error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/read", async (req, res) => {
  const { sheetId, range } = req.query;
  try {
    const data = await cli.read(sheetId, range);
    res.status(200).json(data);
  } catch (error) {
    gcp.error(error.message, error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/details", async (req, res) => {
  const { sheetId } = req.query;
  try {
    const data = await cli.sheetDetails(sheetId);
    res.status(200).json(data);
  } catch (error) {
    gcp.error(error.message, error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
