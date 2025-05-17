const fs = require('fs');
const { parseLuaToAST } = require('./astParser');
const { renameVariables, encodeMath, encodeStrings } = require('./obfuscator');
const { buildBytecode } = require('./bytecodeBuilder');
const { generateAntiTamper } = require('./antiTamper');

const VM_TEMPLATE = fs.readFileSync(__dirname + '/vmTemplate.lua', 'utf8');

function main(inputPath, outputPath) {
  const luaCode = fs.readFileSync(inputPath, 'utf8');

  // Parse Lua to AST
  let ast = parseLuaToAST(luaCode);

  // Obfuscate: Rename variables, encode math and strings
  ast = renameVariables(ast);
  ast = encodeMath(ast);
  ast = encodeStrings(ast);

  // Build bytecode + constants from AST
  const { bytecode, constants } = buildBytecode(ast);

  // Generate anti-tamper code snippet
  const antiTamperCode = generateAntiTamper({ bytecode, constants });

  // Inject bytecode, constants and anti-tamper into VM template
  let outputLua = VM_TEMPLATE
    .replace('/*BYTECODE_PLACEHOLDER*/', JSON.stringify({ bytecode, constants }))
    .replace('/*CHECKSUM_PLACEHOLDER*/', antiTamperCode);

  // Write output
  fs.writeFileSync(outputPath, outputLua);

  console.log('Obfuscated LuaU code generated at', outputPath);
}

if (process.argv.length !== 4) {
  console.log('Usage: node src/index.js <input.lua> <output.lua>');
  process.exit(1);
}

main(process.argv[2], process.argv[3]);
