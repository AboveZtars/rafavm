import { Trie } from "@ethereumjs/trie";
import { runCli, Command } from "command-line-interface";
import { Level } from "level";
import ExecutionContext from "../classes/execution";
import LevelDB from "../classes/storage";
import { DB_PATH } from "../constants";

interface RVMOptions {
  code: string;
  gasLimit: number;
}

const rvm: Command<RVMOptions> = {
  name: "rvm",
  description: "Platzi Virtual Machine execution environment",
  optionDefinitions: [
    {
      name: "code",
      description: "Bytecode to execute by the RVM",
      type: "string",
      alias: "c",
      isRequired: true,
    },
    {
      name: "gasLimit",
      description: "Available gas for the RVM execution",
      type: "number",
      alias: "g",
      isRequired: true,
    },
  ],
  handle: async ({ options: { gasLimit, code } }) => {
    const executionContext = new ExecutionContext(
      code,
      BigInt(gasLimit),
      await Trie.create({
        db: new LevelDB(new Level(DB_PATH)),
        useRootPersistence: true,
      })
    );

    await executionContext.run();
  },
};

runCli({ rootCommand: rvm, argv: process.argv });
