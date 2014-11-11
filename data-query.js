/**
 * dataQuery
 * Query|Filter a specific Array or Object Literal ("JSON")
 * Based on a filter defined and passed by parameter
 *
 * Usage
 *
 * var objToBeQueried = [
 *   {
 *       id: 1,
 *       deep: {
 *           obj: {
 *               veryDeep: [
 *                   'z',
 *                   'k'
 *               ]
 *           }
 *       },
 *       twoWithTheSameValue: 'zk'
 *   },
 *   {
 *       id: 2,
 *       deep: {
 *           obj: {
 *               veryDeep: 'zk'
 *           }
 *       }
 *   },
 *   {
 *       id: 3,
 *       deep: {
 *           obj: {
 *               veryDeep: 'kz'
 *           }
 *       },
 *       twoWithTheSameValue: 'zk'
 *   }
 * ];
 *
 *
 * Searching with a clause which only one object will match:
 *     dataQuery(objToBeQueried, {id: 1} );
 *     Will return the object {id: 1, ...}
 *
 * Searching with a clause which more than one object will match
 *     dataQuery(objToBeQueried,  {twoWithTheSameValue: 'zk'} );
 *     Will return the objects {id: 1, ...} and {id: 3, ...}
 *
 * Searching with more than one clause
 *     dataQuery(objToBeQueried,  {twoWithTheSameValue: 'zk', id: 3} );
 *     Will return just the object {id: 3, ...}
 *
 * Searching for a value deep down in the object structure
 *     dataQuery(objToBeQueried,  {
 *       deep: {
 *           obj: {
 *               veryDeep: 'zk'
 *           }
 *       }
 *     });
 *     Will return the object {id: 2 ...}
 *
 *
 * Searching for multiple values of the same property
 *     dataQuery(objToBeQueried, { id: [ 1 , 2 ] });
 *     Will return the objects {id: 1 ...} and {id: 2 ...}
 *
 * Searching for multiple values deep down in the object structure
 *     dataQuery(objToBeQueried, {
 *      deep: {
 *          obj: {
 *              veryDeep: ['zk', 'kz']
 *          }
 *      }
 *     });
 *     Will return the object {id: 2 ...} and {id: 3 ...}
 */
var dataQuery = function(dataSrc, filter, modifier) {

    var filterData = function(data, filter) {
        if (!data)
            return;

        if (!filter)
            return data;

        return data.filter(function(value) {
            return seek(value, filter);
        });
    };

    var seek = function(data, filter) {
        var found = true;
        for (var key in filter) {
            if (!data[key])
                return false;

            if (typeof(data[key]) == 'object' && typeof(filter[key]) == 'object') {

                found &= seek(data[key], filter[key]);

            } else if (filter[key] instanceof Array) {

                found &= data[key].indexOf(filter[key]) >= 0;

            } else if (modifier && modifier.constructor == Function) {

                found &= modifier(data[key], filter[key]);

            } else if (modifier && modifier == '*') {

                found &= (data[key].indexOf(filter[key]) >= 0);

            } else {

                found &= (data[key] == filter[key]);
            }
        }
        return found;
    };

    var objToBeQueried = dataSrc;
    if (dataSrc.constructor == Object) {
        var jsonToArray = [];
        for (var key in res)
            jsonToArray[jsonToArray.length] = res[key];
    }

    return filterData(objToBeQueried, filter);
};