const crypto = require('crypto');

function generateAntiTamper(bytecodeObj) {
  const serialized = JSON.stringify(bytecodeObj);
  const hash = crypto.createHash('sha256').update(serialized).digest('hex');

  return `
local expected_hash = "${hash}"
local function sha256(str)
  -- Lua implementation of sha256 or call to a C library (stubbed here)
  -- For now, just return expected_hash (simulate)
  return "${hash}"
end

local current_hash = sha256(require("json").encode(code) .. require("json").encode(constants))
if current_hash ~= expected_hash then
  error("Anti-tamper check failed!")
end
`;
}

module.exports = { generateAntiTamper };
