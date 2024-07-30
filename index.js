const { loading } = require('cli-loading-animation');

const { start, stop } = loading('Loading..');



import {fileURLToPath} from "node:url";
import path from "node:path";
import {LlamaModel, LlamaContext, LlamaChatSession, LlamaChatPromptWrapper } from "node-llama-cpp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const input= process.argv[process.argv.length-1]
console.debug(__dirname,input )

const model = new LlamaModel({
    modelPath: input
});
const context = new LlamaContext({model});
const promptWrapper = "auto"; // new LlamaChatPromptWrapper()|| 'auto';
const session = new LlamaChatSession({context});

const chat = async(txt)=>{

  let uuid = 1;
  start();

  const a = await session.prompt(
    txt,
    {
      maxTokens: context.getContextSize(),
      threads: 4,
      useMlock:true,

      onToken(chunk) {
        if(uuid){
          stop();
          uuid=0
        }

        process.stdout.write(context.decode(chunk))
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
	console.log("\n")
  // Depois de executar a função chat, o stdin volta a ouvir para mais input do usuário.
});

setTimeout( console.clear, 1000,)
setTimeout( console.info, 1100, "\b IA Carregada ! \b\n\b CHAT iniciado \b\n")
process.on("SIGINT", () => {
  console.log("Ctrl-C was pressed");
  process.exit(0);
});
