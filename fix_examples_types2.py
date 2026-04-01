import re

with open('lib/examples.ts', 'r') as f:
    content = f.read()

content = content.replace('"multiple-choice"', '"MultipleChoice"')
content = content.replace('"true-false"', '"TrueFalse"')
content = content.replace('q:', 'front:')
content = content.replace('a:', 'back:')

with open('lib/examples.ts', 'w') as f:
    f.write(content)
