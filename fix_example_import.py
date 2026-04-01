import re

with open('components/mold/subject-selector.tsx', 'r') as f:
    content = f.read()

# Make sure we're rendering the examples if they exist
content = content.replace("export function SubjectSelector({", """
import { loadSubjects, saveSubjects, addSubject, removeSubject } from "@/lib/subject-persistence"
import { EXAMPLES, getExampleSubject } from "@/lib/examples"

export function SubjectSelector({""")

with open('components/mold/subject-selector.tsx', 'w') as f:
    f.write(content)
