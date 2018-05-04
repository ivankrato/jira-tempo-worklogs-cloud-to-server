Migrating Tempo worklogs from JIRA cloud to JIRA server is not yet supported, but you can get all the worklog data from Tempo API and then import it to JIRA server by using this script.

### USAGE

1. copy and rename .env.example to .env
2. fill .env with needed data
    * DB_HOST, DB_HOST, DB_PASS, DB_NAME are self explanatory
    * BASE_URL is the URL of your JIRA cloud instance
    * TEMPO_API_TOKEN - see [here](https://support.tempo.io/hc/en-us/articles/115011300208-Managing-access-control-for-integrations)
    * DATE_FROM - from what date you want to migrate worklogs, in YYYY-MM-DD format (DATE_TO is current date)
3. run ```npm install```
4. run ```node migrate.js```, you can use ```--verbose``` or ```-v``` parameter to show all executed SQL commands