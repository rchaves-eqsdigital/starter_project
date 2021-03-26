# starter_project
This is a tutorial project, created to learn **Go** (server) and **Angular/Typescript** (client).

There are editable users and sensors, displayed in the app. Sensors have data, imported from a real dataset, shown in 3 types of line charts: [ChartJS](https://www.chartjs.org/), [ECharts](https://echarts.apache.org/en/index.html) and drawn directly on the canvas.

## Relevant Features
### Client+Server
- Login/Logout with sessions and session token
- 401 (Unauthorized) and 404 pages
- Every page requires authentication (except */login*). Not the page in the client, directly, but every page that is heavily based on API requests that require authentication.


### Client


### Server

## Known Issues / Bad Software
- ["Edit forms"](client/src/app/components/item-form) are not dynamic, only allowing one field to be changed.


## TODO/Future work 
- Implement "Add user"
- Implement "Add sensor"
- Implement "Add sensor data"
- Implement "edit forms" that allow multiple fields to be changed, dynamically