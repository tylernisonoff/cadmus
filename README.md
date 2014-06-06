Cadmus
======

![Travis](http://img.shields.io/travis/pspeter3/cadmus.svg?style=flat)

Find mutual connections from your employees

Installation
------------

Follow the instructions below. If you have a machine without node on it already, I highly recommend checking out
[nvm](https://github.com/creationix/nvm) and installing the latest stable version of node.

```bash
git clone git@github.com:pspeter3/cadmus.git
cd cadmus
npm install -g grunt-cli tsd
npm install
```

Grunt
-----

I'm a huge fan of `gulp` but the TypeScript tooling for `grunt` is a lot better and more reliable. I didn't want to be
fighting with the build system all of the time so I chose to use `grunt`. Here are some of the tasks you can run by
doing `grunt <taskname>`.

- **_default_** Lint and compile your source code
- **dev** Run the express server with automatic compilation
- **test** Lint, compile and test your code
- **lint** Run the TypeScript linter
- **tslint** Check the code against the `tslint.json`
  * **:src** Lint your source code
  * **:test** Lint your test code
- **typescript** Compile your TypeScript code
  * **:src** Compile your source code
  * **:test** Compile your test code
- **express** Run the express server using the compiled JS
- **mochaTest** Test your compiled JavaScript code
