import fs from 'fs';
import { parseSubjectJson, validateSubjectData } from '../lib/subject/subject-persistence.ts';

const p = 'd:/Study/Programming/Projects/finalsv2/finals-qb/public/examples/Merge-these-into-one-subject/MergedSubject.json';
const raw = fs.readFileSync(p, 'utf8');

const result = parseSubjectJson(raw);
if (result.parseError) {
  console.error("Parse Error:", result.parseError);
} else {
  console.log("JSON parsed successfully.");
  const validation = validateSubjectData(result.data);
  console.log("Validation Result:", validation.valid ? "VALID" : "INVALID");
  if (!validation.valid) {
    console.error("Validation Errors:", validation.errors);
  }
  if (validation.warnings.length > 0) {
    console.warn("Validation Warnings:", validation.warnings);
  }
}
