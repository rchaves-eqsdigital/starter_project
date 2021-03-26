# starter_project
This is a tutorial project, created to learn **Go** (server) and **Angular/Typescript** (client).

There are editable users and sensors, displayed in the app. Sensors have data, imported from a real dataset, shown in 3 types of line charts: [ChartJS](https://www.chartjs.org/), [ECharts](https://echarts.apache.org/en/index.html) and drawn directly on the canvas.

A live online version of this project is available [here](http://eqs.ricardochaves.pt). Credentials for the default user are `user@user.com user`.

A list of the available API endpoints are available at the start of the [api file](server/api.go).

----------
## Relevant Features
### Client+Server
- Login/Logout with sessions and session token
- 401 (Unauthorized) and 404 pages
- Every page requires authentication (except */login*). Not the page in the client, directly, but every page that is heavily based on API requests that requires authentication.

### Client
- Icon based bottom-nav, showing what screen is currently active.
- [Custom line-chart](client/src/app/components/line-canvas/line-canvas.component.ts) built using only canvas operations.
- Dark mode, toggle available in the [top-bar](client/src/app/components/top-nav).
- Custom [log](client/src/app/logging/logging.ts), automatically showing the function it was called from.
- 401 and 403 [interceptor](client/src/app/routing/auth-interceptor.ts) redirecting to */login* when one of these errors occurs.
- Authentication token stored as a session cookie, used to authenticate API requests.

### Server
- Routing with custom regex match, supporting `int` and `string` vars, eg: `/api/v0/sensor/([0-9]+)/data`
- Login and password storage using [bcrypt](https://pkg.go.dev/golang.org/x/crypto/bcrypt).
- Dynamic session creation and invalidation.
- Sensor dataset loaded to the DB using parameterized worker-pools and buffers, taking advantage of Go's communication channels, providing a 12x speedup (on my setup) when compared to saving data sequentially, line by line.

----------
## Known Issues / Bad Software
### Client
- ["Edit forms"](client/src/app/components/item-form) are not dynamic, only allowing one field to be changed. Furthermore, data isn't updated on screen when it's saved, requiring a page refresh.
- ["Item details"](client/src/app/components/item-details/item-details.component.ts) component is only semi-generic, as it supports sensors and users, but hardcoded.
- The [Item](client/src/app/data-structs/item.ts) interface, although generic, can be limited (perhaps because it's generic?), only having Pic, Title and Body fields.
- The [sensor](client/src/app/components/sensors/sensors.component.html) and [user](client/src/app/components/users/users.component.html) components have too many things in common, should be generalized.
- Dark mode switch doesn't keep its state when the route changes.

### Server
- Global `App` variable available across every file in the package. Implement using a singleton, perhaps?
- DB and non-DB functions are all in the same file - in [users.go](server/users.go) and [sensors.go](server/sensors.go) respectively.

----------
## TODO/Future work
### Client
- Implement "edit forms" that allow multiple fields to be changed, dynamically
- Update edited fields instantly, without requiring a page refresh
- On [line-canvas](client/src/app/components/line-canvas/line-canvas.component.ts) fix grid scaling/precision
- Get [ChartJS](client/src/app/components/line-chartjs/line-chartjs.component.ts) working with the time scale, instead of converting the dates to a linear format "[0,1,...]" as a workaround.

### Server
- Return [API](server/api.go) errors to client, instead of just printing them.
- Implement tests for the API

### Client + Server
- Implement chunked requests for `apiSensorData`. At the moment if there are 10MB of sensor data, they are returned at once, and displayed in the charts at once.
- Implement "Add user"
- Implement "Add sensor"
- Implement "Add sensor data"
- Implement "Delete user"
