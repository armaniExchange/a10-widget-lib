import { get } from 'lodash';

import createValidationFuncs from '../../helpers/validations';

export default class Schema {

  constructor(schema) {
    // console.log(schema);
    if (typeof schema == 'string') {
      // require js
      try {
        const schemas = schema.split('.');
        schema = require(schemas[0] + '.json');
        const getSchema = (objectSchema, schemas) => {
          const currentNode = schemas[0];
          if (objectSchema.properties[currentNode]) {
            schemas.shift();
            if (schemas.length) {
              return getSchema(objectSchema.properties[currentNode], schemas);
            } else {
              return objectSchema.properties[currentNode];
            }
          } else {
            return objectSchema;
          }
        };
        schemas.shift();
        schema = getSchema(schema, schemas);
      } catch (e) {
        console.error(e);
      }
    }
    this.schema = schema;
    this.objectFields = schema.properties || {};
  }

  static getAxapiURL(url, urlParams={}) {
    if (url) {
      const path = url.replace(/\{(.*?)\}/g, (matches, words) => { // eslint-disable-line
        if (!urlParams) {
          return '';
        } else {
          return urlParams[words] || '';
        }
      });
      return path;
    } else {
      return '';
    }
  }

  getAxapiURL(urlParams) {
    return Schema.getAxapiURL(this.schema.axapi, urlParams);
  }

  _getFieldName(fieldName) {
    const fieldNameSeg = fieldName.split('.');
    return fieldNameSeg.pop();
  }

  _rebuildFieldName(orgName, name) {
    const fieldNameSeg = orgName.split('.');
    fieldNameSeg.pop();
    fieldNameSeg.push(name);
    return fieldNameSeg.join('.');
  }

  _getFieldProp(fieldName, prop, defaultValue='') {
    const field = this._getFieldName(fieldName);
    return get(this.objectFields, `${field}.${prop}`, defaultValue);
  }

  getConditional(fieldName) {
    const conditional = this._getFieldProp(fieldName, 'condition', '');
    if (conditional) {
      // try see if conditional object exists
      if (this._getFieldProp(conditional, 'type', '') === 'dummy') {
        return false;
      } else {
        return { [ this._rebuildFieldName(fieldName, conditional) ] : true };
      }      
    } else {
      return false;
    }
  }

  getValidations(fieldName) {
    const field = this._getFieldName(fieldName);
    const fieldObj = get(this.objectFields, field);
    let validations = {};
    if (fieldObj) {
      const validationFuncs = createValidationFuncs(fieldObj);
      Object.keys(fieldObj).forEach((key) => {
        if (validationFuncs[key] !== undefined ) {
          validations[key] = validationFuncs[key];
        } else if (key === 'format' && validationFuncs[fieldObj[key]] !== undefined) {
          validations[fieldObj[key]] = validationFuncs[fieldObj[key]];
        }
      });
    }
    return validations;
  }

  getFieldProps(fieldName) {
    const field = this._getFieldName(fieldName);
    const fieldObj = get(this.objectFields, field);
    return fieldObj;
  }

}
