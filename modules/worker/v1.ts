import { Client, method, Module, subscribe } from "kess";

export class WorkerV1 extends Module {
  client: Client;

  constructor() {
    super();
    this.client = new Client();
  }

  @subscribe({ topic: "http.request.test" })
  async request({ data }) {
    console.log("worker.test", data);
    this.client.pubsub().publish("http.response", data);
  }
}
