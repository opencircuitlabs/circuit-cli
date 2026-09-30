# OpenCircuit CLI

The command-line workbench for OpenCircuitLabs. It validates and formats OpenCircuit 1.0 documents, summarizes projects, converts supported SPICE netlists and runs transient simulations.

```sh
npm install -g github:opencircuitlabs/circuit-cli
circuit validate design.json
circuit inspect design.json
circuit convert-spice amplifier.cir > amplifier.json
circuit transient filter.json --step 0.00001 --duration 0.1 > results.json
```

Commands never overwrite source files. Exit codes are `0` for success, `1` for invalid input or simulation failure and `2` for usage errors. Run `npm test`. MIT licensed.
