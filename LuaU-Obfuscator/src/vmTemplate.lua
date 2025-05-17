-- Custom LuaU VM Interpreter

local OPCODES = {
  LOADK = 1,
  ADD = 2,
  SUB = 3,
  MUL = 4,
  DIV = 5,
  PRINT = 6,
  JMP = 7,
  EQ = 8,
  LT = 9,
  CALL = 10,
  RET = 11,
}

local code = /*BYTECODE_PLACEHOLDER*/
local pc = 1
local stack = {}
local running = true

local function run()
  while running do
    local ins = code[pc]
    local op = ins[1]

    if op == OPCODES.LOADK then
      local reg, val = ins[2], ins[3]
      stack[reg] = val
    elseif op == OPCODES.PRINT then
      print(stack[ins[2]])
    elseif op == OPCODES.RET then
      running = false
    else
      error("Unknown opcode: " .. tostring(op))
    end
    pc = pc + 1
  end
end

-- Anti-Tamper snippet injected here
/*CHECKSUM_PLACEHOLDER*/

run()

