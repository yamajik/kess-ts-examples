import { Function, method, subscribe } from "kess";
import { Graph, TranspileNetwork } from "kess-flow";

export class Flow extends Function {
  networks: Map<string, TranspileNetwork>;

  constructor() {
    super();
    this.networks = new Map<string, TranspileNetwork>();
  }

  @subscribe("test")
  @method()
  async test(data) {
    console.log("test", data);
    return { status: "SUCCESS" };
  }

  @method()
  async list() {
    const networks = [];
    for (const [id, network] of this.networks.entries()) {
      networks.push({ id, ...network.json() });
    }
    return { networks };
  }

  @method()
  async get({ id }) {
    const network = { id, ...this.getNetwork(id).json() };
    return { network };
  }

  @method()
  async create({ id, graph }) {
    if (this.hasNetwork(id)) {
      const network = this.getNetwork(id);
      await network.stop();
      network.loadFromGraph(new Graph(graph));
    } else {
      const network = new TranspileNetwork();
      network.loadFromGraph(new Graph(graph));
      this.networks.set(id, network);
    }
    await this.start({ id });
    return { id };
  }

  @method()
  async update({ id, graph }) {
    this.getNetwork(id).updateFromGraph(new Graph(graph));
    return { id };
  }

  @method()
  async remove({ id }) {
    const network = this.getNetwork(id);
    await network.stop();
    this.removeNetwork(id);
    return { id };
  }

  @method()
  async start({ id }) {
    await this.getNetwork(id).start();
    return { id };
  }

  @method()
  async stop({ id }) {
    await this.getNetwork(id).stop();
    return { id };
  }

  getNetwork(id: string): TranspileNetwork {
    if (!this.networks.has(id)) {
      throw new Error(`No such netowrk: ${id}`);
    }
    return this.networks.get(id);
  }

  hasNetwork(id: string): boolean {
    return this.networks.has(id);
  }

  removeNetwork(id: string): boolean {
    return this.networks.delete(id);
  }
}
