// const { gcp } = require("./log");
const NodeCache = require("node-cache");
const { google } = require("googleapis");

const keyFile = process.env.KEY_FILE;

const cache = new NodeCache();

/**
 *
 * @returns {Promise<sheets_v4.Sheets>}
 */
const getSheetsClient = async () => {
  /** @type {sheets_v4.Sheets | null} */
  let sheets = cache.get("sheets");
  if (!sheets) {
    const auth = new google.auth.GoogleAuth({
      keyFile,
      scopes: "https://www.googleapis.com/auth/spreadsheets",
    });
    sheets = google.sheets({
      version: "v4",
      auth: await auth.getClient(),
    });
    cache.set("sheets", sheets);
  }
  return sheets;
};

class SheetsClient {
  constructor() {
    /** @type {Promise<sheets_v4.Sheets>} */
    this.client = getSheetsClient();
  }

  async sheetDetails(spreadsheetId) {
    const sheets = await this.client;
    try {
      const { data } = await sheets.spreadsheets.get({
        includeGridData: false,
        spreadsheetId,
      });
      const {
        properties: { title },
        sheets: sheetSheets,
        spreadsheetUrl,
      } = data;
      return {
        spreadsheetId,
        title,
        sheets: sheetSheets.map(
          ({ properties: { sheetId: id, title, index } }) => ({
            id,
            title,
            index,
          })
        ),
        spreadsheetUrl,
      };
    } catch (error) {
      const message = `Failed to read details of ${spreadsheetId}`;
      //   gcp.error(message + " && " + error.message, error);
      console.error(error);
      throw new Error(message, error);
    }
  }

  async read(spreadsheetId, range) {
    const sheets = await this.client;
    try {
      const { data } = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
      });
      return data;
    } catch (error) {
      const message = `Failed to read values of ${spreadsheetId} @ ${range}`;
      // gcp.error(message + " && " + error.message, error);
      console.error(error);
      throw new Error(message, error);
    }
  }

  async write(spreadsheetId, range, values) {
    const sheets = await this.client;
    try {
      const res = await sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        // The information will be passed according to what the usere passes in as date, number or text
        valueInputOption: "USER_ENTERED",
        resource: {
          values,
        },
      });
      return res;
    } catch (error) {
      const message = `Failed to read values of ${spreadsheetId} @ ${range}`;
      // gcp.error(message + " && " + error.message, error);
      console.error(error);
      throw new Error(message, error);
    }
  }
}

module.exports = {
  SheetsClient,
};

// const sheets = new SheetsClient();
// sheets
//   //   .read("1Y4rJf4kq2DGMvaO9XmSyA5asMWLBd6j-KOuYHDPMO5A", "simple!A1:C2")
//   //   .read("1ePibAnYJuyS4mKtBFTqi_O-_rXjiKjeHonBPTASBkgo", "words!A1:A")
//   //   .sheetDetails("1Y4rJf4kq2DGMvaO9XmSyA5asMWLBd6j-KOuYHDPMO5A")
//   //   .sheetDetails("1ePibAnYJuyS4mKtBFTqi_O-_rXjiKjeHonBPTASBkgo")
//   .write("1Y4rJf4kq2DGMvaO9XmSyA5asMWLBd6j-KOuYHDPMO5A", "simple!A3:C3", [
//     ["API", "Testing", "Testing 123!"],
//   ])
//   .then((data) => console.log(data));
