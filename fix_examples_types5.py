import re

with open('lib/examples.ts', 'r') as f:
    content = f.read()

content = content.replace('terminology: []', 'terminology: {}')

with open('lib/examples.ts', 'w') as f:
    f.write(content)
