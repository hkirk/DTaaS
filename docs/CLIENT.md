# Host the DTaaS Client Website

To host DTaaS client website on your server, follow these steps:

- The `build` folder contains all the optimized static files that are ready for deployment.

- Locate the file `build/env.js` to replace the mock URLs with your own of Library, Digital Twin and Workbench. See example below:

```js
  window.env = {
    REACT_APP_ENVIRONMENT: "prod | dev",
    REACT_APP_URL_LIB: "URL for the library components",
    REACT_APP_URL_DT: "URL for the Digital Twins",
    REACT_APP_URL_WORKBENCH: "URL for the workbench",
  };
```

- Copy the entire contents of the build folder to the root directory of your server where you want to deploy the app. You can use FTP, SFTP, or any other file transfer protocol to transfer the files.

- Make sure your server is configured to serve static files. This can vary depending on the server technology you are using, but typically you will need to configure your server to serve files from a specific directory.

- Once the files are on your server, you should be able to access your app by visiting your server's IP address or domain name in a web browser.

---