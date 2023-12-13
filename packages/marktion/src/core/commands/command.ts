import { Command, RawCommands } from '../types.js';

declare global {
  interface Commands<ReturnType> {
    command: {
      /**
       * Define a command inline.
       */
      command: (fn: (props: Parameters<Command>[0]) => boolean) => ReturnType;
    };
  }
}

export const command: RawCommands['command'] = fn => props => {
  return fn(props);
};
