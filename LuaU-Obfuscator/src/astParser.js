const luaparse = require('luaparse');

function parseLuaToAST(luaCode) {
  return luaparse.parse(luaCode, { luaVersion: '5.1', comments: false, locations: false });
}

module.exports = { parseLuaToAST };

