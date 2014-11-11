# dataQuery

Query|Filter a specific Array or Object Literal ('JSON').

## Usage / Examples

```javascript
var objToBeQueried = [
    {
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
    },
    {
        id: 2,
        deep: {
            obj: {
                veryDeep: 'zk'
            }
        }
    },
    {
        id: 3,
        deep: {
            obj: {
                veryDeep: 'kz'
            }
        },
        twoWithTheSameValue: 'zk'
    }
  ];
```
Searching with a clause which only one object will match:
```javascript
      dataQuery(objToBeQueried, {id: 1} );
```
The result will be:
```javascript
      {id: 1, ...}
```
Searching with a clause which more than one object will match
```javascript
      dataQuery(objToBeQueried,  {twoWithTheSameValue: 'zk'} );
```
Will return the objects
```javascript
      {id: 1, ...} and {id: 3, ...}
```
Searching with more than one clause
```javascript
      dataQuery(objToBeQueried,  {twoWithTheSameValue: 'zk', id: 3} );
```
The result will be just the object:
```javascript
      [{id: 3, ...}]
```
  Searching for a value deep down in the object structure
```javascript
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
      [{id: 2 ...}]
```
  Searching for multiple values for the same property
```javascript
      dataQuery(objToBeQueried, { id: [ 1 , 2 ] });
```
result:
```javascript
      [{id: 1 ...}, {id: 2 ...}]
```
Searching for multiple values deep down in the object structure
```javascript
      dataQuery(objToBeQueried, {
       deep: {
           obj: {
               veryDeep: ['zk', 'kz']
           }
       }
      });
```
result:
```javascript
      [{id: 2 ...}, {id: 3 ...}]
```

