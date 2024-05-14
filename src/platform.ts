// TYPES

export type Port = never;

export type Cmd<msg> = Promise<msg | Port>[];

export type Program<flags, model, msg> = {
  init: (flags: flags) => [model, Cmd<msg>];
  update: (msg: msg, model: model) => [model, Cmd<msg>];
};

// WORKER

const worker = async <flags, model, msg>(
  flags: flags,
  program: Program<flags, model, msg>,
) => {
  let [model, cmds] = program.init(flags);

  do {
    const cmd = cmds.shift();

    if (cmd) {
      const [model_, cmds_] = program.update(await cmd, model);
      [model, cmds] = [model_, cmds.concat(cmds_)];
    }
  } while (cmds.length > 0);
};

export { worker };
