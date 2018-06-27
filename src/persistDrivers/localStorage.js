import VuexPersistence from 'vuex-persist';

export default {
  patchStore(store, moduleName) {
    const vuexLocal = new VuexPersistence({
      key: 'VueLoginStore',
      storage: window.localStorage,
      modules: [moduleName]
    });
    vuexLocal.plugin(store);
    return store;
  }
}
