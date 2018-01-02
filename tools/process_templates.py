#!/usr/local/bin/python3
# -*- encoding: utf-8 -*-

# process_templates.py
#
# This file contains a small script that processes .template files and outputs
# the result of replacing the {{variables}} with their corresponding
# value. You can see the list of available variables and their names by looking
# at `available_template_variables` in the main() function.
#
# An example of a .template file would be:
#
# example.css.template, containing
#
#     {{netflix-css-selectors}} { 
#         border: 1px solid red;
#     }
#
# Which would output
#
# example.css, containing e.g.
#
#     .episode-list .synopsis,
#     .billboard .synopsis,
#     .simsSynopsis {
#         border: 1px solid red;
#     }
#
# ----------------------
#
# process_templates.py was created to make it easier to update the CSS selectors
# by just requiring the developer to edit a single file ("selectors.txt") instead
# of editing the different CSS and JavaScript files in each browser extension.
#
# If you edit the selectors.txt file or any of the .template files, make sure to
# run `./process_templates.py path/to/some/file.template` to update the generated
# file.

import os.path
import re
import sys

GENERATED_FILE_HEADER_COMMENT = """
/*
 * THIS FILE WAS GENERATED BY tools/process_templates.py FROM {input_filename:s}.
 *
 * DO NOT EDIT THIS FILE MANUALLY.
 * 
 * INSTEAD, EDIT {input_filename:s} OR tools/selectors.txt AND RUN 
 * tools/process_templates.sh.
 */

"""

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

def print_usage():
    print(
"""
process_templates.py

Processes one or more .template files and writes the processed file to disk.

Usage:
  process_templates.py <template-file-path>...
""")

def parse_selectors(selectors_file):
    selectors = []

    for line in selectors_file:
        if len(line) > 0 and not line.isspace() and not line.startswith("//"):
            selectors.append(line.rstrip())

    return selectors

def create_netflix_css_selectors(selectors):
    return ", ".join(selectors)

def create_netflix_hover_css_selectors(selectors):
    return ", ".join([selector + ":hover" for selector in selectors])

def create_netflix_javascript_selectors(selectors):
    return ", ".join(['"{}"'.format(selector) for selector in selectors])

def replace_template_variables(input_text, available_template_variables):
    return re.sub(r'\{\{([a-z\-]+)\}\}', lambda match: available_template_variables[match.group(1)], input_text)

def process_template(source_filename, available_template_variables):
    target_filename = source_filename.rstrip(".template")
    with open(source_filename, "r") as source_file, open(target_filename, "w") as target_file:
        source_basename = os.path.basename(source_filename)
        target_file.write(GENERATED_FILE_HEADER_COMMENT.format(input_filename=source_basename))

        for input_line in source_file:
            processed_line = replace_template_variables(input_line, available_template_variables)
            target_file.write(processed_line)

def main(input_filenames):
    with open(os.path.join(SCRIPT_DIR, "selectors.txt"), "r") as selectors_file:
        selectors = parse_selectors(selectors_file)

    available_template_variables = {
        "netflix-css-selectors": create_netflix_css_selectors(selectors),
        "netflix-css-hover-selectors": create_netflix_hover_css_selectors(selectors),
        "netflix-javascript-selectors": create_netflix_javascript_selectors(selectors),
    }

    for source_filename in input_filenames:
        if not source_filename.endswith(".template"):
            print('Skipping {} due to missing ".template" extension'.format(source_filename))
            continue

        process_template(source_filename, available_template_variables)

if __name__ == "__main__":
    input_filenames = sys.argv[1:]
    if len(input_filenames) == 0:
        print_usage()
    else:
        main(input_filenames)

