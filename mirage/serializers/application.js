import { JSONAPISerializer } from 'miragejs';
import { camelize } from '@ember/string';

const PAGE_SIZE = 20;

export default JSONAPISerializer.extend({
  keyForAttribute(attr /*, method*/) {
    return camelize(attr);
  },

  // Determines whether the data is an array.
  _isDataCollection(json) {
    return json.data && Array.isArray(json.data);
  },

  // Creates the page metadata
  _createPageMeta(data, request) {
    let count = 0;

    if (data && data.length > 0) {
      count = data.length;
    }

    let pageNumber = 1;
    let pageSize = PAGE_SIZE;

    if (request && request.queryParams) {
      pageNumber = this._getPageNumber(request.queryParams);
      pageSize = this._getPageSize(request.queryParams);
    }

    return {
      page: {
        number: pageNumber,
        size: pageSize,
        total: count === 0 ? 1 : Math.ceil(count / pageSize),
        totalResults: count,
      },
    };
  },

  // Gets a specific page of data from the model
  _paginateModel(data, request) {
    if (!data || data.length === 0) {
      return data;
    }

    let pageNumber = 1;
    let pageSize = PAGE_SIZE;

    if (request && request.queryParams) {
      pageNumber = this._getPageNumber(request.queryParams);
      pageSize = this._getPageSize(request.queryParams);
    }

    if (!pageNumber) {
      return data;
    }

    let start = (pageNumber - 1) * pageSize;
    let end = start + pageSize;

    if (start < 0) {
      start = 0;
    }

    if (end >= data.length) {
      end = data.length;
    }

    return data.slice(start, end);
  },

  // Gets the requested page number
  _getPageNumber(queryParams) {
    return queryParams['page[number]'] ? parseInt(queryParams['page[number]']) : 1;
  },

  // Gets the requested page size
  _getPageSize(queryParams) {
    return queryParams['page[size]'] ? parseInt(queryParams['page[size]']) : PAGE_SIZE;
  },
});
