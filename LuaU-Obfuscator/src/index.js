const fs = require('fs');
const { parse } = require('luaparse');
const { renameVariables, encodeMath, encodeStrings } = require('./obfuscator');
const { buildBytecode } = require('./bytecodeBuilder');
const { generateAntiTamper } = require('./antiTamper');

const VM_TEMPLATE = fs.readFileSync(__dirname + '/vmTemplate.lua', 'utf-8');

function main(inputPath, outputPath) {
  const code = fs.readFileSync(inputPath, 'utf-8');
  const ast = parse(code, { luaVersion: '5.1' });

  let renamedAst = renameVariables(ast);
  let mathEncodedAst = encodeMath(renamedAst);
  let stringEncodedAst = encodeStrings(mathEncodedAst);

  const bytecode = buildBytecode(stringEncodedAst);

  const checksumCode = generateAntiTamper(bytecode);

  const outputLua = VM_TEMPLATE
    .replace('/*BYTECODE_PLACEHOLDER*/', JSON.stringify(bytecode))
    .replace('/*CHECKSUM_PLACEHOLDER*/', checksumCode);

  fs.writeFileSync(outputPath, outputLua);
  console.log(`Obfuscated LuaU code written to ${outputPath}`);
}

if (process.argv.length !== 4) {
  console.log('Usage: node src/index.js <input.lua> <output.lua>');
  process.exit(1);
}

main(process.argv[2], process.argv[3]);

