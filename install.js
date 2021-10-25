const fse = require('fs-extra');
const path = require('path');

let _projectRoot = null;

(async() => {
  await fse.copy(sourcePackage(),
    targetPackage(),
    {overwrite: true});
})();

function projectRoot() {
  if (!_projectRoot) {
    _projectRoot = __dirname;
  }
  return _projectRoot;
}

function sourcePackage() {
  return path.join(projectRoot(), 'dist', 'rulenode-core-config', 'bundles', 'rulenode-core-config.umd.min.js');
}

function targetPackage() {
  return path.join(projectRoot(), 'target', 'generated-resources', 'public', 'static', 'rulenode', 'rulenode-core-config.js');
}
