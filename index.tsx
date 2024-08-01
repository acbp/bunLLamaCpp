import { semver } from "bun";
import { loading } from "cli-loading-animation";
import {
  LlamaJsonSchemaGrammar,
	LlamaChatPromptWrapper,
	LlamaChatSession,
	LlamaContext,
	LlamaModel,
} from "node-llama-cpp";

const { start, stop } = loading("Loading...");
const __dirname = Bun.file(new URL(import.meta.url));
const _package = await Bun.file("./package.json").json();

console.log(
	Bun.version,
	Bun.revision,
	_package.version,
	_package.dependencies,
	Bun.argv,
);

const model = new LlamaModel({
	modelPath: Bun.argv[2],

});
const grammar = new LlamaJsonSchemaGrammar({
    "type": "object",
    "properties": {
        "responseMessage": {
            "type": "string"
        },
        "requestPositivityScoreFromOneToTen": {
            "type": "number"
        }
    }
} as const);
const context = new LlamaContext({
	model,
  threads:1,
});
const session = new LlamaChatSession({
	context,
});
const llm = (userInput: string) =>
	session.prompt(userInput, {

		maxTokens: context.getContextSize(),
		onToken(chunk) {
			process.stdout.write(context.decode(chunk));
		},
	});
const readline = require("node:readline");
const cli = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: true,
});
const chat = async (input: string) => {
	return await prompt(input);
};
cli.on("line", async (input: string) => {
	const answer = await chat(input);
	stop();
	console.log(grammar.parse(answer),"\n");

});
start();
