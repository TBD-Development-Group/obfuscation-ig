const crypto = require('crypto');

function generateAntiTamper(bytecode) {
  const serialized = JSON.stringify(bytecode);
  const hash = crypto.createHash('sha256').update(serialized).digest('hex');
  // Generate Lua code snippet that verifies checksum at runtime
  return `
local expectedHash = "${hash}"
local function calcHash(s)
  local sha256 = require("sha256")
  return sha256(s)
end
if calcHash(require('json').encode(code)) ~= expectedHash then
  error("Anti-tamper check failed!")
end
`;
}

module.exports = { generateAntiTamper };

