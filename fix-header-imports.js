const fs = require('fs');
let headerWell = fs.readFileSync('components/mold/home/header-well.tsx', 'utf8');
headerWell = headerWell.replace(
  'import { cn } from "@/lib/utils"\nimport { calculateGrade, gradeBgColor } from "@/lib/mold-types"\n"use client"',
  '"use client"\nimport { cn } from "@/lib/utils"\nimport { calculateGrade, gradeBgColor } from "@/lib/mold-types"'
);
fs.writeFileSync('components/mold/home/header-well.tsx', headerWell);
