const STATIC_SERVE_CONFIG = {
  '/static/rulenode/rulenode-core-config.js': {
    'target': 'dist/rulenode-core-config/bundles/rulenode-core-config.umd.js'
  },
  '/static/rulenode/rulenode-core-config.umd.js.map': {
    'target': `dist/rulenode-core-config/bundles/rulenode-core-config.umd.js.map`
  },
  '/assets/*': {
    'target': `dist/rulenode-core-config/assets/`
  }
}

module.exports = STATIC_SERVE_CONFIG;
