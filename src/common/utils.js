export const formatDate = gmt => {
  let date = new Date(gmt)
  let m = (date.getMonth() + 1), mm = '-' + (m < 10 ? '0' + m : m)
  let d = date.getDate(), dd = '-' + (d < 10 ? '0' + d : d)
  let h = date.getHours(), hh = ' ' +(h < 10 ? '0' + h : h)
  let i = date.getMinutes(), ii = ':' +(i < 10 ? '0' + i : i)
  let s = date.getSeconds(), ss = ':' +(s < 10 ? '0' + s : s)
  return date.getFullYear() + mm + dd + hh + ii + ss
}

export const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function oneTick(ms) {
  await sleep(ms)
}

export function deepCopy(data) {
  if(typeof data !== 'object' || data === null){
    throw new TypeError('传入参数不是对象')
  }
  let newData = {};
  const dataKeys = Object.keys(data);
  dataKeys.forEach(value => {
    const currentDataValue = data[value];
    // 基本数据类型的值和函数直接赋值拷贝
    if (typeof currentDataValue !== "object" || currentDataValue === null) {
      newData[value] = currentDataValue;
    } else if (Array.isArray(currentDataValue)) {
      // 实现数组的深拷贝
      newData[value] = [...currentDataValue];
    } else if (currentDataValue instanceof Set) {
      // 实现set数据的深拷贝
      newData[value] = new Set([...currentDataValue]);
    } else if (currentDataValue instanceof Map) {
      // 实现map数据的深拷贝
      newData[value] = new Map([...currentDataValue]);
    } else {
      // 普通对象则递归赋值
      newData[value] = deepCopy(currentDataValue);
    }
  });
  return newData;
}
