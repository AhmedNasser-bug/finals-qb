const fs = require('fs');
let headerWell = fs.readFileSync('components/mold/home/header-well.tsx', 'utf8');
headerWell = headerWell.replace(
  `{runCount > 0 && (
              <div
                className={cn("mt-1.5 font-mono text-[10px] px-2 py-0.5 rounded border uppercase tracking-widest font-bold", gradeBgColor(calculateGrade(visualAccuracyPct)))}
                title={\`Current Grade: \${calculateGrade(visualAccuracyPct)}\`}
              >
                GRADE {calculateGrade(visualAccuracyPct)}
              </div>
            )}
            </div>`,
  `{runCount > 0 && (
              <div
                className={cn("mt-1.5 font-mono text-[10px] px-2 py-0.5 rounded border uppercase tracking-widest font-bold", gradeBgColor(calculateGrade(visualAccuracyPct)))}
                title={\`Current Grade: \${calculateGrade(visualAccuracyPct)}\`}
              >
                GRADE {calculateGrade(visualAccuracyPct)}
              </div>
            )}`
);
fs.writeFileSync('components/mold/home/header-well.tsx', headerWell);
