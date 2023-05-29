#!/bin/bash

script_dir="$(pwd)/problems/temp_file_dir"
code_path="$script_dir/temp.cc"
tc_file_path="$script_dir/testcase.txt"
excute_path="$script_dir/out"

# echo $script_dir
# echo $code_path
# echo $tc_file_path
# echo $excute_path

g++ $code_path -o "$excute_path"

# # Execute python temp.py once
"$excute_path" < "$tc_file_path"