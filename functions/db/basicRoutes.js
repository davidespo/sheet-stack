const { gcp } = require("../utils/log");
const NodeCache = require("node-cache");
const { BasicDatabase } = require("../utils/basicDatabase");

const dbCache = new NodeCache({
  maxKeys: 25,
  stdTTL: 600,
});

const router = require("express").Router();

const getDb = (sheetId, sheetName) => {
  const key = `${sheetId}:${sheetName}`;
  let db = dbCache.get(key);
  if (!db) {
    db = new BasicDatabase(sheetId, sheetName);
    dbCache.set(key, db);
  }
  return db;
};

router.post("/meta", async (req, res) => {
  const { sheetId, sheetName } = req.body;
  const db = getDb(sheetId, sheetName);
  try {
    const data = await db.getMeta();
    res.status(200).json(data);
  } catch (error) {
    gcp.error(error.message, error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/headers", async (req, res) => {
  const { sheetId, sheetName } = req.body;
  const db = getDb(sheetId, sheetName);
  try {
    const data = await db.getHeaders();
    res.status(200).json(data);
  } catch (error) {
    gcp.error(error.message, error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/list", async (req, res) => {
  const { sheetId, sheetName, limit, offset } = req.body;
  const db = getDb(sheetId, sheetName);
  try {
    const data = await db.list({ limit, offset });
    res.status(200).json(data);
  } catch (error) {
    gcp.error(error.message, error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/byId", async (req, res) => {
  const { sheetId, sheetName, id } = req.body;
  const db = getDb(sheetId, sheetName);
  try {
    const data = await db.get(id);
    res.status(200).json(data);
  } catch (error) {
    gcp.error(error.message, error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/byId", async (req, res) => {
  const { sheetId, sheetName, id } = req.query;
  const db = getDb(sheetId, sheetName);
  try {
    const data = await db.get(id);
    res.status(200).json(data);
  } catch (error) {
    gcp.error(error.message, error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/search", async (req, res) => {
  const { sheetId, sheetName, limit, offset, filter, query, sort, sortDesc } =
    req.body;
  const db = getDb(sheetId, sheetName);
  try {
    const data = await db.search({
      limit,
      offset,
      filter,
      query,
      sort,
      sortDesc,
    });
    res.status(200).json(data);
  } catch (error) {
    gcp.error(error.message, error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
