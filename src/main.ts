import { Result } from "./core.ts";
import { Cmd, Port, Program, worker } from "./platform.ts";

// PORTS

const ports = {
  log: (message: string) => Promise.resolve(console.log({ message }) as Port),
};

// MODEL

type Model =
  | { kind: "loading" }
  | { kind: "loaded"; result: Result<string, Data> };

type Data = { followers: number };

const init = (_flags: never): [Model, Cmd<Msg>] => [{ kind: "loading" }, [
  fetch("https://api.github.com/users/denoland")
    .then((response) => response.json())
    .then((data) =>
      ({
        kind: "gotData",
        result: { kind: "ok", value: { followers: data.followers } as Data },
      }) as Msg
    )
    .catch((_err) =>
      ({
        kind: "gotData",
        result: { kind: "err", error: "Failed to fetch data" as string },
      }) as Msg
    ),
]];

// UPDATE

type Msg = {
  kind: "gotData";
  result: Result<string, Data>;
};

const update = (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
  switch (model.kind) {
    case "loading":
      switch (msg.kind) {
        case "gotData": {
          const model_ = { kind: "loaded", result: msg.result } as Model;

          if (msg.result.kind === "ok") {
            return [model_, [ports.log(JSON.stringify(msg.result.value))]];
          } else {
            return [model_, [ports.log(JSON.stringify(msg.result.error))]];
          }
        }
        default:
          return [model, []];
      }
    case "loaded":
    default:
      return [model, []];
  }
};

// MAIN

export const main = worker(Deno.args, {
  init,
  update,
} as Program<string[], Model, Msg>);
