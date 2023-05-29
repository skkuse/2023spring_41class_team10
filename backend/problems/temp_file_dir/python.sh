#!/bin/bash

script_dir="$(pwd)/problems/temp_file_dir"
code_path="$script_dir/temp.py"
tc_file_path="$script_dir/testcase.txt"

# echo $script_dir
# echo $code_path
# echo $tc_file_path

# Execute python temp.py once
python3 "$code_path" < "$tc_file_path"