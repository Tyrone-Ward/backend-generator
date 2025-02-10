Use the application generator tool, backend-generator, to quickly create an application skeleton.

You can run the application generator with the `npx` command (available in Node.js 8.2.0).

```sh
npx https://github.com/Tyrone-Ward/backend-generator.git myApp
```

Then install dependencies:

```sh
$ cd myapp
$ npm install
```

Start your Express.js app at `http://localhost:3000/`:

```bash
$ npm start
```

The generated app has the following directory structure:

```sh
├── env.example
├── index.js
├── package.json
├── README.md
└── src
    ├── config
    │   └── index.js
    ├── controllers
    │   └── index.js
    ├── middlewares
    │   ├── errorHandler.js
    │   └── httpLpgger.js
    ├── routes
    │   └── rootRoutes.js
    └── utils
        ├── AppError.js
        └── logger.js

7 directories, 11 files
```
