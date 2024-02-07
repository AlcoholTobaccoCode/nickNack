/**
 * 判断数组对象中指定key是否存在空值
 * @param {Array} array 传一个数组对象
 * @param {String} key 需要校验的键
 * @return {Boolean}
 */
function checkEmptyKeyValue(array, key) {
  return array.some(item => !item[key]);
}

const array = [
  { name: 'Alice', age: 25, sex: 0 },
  { name: 'Bob', age: null, sex: null },
  { name: 'Charlie', age: 30, sex: 1 },
];

const array1 = [
  { name: 'Alice', age: 25, sex: 0 },
  { name: 'Bobs', age: '', sex: '' },
  { name: 'Charlie', age: 30, sex: 1 },
];

const hasEmptyAge = checkEmptyKeyValue(array, 'age');
const hasEmptyAge1 = checkEmptyKeyValue(array1, 'age');

console.log(hasEmptyAge); // 输出：true
console.log(hasEmptyAge1); // 输出：true


/**
 * 判断数组对象中多个key是否存在空值
 * @param {Array<Object>} array 传一个数组对象
 * @param {Array<String>} key 需要校验的键
 * @return {Boolean}
 */
function checkEmptyKeyValues(array, keys) {
  return array.some(item => keys.some(key => !item[key]));
}

const array2 = [
  { name: 'Alice', age: 25, city: 'New York' },
  { name: 'Bob', age: null, city: 'Los Angeles' },
  { name: 'Charlie', age: 30, city: '' },
];

const hasEmptyValues = checkEmptyKeyValues(array2, ['age', 'city']);

console.log(hasEmptyValues); // 输出：true

/**
 * 判断数组对象中多个key是否存在空值
 * @param {Array<Object>} array 传一个数组对象
 * @param {Array<String>} key 需要校验的键
 * @return {Number} 空数据索引
 */
function checkEmptyKeyVals(array, keys, type="boolean") {
  return array[type === 'boolean' ? 'some' : 'findIndex'](item => keys.some(key => !item[key]));
}

const array3 = [
  { name: 'Alice', age: 25, city: 'New York' },
  { name: 'Bob', age: 12, city: 'Los Angeles' },
  { name: 'Charlie', age: 30, city: 'City' },
];

const emptyValueIndex = checkEmptyKeyVals(array3, ['age', 'city'], 'number');

console.log(emptyValueIndex); // 输出：1