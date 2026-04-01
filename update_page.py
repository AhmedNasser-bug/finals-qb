import re

with open('app/page.tsx', 'r') as f:
    content = f.read()

# Replace the "onboarding" logic with SubjectSelector that shows the system templates
# If we have 0 subjects, we just show "selecting" instead of "onboarding".
# The new design handles "onboarding" inside SubjectSelector by showing System Templates.

content = content.replace('setRootView(stored.length === 0 ? "onboarding" : "selecting")', 'setRootView("selecting")')
content = content.replace('setRootView(updated.length === 0 ? "onboarding" : "selecting")', 'setRootView("selecting")')
content = content.replace('setRootView(subjects.length > 0 ? "selecting" : "onboarding")', 'setRootView("selecting")')
content = content.replace('setRootView(stored.length === 0 ? "onboarding" : "selecting")', 'setRootView("selecting")')

with open('app/page.tsx', 'w') as f:
    f.write(content)
