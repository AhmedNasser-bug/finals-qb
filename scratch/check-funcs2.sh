#!/bin/bash
FILES=$(find lib/ -type f -name "*.ts" -o -name "*.tsx" | grep -v 'test')
for FILE in $FILES; do
  awk '
    BEGIN { in_func=0; func_name=""; depth=0; max_depth=0 }
    /function .*\(|.*=>/ {
      # Very basic function detection. Misses some arrow functions or complex signatures.
      if(!in_func) {
        in_func=1;
        depth=0; max_depth=0;
        match($0, /function ([a-zA-Z0-9_]+)/, arr);
        if(arr[1] != "") func_name = arr[1]; else func_name = "anonymous";
      }
    }
    /{/ { if(in_func) depth++ }
    /}/ { if(in_func) { depth--; if(depth==0) {
      if(max_depth > 3) print "'$FILE'", func_name, max_depth;
      in_func=0;
    } } }
    { if(in_func && depth > max_depth) max_depth = depth; }
  ' "$FILE"
done
