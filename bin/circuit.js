#!/usr/bin/env node
import {run} from '../src/commands.js';
process.exitCode=await run(process.argv.slice(2));
