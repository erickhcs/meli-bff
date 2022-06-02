import axios, { AxiosInstance } from "axios";

class HTTPClient {
  public instance: AxiosInstance;

  constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
    });
  }

  get(url: string) {
    return this.instance.get(url);
  }
}

export default HTTPClient;
