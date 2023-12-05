---
title:  Document Validation Script
layout: sample
author: miumiu
previous:
  title: "User Guide for a Background Job Tool"
  url: "/samples/sample1-guide"
next:
  title: "Jira as Work Tracker"
  url: "/samples/sample3-tracker"
---

### Background
As part of a comprehensive document migration initiative, I've developed a suite of Python scripts tailored to ensure the seamless transition of documentation from an older system to a new platform. The primary goal is to perform meticulous syntax checks and modifications to prevent errors and maintain document integrity in the new environment.

### Script Descriptions

The script comprises three components, each addressing the three most prevalent challenges encountered during documentation migration:

1. **Tag Checker:**
   - *Purpose:* Validates the structure of HTML or XML-like files, ensuring correct pairing of opening and closing tags.
   - *Key Features:* Error reporting with detailed messages, aiding in the identification of formatting issues.

2. **Quote Checker:**
   - *Purpose:* Analyzes text files to verify the proper pairing of single and double quotation marks.
   - *Key Features:* Detection of unclosed or mismatched quotes, accompanied by error reports indicating line numbers and positions.

3. **Variable Usage Checker:**
   - *Purpose:* Ensures the correct usage of variables in code files, focusing on imports and definitions.
   - *Key Features:* Identifies variables following a specific pattern, validates imports, and checks variable definitions.

These scripts reflect my dedication to ensuring the accuracy and consistency of documentation, aligning with the best practices of the new document management system. Their collective usage guarantees a smooth and error-free transition, reinforcing the reliability of the migrated documentation.

### Code Sample

<details>
  <summary>Expand/Collapse</summary>
    <pre>
<code class="language-python">
import re
import os

def check_tag_pairs(file_path):
    stack = []
    with open(file_path, 'r') as file:
        for line_num, line in enumerate(file, start=1):
            tags = re.findall(r'<(\w+)(?:\s+\w+=".*?")*\s*\/?>|<\/(\w+)>', line)
            for start_tag, end_tag in tags:
                if start_tag and start_tag != 'Set':
                    stack.append((start_tag, line_num))
                elif end_tag:
                    if not stack:
                        print(f"Error: Found closing tag without corresponding opening tag at line {line_num}")
                    else:
                        while stack:
                            last_start_tag, _ = stack[-1]
                            if last_start_tag == end_tag:
                                stack.pop()
                                break
                            else:
                                print(f"Error: Found closing tag </{end_tag}> without corresponding opening tag at line {line_num}")
                                stack.pop()

    while stack:
        tag, line_num = stack.pop()
        print(f"Error: Found unclosed tag <{tag}> at line {line_num}")

def check_quotes(file_path):
    with open(file_path, 'r') as file:
        line_num = 0
        single_quotes_stack = []
        double_quotes_stack = []

        for line in file:
            line_num += 1
            index = 0

            while index < len(line):
                if line[index] == "'":
                    if not single_quotes_stack or single_quotes_stack[-1][0] != line_num:
                        single_quotes_stack.append((line_num, index + 1))
                    else:
                        single_quotes_stack.pop()
                elif line[index] == '"':
                    if not double_quotes_stack or double_quotes_stack[-1][0] != line_num:
                        double_quotes_stack.append((line_num, index + 1))
                    else:
                        double_quotes_stack.pop()

                index += 1

        if single_quotes_stack:
            for line_num, quote_pos in single_quotes_stack:
                print(f"Error: Found unclosed single quote at line {line_num}, position {quote_pos}")

        if double_quotes_stack:
            for line_num, quote_pos in double_quotes_stack:
                print(f"Error: Found unclosed double quote at line {line_num}, position {quote_pos}")

def search_variable_usage(file_a_path):
    with open(file_a_path, 'r') as file_a:
        a_content = file_a.read()

    variable_pattern = r'{([a-zA-Z]+\.[a-zA-Z]+)\[frontMatter\.ag_platform\]}'
    variable_matches = re.findall(variable_pattern, a_content)

    for variable in variable_matches:
        import_pattern = rf'import \* as ({variable.split(".")[0]}) from \'(.+?)\''
        import_match = re.search(import_pattern, a_content)

        if import_match:
            import_path = import_match.group(2)

            script_directory = os.path.dirname(os.path.abspath(__file__))
            actual_file_path = get_actual_file_path(import_path, script_directory)

            if not actual_file_path:
                print("Incorrect import statement format")

            if os.path.isfile(actual_file_path):
                with open(actual_file_path, 'r') as import_file:
                    import_content = import_file.read()

                export_pattern = rf'export const {variable.split(".")[1]}'
                if not re.search(export_pattern, import_content):
                    print(f"Variable {variable.split('.')[1]} is not defined.")
            else:
                print("Import file does not exist.")
        else:
            print(f"Variable type {variable.split('.')[0]} is not imported.")

def get_actual_file_path(import_path, script_directory):
    if import_path.startswith('@shared/'):
        return os.path.join(script_directory, import_path.replace('@shared/', 'shared/'))
    elif import_path.startswith('@doc-shared/'):
        return os.path.join(script_directory, 'docs/shared', import_path.replace('@doc-shared/', ''))
    elif import_path.startswith('@api-shared/'):
        return os.path.join(script_directory, 'docs-api-reference/shared', import_path.replace('@api-shared/', ''))
    else:
        print(f"{import_path} File path is incorrect")
        return None

file_a_path = '/your/file/path'  # Set the correct file path

check_tag_pairs(file_a_path)
check_quotes(file_a_path)
search_variable_usage(file_a_path)
</code>
    </pre>
</details>


