import { dispatch } from 'main';
import { logout } from 'modules/user';

function post({ url, body, headers, onSuccess, onError }) {
  const request = new XMLHttpRequest();
  request.open('POST', url);

  const _headers = { ...headers,
    'Content-Type': 'application/json',
    SC_API_KEY: config.SC_API_KEY
  };

  Object.keys(_headers).forEach((h) => {
    request.setRequestHeader(h, _headers[h]);
  });

  const requestBody = body ? JSON.stringify(body) : undefined;

  request.send(requestBody);

  request.onreadystatechange = () => {
    if (request.readyState === 4) {
      const data = JSON.parse(request.responseText);
      if ([200, 201].includes(request.status)) {
        onSuccess(data);
      } else {
        if (data.errors[0].status === '401') {
          // Log out
          dispatch(logout());
        }
        onError(data);
      }
    }
  };

  return request;
}

function get({ url, headers, onSuccess, onError }) {
  const request = new XMLHttpRequest();
  request.open('GET', url);

  const _headers = { ...headers,
    'Content-Type': 'application/json',
    SC_API_KEY: config.SC_API_KEY,
    Authorization: `Bearer ${localStorage.token}`
  };

  Object.keys(_headers).forEach((h) => {
    request.setRequestHeader(h, _headers[h]);
  });

  request.send();

  request.onreadystatechange = () => {
    if (request.readyState === 4) {
      const data = JSON.parse(request.responseText);
      if (request.status === 200) {
        onSuccess(data);
      } else {
        onError(data);
      }
    }
  };

  return request;
}

export { post, get };