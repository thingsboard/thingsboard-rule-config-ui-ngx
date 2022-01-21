# thingsboard-rule-config-ui-ngx

Configuration UI for ThingsBoard Rule Nodes

## Build steps

1) Install dependencies
    ```
    yarn install 
    ```
2) Production build    
    ```
    yarn build 
    ```
    Resulting JavaScript should be here:
    ```
    ./target/generated-resources/public/static/rulenode-core-config.js
    ```
3) Deploy Rule Nodes UI JavaScript code to ThingsBoard

    Resulting **rulenode-core-config.js**
    should be copied to ```rule-engine/rule-engine-components/src/main/resources/public/static/rulenode/```
    directory of ThingsBoard repository.

4) Run Rule Nodes UI in hot redeploy mode

    ```
    yarn start
    ```
    
    By default, Rule Nodes UI will be available on port 5000 (http://localhost:5000)
