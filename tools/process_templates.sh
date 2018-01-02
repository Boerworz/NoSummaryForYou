#!/bin/sh

# process_templates.sh
#
# This file makes it easy to run process_templates.py for all the ".template"
# files in the project directory.
#
# Invoke it without any arguments (e.g. ./tools/process_templates.sh) whenever
# you've made changes to the selectors list or the template files.

project_root_directory=$(cd "$(dirname "$(dirname "${BASH_SOURCE[0]}")")" ; pwd -P)

find "$project_root_directory" -name "*.template" -exec "$project_root_directory/tools/process_templates.py" {} +
