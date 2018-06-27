'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vuexPersist = require('vuex-persist');

var _vuexPersist2 = _interopRequireDefault(_vuexPersist);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  patchStore: function patchStore(store, moduleName) {
    var vuexLocal = new _vuexPersist2.default({
      key: 'VueLoginStore',
      storage: window.localStorage,
      modules: [moduleName]
    });
    vuexLocal.plugin(store);
    return store;
  }
};