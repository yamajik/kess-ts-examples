import { Function, method } from "kess";


export class Test extends Function {
  @method()
  testv1(req, rep) {
    rep.json({test: "v1"})
  }

  @method("testv3")
  testv2(req, rep) {
    rep.json({test: "v2"})
  }
}
