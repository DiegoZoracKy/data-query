(function(expect, describe, it, window) {

	"use strict";

	var arraySource = [{
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
		},
		someInner: {
			date: (new Date(2014))
		}
	}, {
		id: 3,
		deep: {
			obj: {
				veryDeep: 'kz'
			}
		},
		twoWithTheSameValue: 'zk',
		someInner: {
			date: (new Date(2015))
		}
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

	var objectSource = {
		'id1': {
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
		'id2': {
			id: 2,
			deep: {
				obj: {
					veryDeep: 'zk'
				}
			},
			someInner: {
				date: (new Date(2014))
			}
		},
		'id3': {
			id: 3,
			deep: {
				obj: {
					veryDeep: 'kz'
				}
			},
			twoWithTheSameValue: 'zk',
			someInner: {
				date: (new Date(2015))
			}
		},
		'id4': {
			id: 4,
			root: {
				filePDF: {
					url: 'http://file.com'
				}
			}
		},
		'id5': {
			id: 5,
			root: {
				fileDOC: {
					url: 'http://file.com.br'
				}
			}
		}
	};

	describe("dataQuery", function() {

		it("should exist on 'window'", function() {
			expect(window.dataQuery).to.exist;
		});

		describe("Array Source", function() {
			var dataQuery = window.dataQuery;

			it("return should be an Array", function() {
				expect(dataQuery(arraySource, 'id', 1)).to.be.instanceof(Array);
			});

			describe("Searching with a clause which only one object will match", function() {

				it("string/dot notation :: should return only one entry", function() {
					expect(dataQuery(arraySource, 'id', 1).length).to.equal(1);
				});

				it("Object literal :: should return only one entry", function() {
					expect(dataQuery(arraySource, {
						'id': 1
					}).length).to.equal(1);
				});

				it("string/dot notation :: should return object with ID == 1", function() {
					expect(dataQuery(arraySource, 'id', 1)[0].id).to.equal(1);
				});

				it("Object literal notation :: should return object with ID == 1", function() {
					expect(dataQuery(arraySource, {
						id: 1
					})[0].id).to.equal(1);
				});

			});

			describe("Searching with a clause where more than one object will match", function() {

				var objQueriedDotNotation = dataQuery(arraySource, 'twoWithTheSameValue', 'zk');
				var objQueriedObjectLiteral = dataQuery(arraySource, {
					'twoWithTheSameValue': 'zk'
				});

				it("string/dot notation :: should return only two entries", function() {
					expect(objQueriedDotNotation.length).to.equal(2);
				});

				it("Object literal :: should return only two entries", function() {
					expect(objQueriedObjectLiteral.length).to.equal(2);
				});

				it("string/dot notation :: should return the object where 'id' = 3", function() {
					expect(objQueriedDotNotation[1].id).to.equal(3);
				});

				it("string/dot notation :: should return the object where 'id' = 1", function() {
					expect(objQueriedDotNotation[0].id).to.equal(1);
				});

				it("Object literal notation :: should return the object where 'id' = 3", function() {
					expect(objQueriedObjectLiteral[1].id).to.equal(3);
				});

				it("Object literal notation :: should return the object where 'id' = 1", function() {
					expect(objQueriedObjectLiteral[0].id).to.equal(1);
				});

			});

			describe("Searching with more than one clause that needs to match for the same object ( AND )", function() {

				var objQueriedObjectLiteral = dataQuery(arraySource, {
					twoWithTheSameValue: 'zk',
					id: 3
				});

				it("Object literal notation :: should return the object where 'id' = 3", function() {
					expect(objQueriedObjectLiteral[0].id).to.equal(3);
				});

			});

			describe("Searching for a value deep down in the object structure", function() {

				var objQueriedDotNotation = dataQuery(arraySource, 'deep.obj.veryDeep', 'zk');
				var objQueriedObjectLiteral = dataQuery(arraySource, {
					deep: {
						obj: {
							veryDeep: 'zk'
						}
					}
				});

				it("string/dot notation :: should return only one entry", function() {
					expect(objQueriedDotNotation.length).to.equal(1);
				});

				it("Object literal :: should return only one entry", function() {
					expect(objQueriedObjectLiteral.length).to.equal(1);
				});

				it("string/dot notation :: should return the object where 'id' = 2", function() {
					expect(objQueriedObjectLiteral[0].id).to.equal(2);
				});

				it("Object literal :: should return the object where 'id' = 2", function() {
					expect(objQueriedObjectLiteral[0].id).to.equal(2);
				});
			});

			describe("Searching for multiple values for the same property ( OR )", function() {

				var objQueriedDotNotation = dataQuery(arraySource, 'id', [1, 2]);
				var objQueriedObjectLiteral = dataQuery(arraySource, {
					id: [1, 2]
				});

				it("string/dot notation :: should return only two entries", function() {
					expect(objQueriedDotNotation.length).to.equal(2);
				});

				it("Object literal :: should return only one entry", function() {
					expect(objQueriedObjectLiteral.length).to.equal(2);
				});

				it("string/dot notation :: should return the object where 'id' = 1", function() {
					expect(objQueriedDotNotation[0].id).to.equal(1);
				});

				it("Object literal :: should return the object where 'id' = 1", function() {
					expect(objQueriedObjectLiteral[0].id).to.equal(1);
				});

				it("string/dot notation :: should return the object where 'id' = 2", function() {
					expect(objQueriedDotNotation[1].id).to.equal(2);
				});

				it("Object literal :: should return the object where 'id' = 2", function() {
					expect(objQueriedObjectLiteral[1].id).to.equal(2);
				});
			});

			describe("Searching for multiple values deep down in the object structure ( OR )", function() {

				var objQueriedDotNotation = dataQuery(arraySource, 'deep.obj.veryDeep', ['zk', 'kz']);
				var objQueriedObjectLiteral = dataQuery(arraySource, {
					deep: {
						obj: {
							veryDeep: ['zk', 'kz']
						}
					}
				});

				it("string/dot notation :: should return only two entries", function() {
					expect(objQueriedDotNotation.length).to.equal(2);
				});

				it("Object literal :: should return only one entry", function() {
					expect(objQueriedObjectLiteral.length).to.equal(2);
				});

				it("string/dot notation :: should return the object where 'id' = 2", function() {
					expect(objQueriedDotNotation[0].id).to.equal(2);
				});

				it("Object literal :: should return the object where 'id' = 2", function() {
					expect(objQueriedObjectLiteral[0].id).to.equal(2);
				});

				it("string/dot notation :: should return the object where 'id' = 3", function() {
					expect(objQueriedDotNotation[1].id).to.equal(3);
				});

				it("Object literal :: should return the object where 'id' = 3", function() {
					expect(objQueriedObjectLiteral[1].id).to.equal(3);
				});
			});

			describe("RegEx :: Searching for multiple values deep down in the object structure, using RegEx", function() {

				var objQueriedDotNotation = dataQuery(arraySource, 'root./^file*/.url');

				it("string/dot notation :: should return only two entries", function() {
					expect(objQueriedDotNotation.length).to.equal(2);
				});

				it("string/dot notation :: should return the object where 'id' = 4", function() {
					expect(objQueriedDotNotation[0].id).to.equal(4);
				});

				it("string/dot notation :: should return the object where 'id' = 5", function() {
					expect(objQueriedDotNotation[1].id).to.equal(5);
				});
			});

			describe("RegEx :: Using RegEx for property name and value", function() {

				var objQueriedDotNotation = dataQuery(arraySource, 'root./^file*/.url', /\.com\.br/);

				it("string/dot notation :: should return only one entry", function() {
					expect(objQueriedDotNotation.length).to.equal(1);
				});

				it("string/dot notation :: should return the object where 'id' = 5", function() {
					expect(objQueriedDotNotation[0].id).to.equal(5);
				});
			});

			describe("Function as a filter :: Having as a param the value of the property matched.", function() {

				var objQueriedDotNotation = dataQuery(arraySource, 'deep.obj.veryDeep', function(propValue) {
					return propValue.constructor == Array; // e.g. Only the ones whose value is an Array
				});

				it("string/dot notation :: should return only one entry", function() {
					expect(objQueriedDotNotation.length).to.equal(1);
				});

				it("string/dot notation :: should return the object where 'id' = 1", function() {
					expect(objQueriedDotNotation[0].id).to.equal(1);
				});
			});

			describe("Function as a filter :: With the entire object as a param.", function() {

				var objQueriedByFunction = dataQuery(arraySource, function(root) {
					return root.id > 2 && root.id < 5;
				});

				it("Matching id in a specific range (between 2 and 5)", function() {
					expect(objQueriedByFunction.length).to.equal(2);
				});

				it("Should return the object where 'id' = 3", function() {
					expect(objQueriedByFunction[0].id).to.equal(3);
				});

				it("Should return the object where 'id' = 4", function() {
					expect(objQueriedByFunction[1].id).to.equal(4);
				});
			});


			describe("Date Objects as a value to match", function() {

				var objQueriedDotNotation = dataQuery(arraySource, 'someInner.date', (new Date(2015)));
				var objQueriedObjectLiteral = dataQuery(arraySource, {
					someInner: {
						date: (new Date(2015))
					}
				});

				it("string/dot notation :: Match date (new Date(2015)) should return one entry", function() {
					expect(objQueriedDotNotation.length).to.equal(1);
				});

				it("string/dot notation :: Match date (new Date(2015)) should return the object where 'id' = 3", function() {
					expect(objQueriedDotNotation[0].id).to.equal(3);
				});

			});

		});

		describe("Object Literal Source", function() {
			var dataQuery = window.dataQuery;

			it("return should be an Array", function() {
				expect(dataQuery(objectSource, 'id', 1)).to.be.instanceof(Object);
			});

			describe("Searching with a clause which only one object will match", function() {

				it("string/dot notation :: should return only one entry", function() {
					expect(Object.keys(dataQuery(objectSource, 'id', 1)).length).to.equal(1);
				});

				it("Object literal :: should return only one entry", function() {
					expect(Object.keys(dataQuery(objectSource, {
						'id': 1
					})).length).to.equal(1);
				});

				it("string/dot notation :: should return object with ID == 1", function() {
					expect(dataQuery(objectSource, 'id', 1).id1).to.exist;
				});

				it("Object literal notation :: should return object with ID == 1", function() {
					expect(dataQuery(objectSource, {
						id: 1
					}).id1).to.exist;
				});

			});

			describe("Searching with a clause where more than one object will match", function() {

				var objQueriedDotNotation = dataQuery(objectSource, 'twoWithTheSameValue', 'zk');
				var objQueriedObjectLiteral = dataQuery(objectSource, {
					'twoWithTheSameValue': 'zk'
				});

				it("string/dot notation :: should return only two entries", function() {
					expect(Object.keys(objQueriedDotNotation).length).to.equal(2);
				});

				it("Object literal :: should return only two entries", function() {
					expect(Object.keys(objQueriedObjectLiteral).length).to.equal(2);
				});

				it("string/dot notation :: should return the object where 'id' = 3", function() {
					expect(objQueriedDotNotation.id3).to.exist;
				});

				it("string/dot notation :: should return the object where 'id' = 1", function() {
					expect(objQueriedDotNotation.id1).to.exist;
				});

				it("Object literal notation :: should return the object where 'id' = 3", function() {
					expect(objQueriedObjectLiteral.id3).to.exist;
				});

				it("Object literal notation :: should return the object where 'id' = 1", function() {
					expect(objQueriedObjectLiteral.id1).to.exist;
				});

			});

			describe("Searching with more than one clause that needs to match for the same object ( AND )", function() {

				var objQueriedObjectLiteral = dataQuery(objectSource, {
					twoWithTheSameValue: 'zk',
					id: 3
				});

				it("Object literal notation :: should return the object where 'id' = 3", function() {
					expect(objQueriedObjectLiteral.id3).to.exist;
				});

			});

			describe("Searching for a value deep down in the object structure", function() {

				var objQueriedDotNotation = dataQuery(objectSource, 'deep.obj.veryDeep', 'zk');
				var objQueriedObjectLiteral = dataQuery(objectSource, {
					deep: {
						obj: {
							veryDeep: 'zk'
						}
					}
				});

				it("string/dot notation :: should return only one entry", function() {
					expect(Object.keys(objQueriedDotNotation).length).to.equal(1);
				});

				it("Object literal :: should return only one entry", function() {
					expect(Object.keys(objQueriedObjectLiteral).length).to.equal(1);
				});

				it("string/dot notation :: should return the object where 'id' = 2", function() {
					expect(objQueriedObjectLiteral.id2).to.exist;
				});

			});

			describe("Searching for multiple values for the same property ( OR )", function() {

				var objQueriedDotNotation = dataQuery(objectSource, 'id', [1, 2]);
				var objQueriedObjectLiteral = dataQuery(objectSource, {
					id: [1, 2]
				});

				it("string/dot notation :: should return only two entries", function() {
					expect(Object.keys(objQueriedDotNotation).length).to.equal(2);
				});

				it("Object literal :: should return only one entry", function() {
					expect(Object.keys(objQueriedObjectLiteral).length).to.equal(2);
				});

				it("string/dot notation :: should return the object where 'id' = 1", function() {
					expect(objQueriedDotNotation.id1).to.exist;
				});

				it("Object literal :: should return the object where 'id' = 1", function() {
					expect(objQueriedObjectLiteral.id1).to.exist;
				});

				it("string/dot notation :: should return the object where 'id' = 2", function() {
					expect(objQueriedDotNotation.id2).to.exist;
				});

				it("Object literal :: should return the object where 'id' = 2", function() {
					expect(objQueriedObjectLiteral.id2).to.exist;
				});
			});

			describe("Searching for multiple values deep down in the object structure ( OR )", function() {

				var objQueriedDotNotation = dataQuery(objectSource, 'deep.obj.veryDeep', ['zk', 'kz']);
				var objQueriedObjectLiteral = dataQuery(objectSource, {
					deep: {
						obj: {
							veryDeep: ['zk', 'kz']
						}
					}
				});

				it("string/dot notation :: should return only two entries", function() {
					expect(Object.keys(objQueriedDotNotation).length).to.equal(2);
				});

				it("Object literal :: should return only one entry", function() {
					expect(Object.keys(objQueriedObjectLiteral).length).to.equal(2);
				});

				it("string/dot notation :: should return the object where 'id' = 2", function() {
					expect(objQueriedDotNotation.id2).to.exist;
				});

				it("Object literal :: should return the object where 'id' = 2", function() {
					expect(objQueriedObjectLiteral.id2).to.exist;
				});

				it("string/dot notation :: should return the object where 'id' = 3", function() {
					expect(objQueriedDotNotation.id3).to.exist;
				});

				it("Object literal :: should return the object where 'id' = 3", function() {
					expect(objQueriedObjectLiteral.id3).to.exist;
				});
			});

			describe("RegEx :: Searching for multiple values deep down in the object structure, using RegEx", function() {

				var objQueriedDotNotation = dataQuery(objectSource, 'root./^file*/.url');

				it("string/dot notation :: should return only two entries", function() {
					expect(Object.keys(objQueriedDotNotation).length).to.equal(2);
				});

				it("string/dot notation :: should return the object where 'id' = 4", function() {
					expect(objQueriedDotNotation.id4).to.exist;
				});

				it("string/dot notation :: should return the object where 'id' = 5", function() {
					expect(objQueriedDotNotation.id5).to.exist;
				});
			});

			describe("RegEx :: Using RegEx for property name and value", function() {

				var objQueriedDotNotation = dataQuery(objectSource, 'root./^file*/.url', /\.com\.br/);

				it("string/dot notation :: should return only one entry", function() {
					expect(Object.keys(objQueriedDotNotation).length).to.equal(1);
				});

				it("string/dot notation :: should return the object where 'id' = 5", function() {
					expect(objQueriedDotNotation.id5).to.exist;
				});
			});

			describe("Function as a filter :: Having as a param the value of the property matched.", function() {

				var objQueriedDotNotation = dataQuery(objectSource, 'deep.obj.veryDeep', function(propValue) {
					return propValue.constructor == Array; // e.g. Only the ones whose value is an Array
				});

				it("string/dot notation :: should return only one entry", function() {
					expect(Object.keys(objQueriedDotNotation).length).to.equal(1);
				});

				it("string/dot notation :: should return the object where 'id' = 1", function() {
					expect(objQueriedDotNotation.id1).to.exist;
				});
			});

			describe("Function as a filter :: With the entire object as a param.", function() {

				var objQueriedByFunction = dataQuery(objectSource, function(root) {
					return root.id > 2 && root.id < 5;
				});

				it("Matching id in a specific range (between 2 and 5)", function() {
					expect(Object.keys(objQueriedByFunction).length).to.equal(2);
				});

				it("Should return the object where 'id' = 3", function() {
					expect(objQueriedByFunction.id3).to.exist;
				});

				it("Should return the object where 'id' = 4", function() {
					expect(objQueriedByFunction.id4).to.exist;
				});
			});

			describe("Date Objects as a value to match", function() {

				var objQueriedDotNotation = dataQuery(objectSource, 'someInner.date', (new Date(2015)));
				var objQueriedObjectLiteral = dataQuery(objectSource, {
					someInner: {
						date: (new Date(2015))
					}
				});

				it("string/dot notation :: Match date (new Date(2015)) should return one entry", function() {
					expect(Object.keys(objQueriedDotNotation).length).to.equal(1);
				});

				it("string/dot notation :: Match date (new Date(2015)) should return the object where 'id' = 3", function() {
					expect(objQueriedDotNotation.id3).to.exist;
				});

			});

		});

	});

})(chai.expect, describe, it, this);