export default {};

export const toBase64 = (file, cb) => {
  const reader = new FileReader();
  reader.onload = (event) => {
    if (cb) cb(event.target.result);
  };
  reader.readAsDataURL(file);
};
