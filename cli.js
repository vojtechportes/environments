#!/usr/bin/env node

/* eslint-disable */
const argv = require("yargs").argv;
const normalize = require("path").normalize;
const join = require("path").join;
const fs = require("fs");
const __rootDirname = require("./constants");

if (argv.help || argv.h) {
  process.stdout.write(
    'Environments help\n\n' +
      '--efp or --environmentFilePattern - Environment file pattern. Use {environment} placeholder to specify environment in a file name. Defaults to environment{environment}.ts\n' +
      '-es or --environmentSource - Path to source folder. Defaults to ./environments/\n' +
      '-et or --environmentTarget - PAth to target folder. Defaults to ./build/environments/\n' +
      '-e or --enviroment - Environment string. Lowercase value will be used to replace {environment} placeholder in environmentFilePattern.'
  );

  process.exit(0);
}

let environmentFilePattern = "environment{environment}.ts";
let environment = null;
let environmentSource = normalize(join(__rootDirname, "./environments/"));
let environmentTarget = normalize(join(__rootDirname, "./build/environments/"));

if (argv.environmentSource || argv.es) {
  environmentSource = normalize(argv.environmentSource || argv.es);
}

if (argv.environmentTarget || argv.et) {
  environmentTarget = normalize(argv.environmentTarget || argv.es);
}

if (argv.environment || argv.e) {
  environment = (argv.environment || argv.e).toLowerCase();
}

if (argv.environmentFilePattern || argv.efp) {
  environmentFilePattern = argv.environmentFilePattern || argv.efp;
}

let sourceFile = normalize(
  join(environmentSource, environmentFilePattern.replace("{environment}", ""))
);

if (environment !== null) {
  sourceFile = normalize(
    join(environmentSource,
      environmentFilePattern.replace("{environment}", "." + environment))
  );
}

const targetFile = normalize(
  join(environmentTarget, environmentFilePattern.replace("{environment}", ""))
);

if (!fs.existsSync(environmentTarget)) {
  fs.mkdirSync(environmentTarget, {
    recursive: true,
  });
}

if (fs.existsSync(sourceFile)) {
  fs.copyFileSync(sourceFile, targetFile);

  process.stdout.write(
    "Source file " +
      sourceFile +
      " was succesfully copied to " +
      targetFile
  );
  process.exit(0);
} else {
  process.stdout.write("Source file doesn't exist");
  process.exit(1);
}
