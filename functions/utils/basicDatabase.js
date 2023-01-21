const _ = require("lodash");
require("lodash-query")(_);
const NodeCache = require("node-cache");
const { SheetsClient } = require("./spreadsheets");

const cache = new NodeCache({
  maxKeys: 1000,
  stdTTL: 45,
});

const mapRows = (headers, res, offset) =>
  res.values.map((row, id) => {
    const item = { id: id + offset };
    for (let i = 0; i < headers.length; i++) {
      item[headers[i]] = row[i];
    }
    return item;
  });

/**
 * @typedef BasicListOptions
 * @param {number} limit
 * @param {number} offset
 */

class BasicDatabase {
  constructor(sheetId, sheetName) {
    this.sheetId = sheetId;
    this.sheetName = sheetName;
    this.headersRange = `${this.sheetName}!A1:A`;
    this.cacheHeadersKey = `${sheetId}:${sheetName}:H`;
    this.cacheMetaKey = `${sheetId}:${sheetName}:M`;
    this.cli = new SheetsClient();
  }
  async getHeaders() {
    let headers = cache.get(this.cacheHeadersKey);
    if (!headers) {
      headers = await this.cli.read(this.sheetId, `${this.sheetName}!A1:Z1`);
      cache.set(this.cacheHeadersKey, headers);
    }
    return headers.values[0] ?? [];
  }
  async getMeta() {
    let meta = cache.get(this.cacheMetaKey);
    if (!meta) {
      const details = await this.cli.sheetDetails(this.sheetId);
      const headers = await this.getHeaders();
      meta = {
        ...details,
        tab: this.sheetName,
        headers,
      };
      cache.set(this.cacheMetaKey, meta);
    }
    return meta;
  }
  /**
   *
   * @param {BasicListOptions} options
   * @returns {Array<object>}
   */
  async list(options = {}) {
    const { limit = 10, offset = 0 } = options;
    const headers = await this.getHeaders();
    const range = `${this.sheetName}!A${2 + offset}:Z${2 + offset + limit - 1}`;
    const res = await this.cli.read(this.sheetId, range);
    const data = mapRows(headers, res, offset);
    return data;
  }
  /**
   *
   * @param {object} options
   * @param {number} [options.limit=25]
   * @param {number} [options.offset=0]
   * @param {string[]} [options.sort=[]] https://lodash.com/docs/4.17.15#sortBy
   * @param {boolean} [options.sortDesc=false]
   * @param {object} [options.filter={}] https://lodash.com/docs/4.17.15#filter
   * @param {object} [options.query={}] https://www.npmjs.com/package/lodash-query#query-api
   * @returns
   */
  async search(options = {}) {
    const {
      limit = 25,
      offset = 0,
      sort,
      sortDesc = false,
      filter,
      query,
    } = options;
    const headers = await this.getHeaders();
    const range = `${this.sheetName}!A2:Z1000`;
    const res = await this.cli.read(this.sheetId, range);
    let data = mapRows(headers, res, offset);
    if (_.isArray(sort) || _.isString(sort)) {
      data = _.sortBy(data, sort);
    }
    if (sortDesc) {
      data = data.reverse();
    }
    if (_.isPlainObject(filter)) {
      data = _.filter(data, filter);
    }
    if (_.isPlainObject(query)) {
      data = _.query(data, query);
    }
    if (_.isNumber(offset) && offset > 0) {
      data = _.drop(data, offset);
    }
    if (_.isNumber(limit) && limit > 0) {
      data = _.take(data, limit);
    }
    return data;
  }
  async get(id) {
    const headers = await this.getHeaders();
    const res = await this.cli.read(
      this.sheetId,
      `${this.sheetName}!A${id}:Z${id}`
    );
    const data = mapRows(headers, res, id)[0];
    return data;
  }
}

module.exports = { BasicDatabase };

// const basic = new BasicDatabase(
//   "1Y4rJf4kq2DGMvaO9XmSyA5asMWLBd6j-KOuYHDPMO5A",
//   "users"
// );

// basic
//   // .getMeta()
//   //   .list()
//   //   .list({ limit: 1, offset: 3 })
//   //   .get(2)
//   .search({
//     // limit: 8,
//     // offset: 1,
//     sort: "name",
//     sortDesc: true,
//     query: { id: { $gt: 3, $lte: 5 } },
//   })
//   .then((res) => console.log(res.map(({ id, name }) => `${id}::${name}`)));
