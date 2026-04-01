import re

with open('lib/examples.ts', 'r') as f:
    content = f.read()

content = content.replace('"MultipleChoice"', '"MCQ"')

# Wait, flashcards don't have front/back?
# let's check mold-types.ts
