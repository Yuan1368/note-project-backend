const average = require("../utils/for_testing").average;

describe("average", ()=>{
	test("of many is calculated right", ()=>{
		expect(average([1,2,3,4,5])).toBe(2.5)
	})

	test("of empty arry is zero", ()=>{
		expect(average([])).toBe(0)
	})

	test("of a special array is calculated right", ()=>{
		expect(average([1,2,3,4])).toBe(2.5)
	})
})