const cliProgress = require('cli-progress');
const colors = require('ansi-colors');

// create new progress bar
const b1 = new cliProgress.SingleBar({
  format: '|' + colors.cyan('{bar}') + '| {percentage}% || {value}/{total} n',
  barCompleteChar: '\u2588',
  barIncompleteChar: '\u2591',
  hideCursor: true,
  clearOnComplete: true,
});


import {fileURLToPath} from "node:url";
import path from "node:path";
import {LlamaModel, LlamaContext, LlamaChatSession} from "node-llama-cpp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const input= process.argv[process.argv.length-1]
console.debug(__dirname,input )

const model = new LlamaModel({
    modelPath: input
});
const context = new LlamaContext({model});
const session = new LlamaChatSession({context});

const chat = async(txt)=>{
  //b1.start(context.getContextSize(), 0);
  const a = await session.prompt(
    txt,
    {
      maxTokens: context.getContextSize(),
      threads: 2,
      useMlock:1,
      temperature: 0.8,

      lastTokens: 128,
      penalty: 1.12,
      penalizeNewLine: false,
      frequencyPenalty: 0.02,
      presencePenalty: 0.02,

      onToken(chunk) {
        process.stdout.write(context.decode(chunk))
        // b1.increment();
        // b1.update(context.decode(chunk).lenght);
      }
    }
  )
  return a;
}

const readline = require('node:readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true
});


rl.on('line', async (input) => {
  const answer= await chat(input);
  // b1.stop();
	// console.log(answer,"\n")
	console.log("\n")
  // Depois de executar a função chat, o stdin volta a ouvir para mais input do usuário.
});

setTimeout( console.clear, 1000,)
setTimeout( console.info, 1100, "\b IA Carregada ! \b\n\b CHAT iniciado \b\n")
process.on("SIGINT", () => {
  console.log("Ctrl-C was pressed");
  process.exit();
});
