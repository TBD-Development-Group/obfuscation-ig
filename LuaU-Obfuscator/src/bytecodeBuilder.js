// Convert AST into our custom bytecode format

const OPCODES = {
  LOADK: 1,
  ADD: 2,
  SUB: 3,
  MUL: 4,
  DIV: 5,
  PRINT: 6,
  JMP: 7,
  EQ: 8,
  LT: 9,
  CALL: 10,
  RET: 11,
  // ... add more opcodes as needed
};

function buildBytecode(ast) {
  const bytecode = [];
  // Walk AST and produce opcode arrays like:
  // [OPCODES.LOADK, reg, constant]
  // [OPCODES.PRINT, reg]
  // (Implementation detail left for expansion)
  return bytecode;
}

module.exports = {
  OPCODES,
  buildBytecode,
};

