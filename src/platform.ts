// TYPES

export type Cmd<msg> = Promise<msg>[];

export type Program<flags, model, msg> = {
  init: (flags: flags) => [model, Cmd<msg>];
  update: (msg: msg, model: model) => [model, Cmd<msg>];
};

// WORKER

const worker = <flags, model, msg>(program: Program<flags, model, msg>) => {
  let [model, cmds] = program.init(Deno.args);

  return {};
};

export { worker };
