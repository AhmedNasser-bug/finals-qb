import re

with open('lib/game-engine.tsx', 'r') as f:
    content = f.read()

content = content.replace('config.mode !== "survival"', 'config.mode !== "practice"')

with open('lib/game-engine.tsx', 'w') as f:
    f.write(content)
