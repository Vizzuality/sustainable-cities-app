function isLogged() {
  return !!localStorage.token;
}

export { isLogged }; // eslint-disable-line import/prefer-default-export
