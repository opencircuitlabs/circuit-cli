import {readFile} from 'node:fs/promises';
import {formatCircuitDocument,validateCircuitDocument} from '@opencircuitlabs/circuit-format';
import {parseSpice,toOpenCircuit} from '@opencircuitlabs/spice-parser';
import {simulateTransient} from '@opencircuitlabs/transient-engine';

export async function run(args,{stdout=console.log,stderr=console.error}={}){
  const [command,file,...rest]=args;if(!command||['-h','--help','help'].includes(command)){stdout(help());return 0;}if(!file){stderr('A file path is required.');return 2;}
  try{
    if(command==='validate'){const input=await json(file);const result=validateCircuitDocument(input);if(result.valid){stdout(`✓ ${file} is a valid OpenCircuit 1.0 document`);return 0;}result.issues.forEach(i=>stderr(`${i.path}: ${i.message}`));return 1;}
    if(command==='format'){stdout(formatCircuitDocument(await json(file)).trimEnd());return 0;}
    if(command==='inspect'){const input=await json(file);const result=validateCircuitDocument(input);if(!result.valid){result.issues.forEach(i=>stderr(`${i.path}: ${i.message}`));return 1;}const counts={};for(const c of input.components)counts[c.type]=(counts[c.type]||0)+1;stdout(JSON.stringify({name:input.metadata.name,version:input.version,nodes:input.nodes.length,components:input.components.length,types:counts},null,2));return 0;}
    if(command==='convert-spice'){stdout(formatCircuitDocument(toOpenCircuit(parseSpice(await readFile(file,'utf8')))).trimEnd());return 0;}
    if(command==='transient'){const circuit=await json(file);const timeStep=numberFlag(rest,'--step',1e-5),duration=numberFlag(rest,'--duration',0.01);stdout(JSON.stringify(simulateTransient(circuit,{timeStep,duration}),null,2));return 0;}
    stderr(`Unknown command "${command}".`);return 2;
  }catch(error){stderr(error instanceof Error?error.message:String(error));return 1;}
}
function numberFlag(args,name,fallback){const index=args.indexOf(name);if(index<0)return fallback;const value=Number(args[index+1]);if(!Number.isFinite(value)||value<=0)throw new Error(`${name} requires a positive number`);return value;}
async function json(file){return JSON.parse(await readFile(file,'utf8'));}
function help(){return `OpenCircuit CLI\n\nCommands:\n  circuit validate <circuit.json>\n  circuit format <circuit.json>\n  circuit inspect <circuit.json>\n  circuit convert-spice <netlist.cir>\n  circuit transient <circuit.json> [--step seconds] [--duration seconds]`;}
