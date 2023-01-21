# Sheet Stack - Endpoints

## Overview

## Database Documentation

This API provides an abstracton layer on top of a Google spreadsheets. You can
use the basic or full version based on the structure of your spreadsheet. Basic
is the fastest path to get going. You can also find examples and templates listed
in each section.

### Basic Database

#### Examples

- [Users](https://docs.google.com/spreadsheets/d/1Y4rJf4kq2DGMvaO9XmSyA5asMWLBd6j-KOuYHDPMO5A/edit#gid=829405535)

#### `POST /db/list`

| Parameter   | Type     | Description                                                                |
| ----------- | -------- | -------------------------------------------------------------------------- |
| `sheetId`   | `string` | The spreadsheet ID. See below for finding it in the URL.                   |
| `sheetName` | `string` | The sheet name. See below for finding it in the UI.                        |
| `limit`     | `number` | The max number of elements to return in the results. Used for pagination.  |
| `offset`    | `number` | The number of elements to skip before taking results. Used for pagination. |

```shell
curl --request POST \
  --url https://us-central1-sheets-stack.cloudfunctions.net/db/list \
  --header 'content-type: application/json' \
  --data '{
  "sheetId": "1Y4rJf4kq2DGMvaO9XmSyA5asMWLBd6j-KOuYHDPMO5A",
  "sheetName": "users",
  "limit": 5,
  "offset": 0
}'
```

#### `POST /db/search`

You should use `filter` when you have an exact match. Use `query` when you need to use range matching. See the
documentation for the different kinds of matching criteria.

| Parameter   | Type               | Description                                                                                                                      |
| ----------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| `sheetId`   | `string`           | The spreadsheet ID. See below for finding it in the URL.                                                                         |
| `sheetName` | `string`           | The sheet name. See below for finding it in the UI.                                                                              |
| `filter`    | `object`           | A [lodash](https://lodash.com/docs/4.17.15#filter) object used to filter results based on matching criteria.                     |
| `query`     | `object`           | A [lodash-query](https://www.npmjs.com/package/lodash-query#query-api) object used to filter results based on matching criteria. |
| `sort`      | `string, string[]` | A [lodash](https://lodash.com/docs/4.17.15#sortBy) item used to sort results.                                                    |
| `sortDesc`  | `boolean`          | Results are sorted ascending by default. This flag reverses the sort order.                                                      |
| `limit`     | `number`           | The max number of elements to return in the results. Used for pagination.                                                        |
| `offset`    | `number`           | The number of elements to skip before taking results. Used for pagination.                                                       |

```shell
curl --request POST \
  --url https://us-central1-sheets-stack.cloudfunctions.net/db/search \
  --header 'content-type: application/json' \
  --data '{
  "sheetId": "1Y4rJf4kq2DGMvaO9XmSyA5asMWLBd6j-KOuYHDPMO5A",
  "sheetName": "users",
  "query": { "id": { "$gt": 3, "$lte": 5 } },
  "sort": "name",
  "sortDesc": true
}'
```

## Sheets Documentation

#### `https://us-central1-sheets-stack.cloudfunctions.net/api/v1/rpc/`
