import { Client, Function, method, subscribe } from "kess";

export class WorkerV1 extends Function {
  client: Client;

  constructor() {
    super();
    this.client = new Client();
  }

  @subscribe("http.request.test")
  @method()
  async request({ data }) {
    console.log("worker.test", data);
    this.client.pubsub().publish("http.response", data);
  }
}
