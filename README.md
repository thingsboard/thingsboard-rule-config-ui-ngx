# thingsboard-rule-config-ui-ngx

Configuration UI for ThingsBoard Rule Nodes

## Build steps

1) Cleanup
    ```
    npm run cleanup 
    ```
2) Get ThingsBoard UI dependency
    ```
    npm run getthingsboard 
    ```
3) Install dependencies
    ```
    npm install 
    ```
4) Production build    
    ```
    npm run build 
    ```
    Resulting JavaScript should be here:
    ```
    ./target/generated-resources/public/static/rulenode-core-config.js
    ```
5) Deploy Rule Nodes UI JavaScript code to ThingsBoard

    Resulting **rulenode-core-config.js**
    should be copied to ```rule-engine/rule-engine-components/src/main/resources/public/static/rulenode/```
    directory of ThingsBoard repository.

6) Run Rule Nodes UI in hot redeploy mode

    ```
    npm start
    ```
    
    By default, Rule Nodes UI will be available on port 5000 (http://localhost:5000)
