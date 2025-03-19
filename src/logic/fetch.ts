import { AxiosHeaders, AxiosResponse } from "axios";

export class fetchCl {
  

  async fetchGet(url: string, headers: Record<string, string>): Promise<AxiosResponse<any>> {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    });
    const data = await response.json();

    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    return {
      data,
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
      config: {
        headers: new AxiosHeaders() // Используем пустой объект AxiosHeaders
      },
    };
  }

  


  async fetchPost(url: string, headers: Record<string, string>, payload?: object): Promise<AxiosResponse<any>> {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: JSON.stringify(payload) || ''
    });
    const data = await response.json();

    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    return {
      data,
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
      config: {
        headers: new AxiosHeaders()
      },
    };
  }

  
}

