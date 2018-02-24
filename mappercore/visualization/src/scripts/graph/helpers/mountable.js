define(function (require) {

  const _ = require('underscore');

  return class MountableHelper {

    constructor(graph) {
      this.graph = graph;
      this.mounted = {};
      this.init();
    }

    init() {
    }

    add(mountable) {
      mountable.willMount();
      mountable.setGraph(this.graph);
      this.mounted[mountable.name] = mountable;
      mountable.didMount();
    }

    has(name) {
      return this.mounted.hasOwnProperty(name);
    }

    get(name) {
      return this.mounted[name];
    }

    map(fn) {
      _.mapObject(this.mounted, fn);
    }
  }

});
