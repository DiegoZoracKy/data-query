var dataQuery = (function() {
    'use strict';

    return function(dataSrc, filter, modifier) {

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
            for (var key in dataSrc) {
                jsonToArray[jsonToArray.length] = dataSrc[key];
            }
            objToBeQueried = jsonToArray;
        }

        return filterData(objToBeQueried, filter);
    };

}());

if (typeof module !== 'undefined') {
    module.exports = dataQuery;
}
