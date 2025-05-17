const OPCODES = {
  LOADK: 1,
  ADD: 2,
  PRINT: 3,
  RET: 4,
};

// A very simple bytecode builder for demo (only supports local assignments, print, add)
function buildBytecode(ast) {
  const bytecode = [];

  // Context to store constants and registers
  const constants = [];
  const registers = new Map();

  let regCount = 0;

  // Helper to add constant and return its index
  function addConstant(val) {
    let idx = constants.indexOf(val);
    if (idx === -1) {
      constants.push(val);
      idx = constants.length - 1;
    }
    return idx;
  }

  // Simplified: only handle local assignments and print calls
  function traverse(node) {
    if (!node) return;

    switch (node.type) {
      case 'Chunk':
        node.body.forEach(traverse);
        break;

      case 'LocalStatement':
        node.variables.forEach((v, i) => {
          const expr = node.init[i];
          if (expr.type === 'NumericLiteral') {
            const cidx = addConstant(expr.value);
            bytecode.push([OPCODES.LOADK, regCount, cidx]);
            registers.set(v.name, regCount);
            regCount++;
          } else if (expr.type === 'StringLiteral' || expr.type === 'HexEncodedString') {
            const val = expr.value;
            const cidx = addConstant(val);
            bytecode.push([OPCODES.LOADK, regCount, cidx]);
            registers.set(v.name, regCount);
            regCount++;
          }
        });
        break;

      case 'CallStatement':
        const callExp = node.expression;
        if (callExp.base.name === 'print') {
          callExp.arguments.forEach(arg => {
            if (arg.type === 'Identifier') {
              const reg = registers.get(arg.name);
              if (reg !== undefined) {
                bytecode.push([OPCODES.PRINT, reg]);
              }
            }
          });
        }
        break;

      default:
        break;
    }
  }

  traverse(ast);

  bytecode.push([OPCODES.RET]);

  return { bytecode, constants };
}

module.exports = { OPCODES, buildBytecode };
