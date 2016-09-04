#!/bin/bash

if test ! -d node_modules;
then
  mkdir node_modules >/dev/null 2>&1;
fi;

pkgs=`cat <<EOF
@angular
awesome-typescript-loader
babel
babel-core
babel-loader
babel-polyfill
immutable
jasmine-core
ng2-redux
redux
redux-logger
reflect-metadata
rxjs
ts-helpers
typings
zone.js
EOF
`;

cd node_modules;

for i in $pkgs;
do
  if test ! -h $i;
  then
    ln -s ../../node_modules/$i ./$i;
  fi;
done;
