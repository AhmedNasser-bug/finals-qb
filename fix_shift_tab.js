const fs = require('fs');

function fixFocusTrap(filepath) {
  let content = fs.readFileSync(filepath, 'utf8');

  // Replace the shift-tab condition to also handle the case where the modal itself is focused
  content = content.replace(
    /if \(e\.shiftKey && document\.activeElement === first\) {/,
    'if (e.shiftKey && (document.activeElement === first || document.activeElement === el)) {'
  );

  fs.writeFileSync(filepath, content);
}

fixFocusTrap('components/mold/subject/subject-importer.tsx');
fixFocusTrap('components/mold/home/add-questions-wizard.tsx');
// Lets fix the other ones while we are at it
fixFocusTrap('components/mold/common/theme-switcher-modal.tsx');
fixFocusTrap('components/mold/common/layout-switcher-modal.tsx');
fixFocusTrap('components/mold/common/share-modal.tsx');
fixFocusTrap('components/mold/common/encyclopedia-overlay.tsx');
fixFocusTrap('components/mold/achievement/achievement-gallery.tsx');
fixFocusTrap('components/mold/subject/share-receiver.tsx');
