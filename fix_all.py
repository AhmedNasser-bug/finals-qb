import re

# Fix tailwind.config.ts duplicate keyframes
with open('tailwind.config.ts', 'r') as f:
    content = f.read()

content = content.replace("keyframes: {\n  			...({} as Record<string, Record<string, Record<string, string>>>),\n  			'pulse-glow': {\n  				'0%, 100%': { opacity: '1' },\n  				'50%': { opacity: '0.6' },\n  			},\n  			'fade-in': {\n  				from: { opacity: '0' },\n  				to: { opacity: '1' },\n  			},\n  			'slide-up': {\n  				from: { opacity: '0', transform: 'translateY(8px)' },\n  				to: { opacity: '1', transform: 'translateY(0)' },\n  			},\n  		}", "/* keyframes merged above */")

with open('tailwind.config.ts', 'w') as f:
    f.write(content)

# Fix components/mold/game-screen.tsx
with open('components/mold/game-screen.tsx', 'r') as f:
    content = f.read()

# Fix config.difficulty
content = content.replace('config.difficulty === "hard"', 'config.mode === "hardcore"')

# Fix grade comparisons (B vs B+)
content = content.replace('grade === "B" || grade === "C"', 'grade === "B+" || grade === "C+"')

with open('components/mold/game-screen.tsx', 'w') as f:
    f.write(content)

# Fix components/mold/subject-importer.tsx
with open('components/mold/subject-importer.tsx', 'r') as f:
    content = f.read()

content = content.replace('textareaRef.current?.focus()', '// textareaRef.current?.focus()')

with open('components/mold/subject-importer.tsx', 'w') as f:
    f.write(content)

# Fix lib/game-engine.tsx
with open('lib/game-engine.tsx', 'r') as f:
    content = f.read()

content = content.replace('config.mode === "full-revision"', 'config.mode === "survival"')

with open('lib/game-engine.tsx', 'w') as f:
    f.write(content)
