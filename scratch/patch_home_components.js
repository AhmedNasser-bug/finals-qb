const fs = require('fs');
let content = fs.readFileSync('components/mold/home/home-screen-components.tsx', 'utf-8');

content = content.replace(
  /onClick=\{\(\) => \{\n\s*setView\("home"\)\n\s*handleModeSelect\("speedrun"\)\n\s*\}\}/,
  `onClick={() => {\n          setView("home")\n          handleModeSelect("speedrun")\n        }}\n        title="Core Dashboard"`
);
content = content.replace(
  /onClick=\{\(\) => setView\("stats"\)\}/,
  `onClick={() => setView("stats")}\n        title="Statistics"`
);
content = content.replace(
  /onClick=\{\(\) => setShowEncyclopedia\(true\)\}/,
  `onClick={() => setShowEncyclopedia(true)}\n        title="Data Encyclopedia"`
);
content = content.replace(
  /onClick=\{\(\) => setShowGallery\(true\)\}/,
  `onClick={() => setShowGallery(true)}\n        title="Achievements"`
);
content = content.replace(
  /onClick=\{onChangeSubject\}/,
  `onClick={onChangeSubject}\n        title="Switch Subject"`
);

const icons = ['TerminalIcon', 'BarChart3', 'BookOpen', 'Trophy', 'RotateCcw'];
icons.forEach(icon => {
  content = content.replace(new RegExp(`(<${icon} [^>]+?)( /)?(>)`, 'g'), `$1 aria-hidden="true" />`);
});
fs.writeFileSync('components/mold/home/home-screen-components.tsx', content);
