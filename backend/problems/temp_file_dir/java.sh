#!/bin/bash

script_dir="$(pwd)/problems/temp_file_dir"
code_path="$script_dir/Main.java"
tc_file_path="$script_dir/testcase.txt"
excute_path="$script_dir/Main"

# echo $script_dir
# echo $code_path
# echo $tc_file_path
# echo $excute_path

javac $code_path

# # Execute python temp.py once
java "$excute_path" < "$tc_file_path"