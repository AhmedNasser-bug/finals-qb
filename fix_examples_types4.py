import re

with open('lib/examples.ts', 'r') as f:
    content = f.read()

content = content.replace('achievements: []', 'achievements: [], terminology: []')

with open('lib/examples.ts', 'w') as f:
    f.write(content)
