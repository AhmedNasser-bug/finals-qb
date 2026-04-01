import re

with open('components/mold/game-screen.tsx', 'r') as f:
    content = f.read()

content = content.replace('state.config?.difficulty?.toUpperCase()', 'state.config?.mode?.toUpperCase()')
content = content.replace('grade === "B"', 'grade === "B+"')
content = content.replace('grade === "C"', 'grade === "C+"')

with open('components/mold/game-screen.tsx', 'w') as f:
    f.write(content)


with open('lib/game-engine.tsx', 'r') as f:
    content = f.read()

content = content.replace('"full-revision"', '"survival"')
content = content.replace('case "survival":', 'case "survival":\n    case "survival":') # this might be duplicate but we just replaced the string

with open('lib/game-engine.tsx', 'w') as f:
    f.write(content)
