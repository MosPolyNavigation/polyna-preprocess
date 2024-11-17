#!/bin/bash

arr=(
  PD-tasks
  navigationData
)

basepath=$(pwd)

mkdir -p dist

cat >dist/index.html << EOF
<html>
<head>
<title>List of static files</title>
</head>
<body>
<ol>
EOF

for item in ${arr[*]}
do
  echo "Exporting static data from $item"
  cd $item
  cp ../.env ./.env
  npm ci
  npm run export
  cp dist/* ../dist
  cd $basepath
done

for item in $(ls dist)
do
  if [[ $item != index.html ]]; then
    echo "<li><a href=\"$item\">$item</a></li>" >> dist/index.html
  fi
done

echo "</ol></body></html>" >> dist/index.html
