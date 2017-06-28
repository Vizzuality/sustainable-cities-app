function post({ url, body, headers, onSuccess, onError }) {
  const request = new XMLHttpRequest();
  request.open('POST', url);

  const customHeaders = { ...headers,
    'Content-Type': 'application/json',
    'SC-API-KEY': config['SC-API-KEY']
  };

  Object.keys(customHeaders).forEach((h) => {
    request.setRequestHeader(h, customHeaders[h]);
  });

  const requestBody = body ? JSON.stringify(body) : undefined;

  request.send(requestBody);

  request.onreadystatechange = () => {
    if (request.readyState === 4) {
      const data = JSON.parse(request.responseText);
      if ([200, 201].includes(request.status)) {
        if (onSuccess) onSuccess(data);
      } else {
        if (data.errors[0].status === '401') {
          // Log out
          // dispatch(logout());
        }
        if (onError) onError(data);
      }
    }
  };

  return request;
}

function get({ url, headers, onSuccess, onError }) {
  const request = new XMLHttpRequest();
  request.open('GET', url);

  const customHeaders = { ...headers,
    'Content-Type': 'application/json',
    'SC-API-KEY': config['SC-API-KEY'],
    Authorization: `Bearer ${localStorage.token}`
  };

  Object.keys(customHeaders).forEach((h) => {
    request.setRequestHeader(h, customHeaders[h]);
  });

  request.send();

  request.onreadystatechange = () => {
    if (request.readyState === 4) {
      const data = JSON.parse(request.responseText);
      if (request.status === 200) {
        if (onSuccess) onSuccess(data);
      } else if (onError) {
        onError(data);
      }
    }
  };

  return request;
}

// eslint-disable-next-line no-underscore-dangle
function _delete({ url, headers, onSuccess, onError }) {
  const request = new XMLHttpRequest();
  request.open('DELETE', url);

  const customHeaders = { ...headers,
    'Content-Type': 'application/json',
    'SC-API-KEY': config['SC-API-KEY'],
    Authorization: `Bearer ${localStorage.token}`
  };

  Object.keys(customHeaders).forEach((h) => {
    request.setRequestHeader(h, customHeaders[h]);
  });

  request.send();

  request.onreadystatechange = () => {
    if (request.readyState === 4) {
      const data = JSON.parse(request.responseText);
      if (request.status === 200) {
        if (onSuccess) onSuccess(data);
      } else if (onError) {
        onError(data);
      }
    }
  };

  return request;
}

function patch({ url, headers, body, onSuccess, onError }) {
  const request = new XMLHttpRequest();
  request.open('PATCH', url);

  const customHeaders = { ...headers,
    'Content-Type': 'application/json',
    'SC-API-KEY': config['SC-API-KEY'],
    Authorization: `Bearer ${localStorage.token}`
  };

  Object.keys(customHeaders).forEach((h) => {
    request.setRequestHeader(h, customHeaders[h]);
  });

  const requestBody = body ? JSON.stringify(body) : undefined;

  request.send(requestBody);

  request.onreadystatechange = () => {
    if (request.readyState === 4) {
      const data = JSON.parse(request.responseText);
      if (request.status === 200) {
        if (onSuccess) onSuccess(data);
      } else if (onError) {
        onError(data);
      }
    }
  };

  return request;
}

export { post, get, _delete, patch };
