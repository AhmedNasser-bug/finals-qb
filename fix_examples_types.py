import re

with open('lib/examples.ts', 'r') as f:
    content = f.read()

content = content.replace('"MultipleChoice"', '"multiple-choice"')
content = content.replace('"TrueFalse"', '"true-false"')
content = content.replace('"easy"', '"Easy"')
content = content.replace('categoryId:', 'category:')

with open('lib/examples.ts', 'w') as f:
    f.write(content)
