export default function plainObject(object, pathParam) {
  let path = '';
  if (pathParam) {
    path = pathParam;
  }
  return Object.keys(object).reduce((prev, next) => {
    if (typeof object[next] !== 'object' || Array.isArray(object[next])) {
      prev[path + next] = object[next]; // eslint-disable-line no-param-reassign
      return prev;
    }
    const plainObj = plainObject(object[next], `${path}${next}.`);
    Object.keys(plainObj).forEach((key) => {
      prev[key] = plainObj[key]; // eslint-disable-line no-param-reassign
    });
    return prev;
  }, {});
}
