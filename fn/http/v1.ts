import { Client, Function, method, subscribe } from "kess";
import * as uuid from "uuid";

export class HttpV1 extends Function {
  client: Client;
  cache: Map<string, any>;

  constructor() {
    super();
    this.client = new Client();
    this.cache = new Map<string, any>();
  }

  createRandomID(): string {
    const buffer = Buffer.alloc(16);
    uuid.v4({}, buffer);
    return buffer.toString("hex");
  }

  @method()
  async request({ id, data }, { req, res }) {
    const requestID = this.createRandomID();
    this.cache.set(`${id}.${requestID}`, res);
    console.log("http.publish", `http.request.${id}`, { id, requestID, data });
    await this.client
      .pubsub()
      .publish(`http.request.${id}`, { id, requestID, data });
    setTimeout(() => {
      if (this.cache.delete(`${id}.${requestID}`)) {
        res
          .status(500)
          .send({ error: new Error("Request timeout").toString() });
      }
    }, 30 * 1000);
  }

  @subscribe("http.response")
  @method()
  async response({ data }) {
    const { id, requestID } = data;
    console.log("http.response", data);
    const res = this.cache.get(`${id}.${requestID}`);
    if (!res) return { status: "DROP" };
    res.json(data.data);
    return { status: "SUCCESS" };
  }
}
