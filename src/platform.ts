import { List, Primative, Record } from "./core.ts";

// PROGRAM TYPES

export type Cmd<msg> = (Promise<msg> | void)[];

export type Program<flags, model, msg> = {
  init: (flags: flags) => [model, Cmd<msg>];
  update: (msg: msg, model: model) => [model, Cmd<msg>];
};

// PORT TYPES

export type Port = {
  subscribe: (fn: (param: Param) => void) => void;
  unsubscribe: () => void
};

type Param = Primative | List<Primative> | Record<Primative>;

// PORTS

let portFns = {} as Record<(param: Param) => void>;
let ports = {} as Record<Port>;

const port = (name: string) => {
  portFns[name] = () => { };

  ports[name] = {
    subscribe: (fn) => { portFns[name] = fn },
    unsubscribe: () => { portFns[name] = () => { } }
  };

  return (param: Param) => portFns[name](param);
}

// WORKER

const worker = <flags, model, msg>(
  flags: flags,
  program: Program<flags, model, msg>,
): Record<Port> => {
  let [model, cmds] = program.init(flags);

  (async () => {
    do {
      // TODO: non-blocking loop; run cmds in parallel
      const cmd = cmds.shift();

      if (cmd) {
        const [model_, cmds_] = program.update(await cmd, model);
        [model, cmds] = [model_, cmds.concat(cmds_)];
      }
    } while (cmds.length > 0)
  })();

  return ports;
};

export { port, worker };
