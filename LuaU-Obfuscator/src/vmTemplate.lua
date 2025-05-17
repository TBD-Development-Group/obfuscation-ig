-- Custom Lua VM interpreter for obfuscated bytecode

local OPCODES = {
  LOADK = 1,
  ADD = 2,
  PRINT = 3,
  RET = 4,
}

local code = /*BYTECODE_PLACEHOLDER*/.bytecode
local constants = /*BYTECODE_PLACEHOLDER*/.constants

local pc = 1
local registers = {}

-- Decode hex string to normal string
local function hexToString(hex)
  return (hex:gsub('..', function(cc)
    return string.char(tonumber(cc, 16))
  end))
end

local running = true
while running do
  local ins = code[pc]
  local op = ins[1]

  if op == OPCODES.LOADK then
    local reg = ins[2]
    local constIndex = ins[3] + 1 -- Lua index starts at 1
    local val = constants[constIndex]
    -- Decode if hex string
    if type(val) == 'string' and val:match('^%x+$') then
      val = hexToString(val)
    end
    registers[reg] = val

  elseif op == OPCODES.PRINT then
    local reg = ins[2]
    print(registers[reg])

  elseif op == OPCODES.RET then
    running = false

  else
    error("Unknown opcode " .. tostring(op))
  end

  pc = pc + 1
end
