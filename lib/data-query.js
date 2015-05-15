/**
 * Query / Filter a set of Object Literal (‘JSON’), that could be an Array or Object Literal.
 *
 * @author Diego ZoracKy, @diegozoracky, http://diegozoracky.com
 *
 * @param   {Array | Object Literal}    dataSrc - Dataset do be filtered / queried
 * @param   {String | Object Literal}   filter - Properties path to be checked
 * @param   {String | Object Literal | RegEx}   filterValue - Value to be checked against the properties path
 * @return  {Array | Object Literal}    Dataset Filtered
 */
var dataQuery = (function() {
    'use strict';

    return function(dataSrc, filter, filterValue) {
        return filterData(dataSrc, filter, filterValue);
    };

    function objectToArray(objectSrc, registerObjectKey) {
        var arrayFromObject = [];
        for (var key in objectSrc) {
            arrayFromObject.push(objectSrc[key]);
            if (registerObjectKey)
                arrayFromObject[arrayFromObject.length - 1]._rootKey = key;
        }

        return arrayFromObject;
    }

    function filterData(data, filter, filterValue) {
        if (!data || !filter)
            return;

        if (data.constructor == Array) {
            return data.filter(function(value) {
                return seek(value, filter, filterValue);
            });
        }

        if (data.constructor == Object) {
            var objectDataFiltered = {};

            data = objectToArray(data, true);
            data = data.filter(function(value) {
                return seek(value, filter, filterValue);
            });

            for (var k in data) {
                objectDataFiltered[data[k]._rootKey] = data[k];
                delete objectDataFiltered[data[k]._rootKey]._rootKey;
            }

            return objectDataFiltered;
        }
    }

    function checkValue(srcValue, filterValue) {
        if (srcValue === undefined || filterValue === undefined)
            return false;

        if (srcValue.constructor == Array && filterValue.constructor == Array) {
            return filterValue.some(function(v) {
                if (v.constructor == RegExp) {
                    return srcValue.some(function(srcVl) {
                        return srcVl.match(v);
                    });
                } else {
                    return srcValue.indexOf(v) >= 0;
                }
            });
        } else if (srcValue.constructor == Array) {
            return srcValue.some(function(v) {
                return (filterValue.constructor == RegExp) ? v.match(filterValue) : filterValue == v;
            });

        } else if (filterValue.constructor == Array) {
            return filterValue.some(function(v) {
                return (v.constructor == RegExp) ? srcValue.match(v) : srcValue == v;
            });

        } else {
            return (filterValue.constructor == RegExp) ? srcValue.match(filterValue) : srcValue == filterValue;
        }
    }

    function seek(data, filter, value) {
        if (filter.constructor == String) {
            if (typeof(value) != 'undefined')
                return checkValue(getPropertyByDot(data, filter), value);
            else {
                return typeof(getPropertyByDot(data, filter)) != 'undefined';
            }
        }

        if (filter.constructor == Object) {
            for (var key in filter) {
                if (key.match(/\./))
                    return checkValue(getPropertyByDot(data, key), filter[key]);

                else if (data[key] && data[key].constructor == Object && filter[key].constructor == Object)
                    return seek(data[key], filter[key]);

                else
                    return checkValue(data[key], filter[key]);
            }
        }
    }

    function getPropertyByDot(obj, str) {
        str.split('.').forEach(function(property) {
            if (!obj)
                return;

            var propertyRegEx = property.match(/^\/(.*)\/$/);
            if (propertyRegEx)
                property = new RegExp(propertyRegEx[1], 'gi');

            if (property.constructor == RegExp) {
                Object.keys(obj).forEach(function(k) {
                    if (k.match(property))
                        obj = obj[k];
                });
            } else {
                obj = obj[property];
            }
        });

        return obj;
    }
}());

if (typeof module !== 'undefined')
    module.exports = dataQuery;