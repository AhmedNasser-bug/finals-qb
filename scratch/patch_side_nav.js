const fs = require('fs');
let content = fs.readFileSync('components/mold/home/side-nav-bar.tsx', 'utf-8');
const titleMap = {
  onShowStats: 'Statistics',
  onShowEncyclopedia: 'Encyclopedia',
  onShowGallery: 'Achievements',
  onChangeSubject: 'Switch Subject',
  onImportNew: 'Import JSON',
  onAddQuestions: 'Add questions',
  onDownloadHtml: 'Download Q&A Sheet',
  onDownloadPdf: 'Questions PDF',
  onDownloadSolvedPdf: 'Solved Questions PDF',
  onInitialize: 'START QUIZ'
};
for (const [action, title] of Object.entries(titleMap)) {
  content = content.replace(
    new RegExp(`onClick={${action}}([\\s\\S]*?)(>)`),
    `onClick={${action}}\n          title="${title}"$1$2`
  );
}
const icons = ['TerminalIcon', 'BarChart3', 'BookOpen', 'Trophy', 'RotateCcw', 'Plus', 'Sparkles', 'Download', 'FileText'];
icons.forEach(icon => {
  content = content.replace(new RegExp(`(<${icon} [^>]+?)(>)`, 'g'), `$1 aria-hidden="true"$2`);
});
fs.writeFileSync('components/mold/home/side-nav-bar.tsx', content);
