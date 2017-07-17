import Jsona from 'jsona';

export function deserialize(data) {
  return data.map((item) => {
    const { attributes, ...props } = item;
    return { ...attributes, ...props };
  });
}

export function deserializeJsona(data) {
  return deepCamelize((new Jsona()).deserialize(data))
}

export function serializeJsona(data) {
  const j = new Jsona()
  return deepHyphenize(j.serialize(data))
}

const deepKeyTransform = (obj, fn) => {
  if(_.isArray(obj)){
    return obj.map(a => deepKeyTransform(a, fn));
  }
  if(_.isPlainObject(obj)){
    return _.fromPairs(
      _.toPairs(obj).map(([k, v]) => [fn(k), deepKeyTransform(v, fn)])
    )
  }

  return obj
}

const deepCamelize = (obj) => deepKeyTransform(obj, _.camelCase);
const deepHyphenize = (obj) => deepKeyTransform(obj, hyphenize);

const hyphenize = (s) => {
  s.replace(/-(.)/g, (_, l) => l.toUpperCase())
}
