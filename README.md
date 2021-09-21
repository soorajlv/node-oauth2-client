# oauth2-client
A simple Node.js application that can perform oauth2 authentication flows



## Installation

Install the dependencies and devDependencies

```
npm i
```
Create `.env` file at the project root. It contains `client_id` and `secret` from the authorization server
```
CLIENT_ID=your_client_id
CLIENT_SECRET=your_client_secret
```

Start the server
```
npm start
```
We use `browser-refresh` to live-reload browser if anything changes in the server. You can also make use of it to make development faster
```
browser-refresh server.js
```


