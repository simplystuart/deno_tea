import { Result } from "./core.ts";
import { Cmd, Program, worker } from "./platform.ts";

// MODEL

type Model = { kind: "loading" }
  | { kind: "loaded"; data: Result<string, { followers: number }> };

const init = (_flags: any): [Model, Cmd<Msg>] => [{ kind: "loading" }, [
  fetch("https://api.github.com/users/denoland")
    .then((response: Response) => response.json())
    .catch((_err: Error) => ("Failed to fetch data")),
]];

// UPDATE

type Msg = {
  kind: "gotData";
  data: any;
};

const update = (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
  switch (model.kind) {
    case "loading":
      switch (msg.kind) {
        case "gotData":
          return [{ kind: "loaded", data: msg.data }, []];
        default:
          return [model, []];
      }
    case "loaded":
    default:
      return [model, []];
  }
};

// MAIN

export const main = worker({
  init,
  update,
} as Program<any, Model, Msg>);
