---
title: "面向写作者的 Python 脚本"
date: 2023-12-25T22:52:00+08:00
draft: false
author: "Miaomiao"
tags:
  - Python 脚本
  - 示例
---

本文介绍我在文档迁移项目中编写 Python 脚本的实践。

在一次系统性的文档迁移项目中，我开发了一套 Python 脚本，用于将文档从旧系统无缝迁移到新平台。核心目标是进行严格的语法检查与自动修正，避免迁移过程中的错误并保持文档完整性。

## 脚本说明

脚本由三部分组成，分别应对迁移过程中最常见的三类问题：

| 工具名称 | 目的 | 关键特性 |
| --- | --- | --- |
| 标签检查器 | 验证 HTML 或 XML 类文件的标签结构，确保标签成对匹配。 | 通过详细的错误提示帮助定位格式问题。 |
| 引号检查器 | 分析文本文件中单引号与双引号的成对情况。 | 检测未闭合或不匹配的引号，并报告行号与位置。 |
| 变量使用检查器 | 检查代码文件中的变量使用是否正确，重点关注导入与定义。 | 识别特定模式变量，验证 import 语句并检查变量定义。 |

这些脚本体现了我对文档准确性与一致性的重视，也符合新文档管理系统的最佳实践。组合使用后，可保证迁移过程稳定、可靠。

## 代码示例

<details>
  <summary>展开/收起</summary>
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
