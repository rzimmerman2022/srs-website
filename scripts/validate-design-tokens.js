#!/usr/bin/env node
/**
 * Design Token Validator
 * Validates that code follows design system rules contextually
 *
 * Based on DESIGN-SYSTEM-SOP.md Section 3: Contextual Typography Rules
 *
 * Usage:
 *   node scripts/validate-design-tokens.js
 *   npm run lint:design
 */

const fs = require('fs');
const path = require('path');

// Simple glob implementation without external dependency
function glob(pattern, baseDir = '.') {
  const results = [];

  function walkDir(dir) {
    try {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          // Skip node_modules, .next, etc.
          if (!['node_modules', '.next', '.git', 'staging', '_old'].some(skip => file.includes(skip))) {
            walkDir(filePath);
          }
        } else if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
          results.push(filePath);
        }
      }
    } catch (err) {
      // Ignore permission errors
    }
  }

  walkDir(baseDir);
  return results;
}

// Configuration
const config = {
  // Patterns that make text-sm VALID (contextual exceptions)
  validTextSmPatterns: [
    /flex\s+items-center.*gap-\d.*text-sm/,      // Icon-anchored lists
    /flex\s+items-start.*gap-\d.*text-sm/,       // Icon-anchored lists (start aligned)
    /uppercase.*tracking-wider.*text-sm/,         // Labels
    /text-sm.*font-(semibold|bold)/,              // Price tags, badges
    /text-sm.*uppercase/,                         // Section labels
    /IconCheck|Icon\w+.*text-sm/,                 // Icon components
    /<li.*text-sm/,                               // List items (often valid)
    /sublabel.*text-xs/,                          // Badge sublabels
    /text-xs.*text-gray-\d{3}/,                   // Captions
    /text-sm.*mb-\d/,                             // Labels with margin
  ],

  // Patterns that are ALWAYS violations (fail WCAG)
  contrastViolations: [
    { pattern: /text-charcoal\/50/, message: '50% opacity charcoal fails WCAG 4.5:1' },
    { pattern: /text-charcoal\/60/, message: '60% opacity charcoal fails WCAG 4.5:1' },
    { pattern: /text-gray-400/, message: 'gray-400 fails contrast on white backgrounds' },
    { pattern: /text-gray-500(?!\d)/, message: 'gray-500 often fails contrast - verify with WebAIM' },
  ],

  // Patterns that need manual review
  needsReview: [
    { pattern: /text-charcoal\/70/, message: 'Borderline contrast (70% opacity) - verify with WebAIM' },
    { pattern: /text-gray-600(?!\d)/, message: 'gray-600 is borderline on white - verify with WebAIM' },
  ],

  // Files to skip
  skipFiles: [
    'node_modules',
    '.next',
    'staging',
    '_old',
    '.test.',
    '.spec.',
    '.stories.',
  ],
};

function validateFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const issues = [];

  lines.forEach((line, index) => {
    const lineNum = index + 1;

    // Check for contrast violations (always errors)
    config.contrastViolations.forEach(({ pattern, message }) => {
      if (pattern.test(line)) {
        issues.push({
          line: lineNum,
          type: 'error',
          message: `Color contrast violation: ${message}`,
          code: line.trim().substring(0, 100),
        });
      }
    });

    // Check for needs-review patterns (warnings)
    config.needsReview.forEach(({ pattern, message }) => {
      if (pattern.test(line)) {
        issues.push({
          line: lineNum,
          type: 'warning',
          message: `Needs review: ${message}`,
          code: line.trim().substring(0, 100),
        });
      }
    });

    // Check for text-sm without valid context
    // Only flag if it looks like primary content (paragraphs)
    if (line.includes('text-sm') && !line.includes('text-sm-')) {
      const isValid = config.validTextSmPatterns.some(pattern => pattern.test(line));

      // Check if this looks like body content (paragraph tags, long className)
      const isPotentialBodyContent =
        (line.includes('<p') && line.includes('text-sm')) ||
        (line.includes('className="text-sm"') && !line.includes('span'));

      if (!isValid && isPotentialBodyContent) {
        issues.push({
          line: lineNum,
          type: 'review',
          message: 'text-sm on potential body content - verify it has icon/context anchor',
          code: line.trim().substring(0, 100),
        });
      }
    }
  });

  return issues;
}

// Main execution
console.log('\n========================================');
console.log('  Design System Token Validator');
console.log('  Based on DESIGN-SYSTEM-SOP.md');
console.log('========================================\n');

const appFiles = glob('**/*.tsx', path.join(process.cwd(), 'app'));
const componentFiles = glob('**/*.tsx', path.join(process.cwd(), 'components'));
const files = [...appFiles, ...componentFiles];

// Filter out skipped files
const filesToCheck = files.filter(file =>
  !config.skipFiles.some(skip => file.includes(skip))
);

console.log(`Checking ${filesToCheck.length} files...\n`);

let totalErrors = 0;
let totalWarnings = 0;
let totalReview = 0;

const fileIssues = {};

filesToCheck.forEach(file => {
  const issues = validateFile(file);
  if (issues.length > 0) {
    const relativePath = path.relative(process.cwd(), file);
    fileIssues[relativePath] = issues;

    issues.forEach(issue => {
      if (issue.type === 'error') totalErrors++;
      if (issue.type === 'warning') totalWarnings++;
      if (issue.type === 'review') totalReview++;
    });
  }
});

// Output results
Object.entries(fileIssues).forEach(([file, issues]) => {
  console.log(`\n${file}:`);
  issues.forEach(issue => {
    const icon = issue.type === 'error' ? '  [ERROR]' :
                 issue.type === 'warning' ? '  [WARN] ' :
                 '  [CHECK]';
    console.log(`${icon} Line ${issue.line}: ${issue.message}`);
  });
});

// Summary
console.log('\n========================================');
console.log('  SUMMARY');
console.log('========================================');
console.log(`  Errors:   ${totalErrors} (must fix)`);
console.log(`  Warnings: ${totalWarnings} (verify manually)`);
console.log(`  Review:   ${totalReview} (context-dependent)`);
console.log('========================================\n');

if (totalErrors > 0) {
  console.log('RESULT: FAILED - Fix errors before proceeding\n');
  process.exit(1);
} else if (totalWarnings > 0) {
  console.log('RESULT: PASSED with warnings - Review recommended\n');
  process.exit(0);
} else {
  console.log('RESULT: PASSED\n');
  process.exit(0);
}
