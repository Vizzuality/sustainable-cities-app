function deserialize(data) {
  return data.map((item) => {
    const { attributes, ...props } = item;
    return { ...attributes, ...props };
  });
}

export { deserialize }; // eslint-disable-line import/prefer-default-export
