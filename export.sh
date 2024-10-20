#!/bin/bash

arr=(PD-tasks)

basepath=$(pwd)

mkdir -p dist

for item in ${arr[*]}
do
  echo "Exporting static data from $item"
  cd $item
  npm run export
  cp dist/* ../dist
  cd $basepath
done
