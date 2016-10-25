const makeRequest = (method,url, body) => {
  const jsonToQueryString = (json) => {
    return '?' +
    Object.keys(json).map(function(key) {
      return encodeURIComponent(key) + '=' +
      encodeURIComponent(json[key]);
    }).join('&');
  }

  return new Promise( (resolve, reject) => {
    if (!method) {
      reject();
      return;
    }
    else {
      let xhr = new XMLHttpRequest();
      if (method.localeCompare('GET') === 0 )
        url += body ? jsonToQueryString(body) : ''

      xhr.open(method, url);
      xhr.onload = function() {
        if (this.readyState == 4) {
          if ( this.status >= 200 && this.status < 400 ) {
            const response = JSON.parse(xhr.response);
            resolve( response );
          }
          else {
            reject( {
              status: this.status,
              statusText: xhr.statusText
            });
          }

        }
      }
      xhr.onerror = function() {
        if (this.readyState === 4) {
          reject( {
            status: this.status,
            statusText: xhr.statusText
          });
        }
      }
      xhr.setRequestHeader('Accept', 'application/json')
      if (method.localeCompare('POST') === 0 ) {
        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        xhr.send(JSON.stringify(body));
      }
      else {
        xhr.send();
      }
    }

  });
}

export function get(url, body)  {
  return makeRequest('GET', url, body);
}

export function post (url, body)  {
  return makeRequest('POST', url, body);
}
