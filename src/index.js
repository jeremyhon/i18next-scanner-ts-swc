const fs = require("fs").promises;
const path = require("path");
const swc = require("@swc/core");

module.exports = function swcTransform(
  options = {
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
  transformFn
) {
  return async function transform(file, enc, done) {
    const files = Array.isArray(file) ? file : [file];
    const concurrency = options.concurrency || 4;

    const processFile = async (file) => {
      const { base, ext } = path.parse(file.path);

      if (options.extensions.includes(ext) && !base.includes(".d.ts")) {
        try {
          const content = await fs.readFile(file.path, enc);
          const { code } = await swc.transform(content, {
            filename: path.basename(file.path),
            ...options.swcOptions,
          });

          if (typeof transformFn === "function") {
            await new Promise((resolve) =>
              transformFn.call(this, code, file, enc, resolve)
            );
          } else {
            this.parser.parseTransFromString(code);
            this.parser.parseFuncFromString(code);
          }
        } catch (error) {
          console.error(`Error processing ${file.path}:`, error);
        }
      }
    };

    const processBatch = async (batch) => {
      await Promise.all(batch.map(processFile));
    };

    for (let i = 0; i < files.length; i += concurrency) {
      const batch = files.slice(i, i + concurrency);
      await processBatch(batch);
    }

    done();
  };
};
