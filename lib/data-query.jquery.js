/**
 * Query Data queryData
 * Query|Filter a specific Array or Object Literal ("JSON")
 * Based on a filter defined and passed as a parameter
 * Can go deep in the structure
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
 *     $(objToBeQueried).queryData( {id: 1} );
 *     Will return the object {id: 1, ...}
 *
 * Searching with a clause which more than one object will match
 *     $(objToBeQueried).queryData( {twoWithTheSameValue: 'zk'} );
 *     Will return the objects {id: 1, ...} and {id: 3, ...}
 *
 * Searching with more than one clause
 *     $(objToBeQueried).queryData( {twoWithTheSameValue: 'zk', id: 3} );
 *     Will return just the object {id: 3, ...}
 *
 * Searching for a value deep down in the object structure
 *     $(objToBeQueried).queryData( {
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
 *     $(objToBeQueried).queryData({ id: [ 1 , 2 ] });
 *     Will return the objects {id: 1 ...} and {id: 2 ...}
 *
 * Searching for multiple values deep down in the object structure
 *     $(objToBeQueried).queryData({
 *      deep: {
 *          obj: {
 *              veryDeep: ['zk', 'kz']
 *          }
 *      }
 *     });
 *     Will return the object {id: 2 ...} and {id: 3 ...}
 */
$.queryData = function(dataSrc, filter, modifier){

    var queryJson = function(data, filter){
        if(!data)
            return;

        if(!filter)
            return data;

        return $(data).filter(function () {
            return seek(this, filter);
        });
    };

    var seek = function(data, filter){
        var found = true;
        for (var key in filter){
            if(typeof(data[key]) == 'object' && typeof(filter[key]) == 'object'){

                found &= seek(data[key], filter[key]);

            } else if($.isArray(filter[key])){

                found &= $.inArray(data[key], filter[key]) >= 0;

            } else if(modifier && $.isFunction(modifier)){

                found &= modifier(data[key], filter[key]);

            } else if(modifier && modifier == '*'){

                found &= (data[key].indexOf(filter[key]) >= 0)

            }else{

                found &= (data[key] == filter[key]);
            }
        }
        return found;
    };

    var objToBeQueried = dataSrc;

    if($.isPlainObject(dataSrc)){
        var jsonToArray = [];
        var i=0;
        for (var key in dataSrc) {
            dataSrc[key]._jsonKey = key;
            jsonToArray[i++] = dataSrc[key];
        }
        objToBeQueried = jsonToArray;
    }

    return queryJson(objToBeQueried, filter);
};