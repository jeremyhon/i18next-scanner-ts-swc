## i18next-scanner-ts-swc

Typescript support for [i18next-scanner](https://github.com/i18next/i18next-scanner/) (via swc)

## Install

```bash
yarn add -D @swc/core i18next-scanner-ts-swc
```

## Usage

```js
const typescriptTransform = require("i18next-scanner-ts-swc");

module.exports = {
  options: {
    func: {
      // don't pass ts or tsx here!
      extensions: [".js", ".jsx"],
    },
    trans: {
      // don't pass ts or tsx here!
      extensions: [".js", ".jsx"],
    },
  },
  // your i18next-scanner config
  // ...
  transform: typescriptTransform(
    // options
    {
      // these are the default options
      swcOptions: {
        jsc: {
          parser: {
            syntax: "typescript",
            tsx: true,
          },
          target: "es2018",
        },
        module: {
          type: "commonjs",
        },
      },
      extensions: [".ts", ".tsx"],
      concurrency: 4, // Number of files to process in 'parallel'
    },

    // optional custom transform function
    function customTransform(outputText, file, enc, done) {
      // do something custom with the transpiled `outputText`
      parser.parseTransFromString(outputText);
      parser.parseFuncFromString(outputText);

      done();
    }
  ),
};
```

Double check that you don't have TS extensions in the non-transform configuration
