# dataQuery

[![Build Status](https://api.travis-ci.org/DiegoZoracKy/data-query.svg)](https://travis-ci.org/DiegoZoracKy/data-query)

Query / Filter a set of Object Literal (‘JSON’), that could be an Array or Object Literal.

## Installation

### NPM / Node
```javascript
npm install data-query
```

### Bower
```javascript
bower install data-query
```

## Key Features and Goals

* The dataset to be filtered can be an Array of Objects ```[{},{}]``` or a structure of nested Objects ```{ key1: {}, key2: {}, }```

* The filter can be a simple object literal. e.g. ```{ status: 'published', author: 'zk', }```. The properties included on the filter will be treated like an AND clause, so if all the properties match (but not exclusively), the object will be considered found.

* The path of a property to be matched and filtered can be set as a string with a dot notation. e.g. ```'root.level1.level2'```

* The filtering can be based just on the existence of a path of properties ```'root.level1.level2'```, or it can be checked against a value ```'someStringValue'``` or an object representing a filter ```{ status: 'published', author: 'zk', }```

* RegEx is supported for the value to be checked e.g. ```['z', /z/]``` e.g. ```/z|k/```, so you can get an OR clause for the value match

* RegEx also is supported for the name of the properties ```'/^file/'```, even on deep structures ```'root./^file*/.published'```

## Usage / Examples

**Object to be queried / filtered:**

```javascript

var objToBeQueried = [{
    id: 1,
    deep: {
        obj: {
            veryDeep: [
                'z',
                'k'
            ]
        }
    },
    twoWithTheSameValue: 'zk'
}, {
    id: 2,
    deep: {
        obj: {
            veryDeep: 'zk'
        }
    }
}, {
    id: 3,
    deep: {
        obj: {
            veryDeep: 'kz'
        }
    },
    twoWithTheSameValue: 'zk'
}, {
    id: 4,
    root: {
        filePDF: {
            url: 'http://file.com'
        }
    }
}, {
    id: 5,
    root: {
        fileDOC: {
            url: 'http://file.com.br'
        }
    }
}];

```

**Searching with a clause which only one object will match:**
```javascript

	dataQuery(objToBeQueried, 'id', 1);

  	// or by using an Object Literal as a search clause
	dataQuery(objToBeQueried, {id: 1});
```
The result will be:
```javascript
	  {id: 1, ...}
```

**Searching with a clause where more than one object will match**
```javascript
	dataQuery(objToBeQueried,  'twoWithTheSameValue', 'zk');

	// or by using an Object Literal as a search clause
	dataQuery(objToBeQueried,  {twoWithTheSameValue: 'zk'});
```
The return will be these two objects:
```javascript
	  {id: 1, ...} and {id: 3, ...}
```

**Searching with more than one clause that needs to match for the same object ( AND )**
```javascript
	  dataQuery(objToBeQueried,  {twoWithTheSameValue: 'zk', id: 3});
```
The result will be just the object:
```javascript
	  [{id: 3, ...}]
```

**Searching for a value deep down in the object structure**
```javascript

	dataQuery(objToBeQueried, 'deep.obj.veryDeep', 'zk');

	// or by using an Object Literal as a search clause
	dataQuery(objToBeQueried,  {
		deep: {
			obj: {
				veryDeep: 'zk'
			}
		}
	});
```
result:
```javascript
	  [{id: 2, ...}]
```

**Searching for multiple values for the same property ( OR )**
*OBS: "OR clause" using array as a value will be deprecated soon. Use RegEx as shown in the next case*
```javascript

	dataQuery(objToBeQueried, 'id',  [ 1 , 2 ]);

	// or by using an Object Literal as a search clause
	dataQuery(objToBeQueried, { id: [ 1 , 2 ] });
```
result:
```javascript
	  [{id: 1, ...}, {id: 2, ...}]
```

**RegEx :: Searching for multiple values deep down in the object structure, using RegEx**
```javascript
	dataQuery(objToBeQueried, 'deep.obj.veryDeep', /z|k/);
```
result:
```javascript
	  [{id: 1, ...}, {id: 2, ...}, {id: 3, ...}]
```

**RegEx :: Searching for multiple values deep down in the object structure, using RegEx**
```javascript
	dataQuery(objToBeQueried, 'root./^file*/.url');
```
result:
```javascript
	  [{id: 4, ...}, {id: 5, ...}]
```

**RegEx :: Using RegEx for property name and value**
```javascript
	dataQuery(objToBeQueried, 'root./^file*/.url', /\.com\.br/);
```
result:
```javascript
	  [{id: 5, ...}]
```

**Function as a filter :: Having as a param the value of the property matched.**
```javascript
	dataQuery(objToBeQueried, 'deep.obj.veryDeep', function(propValue){
	    return propValue.constructor == Array; // e.g. Only the ones whose value is an Array
	});
```
result:
```javascript
	  [{id: 1, ...}]
```

**Function as a filter :: With the entire object as a param.**
```javascript
	dataQuery(objToBeQueried,  function(v){
   		return v.id > 2 && v.id < 5; // e.g. Matching id in a specific range
	});
```
result:
```javascript
	  [{id: 3, ...}, {id: 4, ...}]
```



