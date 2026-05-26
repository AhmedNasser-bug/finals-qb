# Skill: find-skills

A skill protocol for quickly locating existing agent tools, workflows, or instructions based on a requested workflow name.

---

## Usage

When requested to perform a specific predefined task or if you need to recall a workflow by name:

1. **Query Workflow Folders**:
   ```bash
   find .agent/workflows .agents/workflows .agent/skills -type f -name "*[keyword]*"
   ```
2. **Review Descriptions**:
   - Read the `.agent/README.md` and `.agents/README.md` to determine if the task requires a narrow single-agent workflow or a multi-agent orchestration.
   - Use `cat` to read the identified `.md` file.

3. **Execute**:
   Follow the detailed Execution Protocol outlined in the specific workflow file.
