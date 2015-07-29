/**
 * Query / Filter a set of Object Literal (‘JSON’), that could be an Array or Object Literal.
 *
 * @author Diego ZoracKy, @diegozoracky, http://diegozoracky.com
 *
 * @param   {Array | Object Literal}    dataSrc - Dataset do be filtered / queried
 * @param   {String | Object Literal | Function}   filter - Properties path to be checked
 * @param   {String | Object Literal | RegEx}   filterValue - Value to be checked against the properties path
 * @return  {Array | Object Literal}    Dataset Filtered
 */
var dataQuery = (function() {
    'use strict';

    return function dataQuery(dataSrc, filter, filterValue, compareObjects) {
        return filterData(dataSrc, filter, filterValue, compareObjects);
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

    function filterData(data, filter, filterValue, compareObjects) {
        if (!data || !filter)
            return;

        if (data.constructor == Array) {
            return data.filter(function(value) {
                return (filter.constructor == Function) ? filter(value) : seek(value, filter, filterValue, compareObjects);
            });
        }

        if (data.constructor == Object) {
            var objectDataFiltered = {};

            data = objectToArray(data, true);
            data = data.filter(function(value) {
                return (filter.constructor == Function) ? filter(value) : seek(value, filter, filterValue, compareObjects);
            });

            for (var k in data) {
                objectDataFiltered[data[k]._rootKey] = data[k];
                delete objectDataFiltered[data[k]._rootKey]._rootKey;
            }

            return objectDataFiltered;
        }
    }

    function checkValue(srcValue, filterValue, compareObjects) {
        if (srcValue === undefined || filterValue === undefined)
            return false;

        if (filterValue.constructor == Function) {

            return filterValue(srcValue);

        } else if (srcValue.constructor == Array && filterValue.constructor == Array) {

            if (srcValue.length != filterValue.length)
                return false;

            srcValue.sort();
            filterValue.sort();

            return srcValue.every(function(value, i) {
                return value === filterValue[i];
            });

        } else if (srcValue.constructor == Array) {

            return srcValue.some(function(v) {
                return (filterValue.constructor == RegExp) ? !!v.toString().match(filterValue) : filterValue == v;
            });

        } else if (filterValue.constructor == Array) {

            return filterValue.some(function(v) {
                return (v.constructor == RegExp) ? !!srcValue.toString().match(v) : srcValue == v;
            });

        } else if (filterValue.constructor == Object && srcValue.constructor == Object) {
            if (compareObjects)
                return equalObjects(srcValue, filterValue, '_rootKey');
            else
                return seek(srcValue, filterValue);
        } else {
            return (filterValue.constructor == RegExp) ? !!srcValue.toString().match(filterValue) : srcValue == filterValue;
        }
    }

    function seek(data, filter, value, compareObjects) {
        var found = true;
        if (filter.constructor == String) {
            if (typeof(value) != 'undefined')
                return checkValue(getPropertyByDot(data, filter), value, compareObjects);
            else
                return typeof(getPropertyByDot(data, filter)) != 'undefined';
        }

        if (filter.constructor == Object && (compareObjects || value)) {
            for (var key in data)
                found &= equalObjects(data, filter, '_rootKey');

        } else if (filter.constructor == Object) {
            for (var key in filter) {
                if (key.match(/\./))
                    found &= checkValue(getPropertyByDot(data, key), filter[key], compareObjects);

                else if (data[key] && data[key].constructor == Object && filter[key].constructor == Object)
                    found &= seek(data[key], filter[key]);

                else
                    found &= checkValue(data[key], filter[key], compareObjects);
            }
        }
        return found;
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

    function equalObjects(obj1, obj2, discardKeys) {
        if (obj1 === obj2)
            return true;

        if ((!obj1 || !obj2) || (typeof obj1 !== 'object') || (typeof obj1 !== typeof obj2))
            return false;

        if (obj1.constructor === Date && obj2.constructor === Date && obj1.getTime() === obj2.getTime())
            return true;

        if (obj1.constructor === Array && obj2.constructor === Array && obj1.length === obj2.length) {
            var obj1Sorted = (obj1.slice(0, obj1.length)).sort();
            var obj2Sorted = (obj2.slice(0, obj2.length)).sort();
            for (var i = 0; i < obj1Sorted.length; i++)
                if (!equalObjects(obj1Sorted[i], obj2Sorted[i], discardKeys))
                    return false;

            return true;
        }

        if (!discardKeys && Object.keys(obj1).length !== Object.keys(obj2).length)
            return false;

        if (discardKeys && discardKeys.constructor !== Array)
            discardKeys = [discardKeys];

        for (var k1 in obj1) {
            if (discardKeys && discardKeys.indexOf(k1) >= 0)
                continue;

            if (!equalObjects(obj1[k1], obj2[k1], discardKeys))
                return false;
        }

        for (var k2 in obj2) {
            if (discardKeys && discardKeys.indexOf(k2) >= 0)
                continue;

            if (!(k2 in obj1))
                return false;
        }

        return true;
    }
}());

if (typeof module !== 'undefined')
    module.exports = dataQuery;