#!/usr/bin/env python3
"""
WCAG 2.1 AA Color Contrast Compliance Fixer
Fixes color contrast issues in questionnaire components
"""

import re
import os

# Base directory
BASE_DIR = "/Users/ryanzimmerman/MACBOOK - Projects/SRS - Website/dev_claude-opus-4-5-20251101_2025-12-18_204627"

# Files to fix
files_to_fix = [
    "components/questionnaire/QuestionnaireContainer.tsx",
    "components/questionnaire/QuestionnaireDark.tsx",
    "components/questionnaire/ModuleNav.tsx",
]

def fix_file(filepath):
    """Fix color contrast issues in a single file"""
    full_path = os.path.join(BASE_DIR, filepath)

    with open(full_path, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content

    # For QuestionnaireContainer.tsx
    if 'QuestionnaireContainer.tsx' in filepath:
        # Fix font size issues - minimum 12px (text-xs)
        content = re.sub(r'text-\[9px\]', 'text-xs', content)
        content = re.sub(r'text-\[10px\]', 'text-xs', content)

        # Fix text-gray-500 on light backgrounds (need text-gray-700 for better contrast)
        # Be selective - only fix the ones on light backgrounds
        replacements = [
            ('text-sm text-gray-500">Total Questions', 'text-sm text-gray-700">Total Questions'),
            ('text-sm text-gray-500">Required', 'text-sm text-gray-700">Required'),
            ('text-sm text-gray-500">Sections', 'text-sm text-gray-700">Sections'),
            ('text-sm text-gray-500">Minutes', 'text-sm text-gray-700">Minutes'),
            ('text-center text-sm text-gray-500 mt-6', 'text-center text-sm text-gray-700 mt-6'),
            ('text-xs text-gray-500" aria-label=', 'text-xs text-gray-700" aria-label='),
            ('text-sm text-gray-500">{currentModule?.subtitle}', 'text-sm text-gray-700">{currentModule?.subtitle}'),
            ('text-gray-500">Syncing with cloud storage', 'text-gray-700">Syncing with cloud storage'),
        ]

        for old, new in replacements:
            content = content.replace(old, new)

    # For QuestionnaireDark.tsx
    if 'QuestionnaireDark.tsx' in filepath:
        # Fix text-gray-400 on dark backgrounds (need text-gray-300 for better contrast)
        # Line 214 specifically
        content = re.sub(
            r'<span className="text-sm text-gray-400 mt-1 block">',
            '<span className="text-sm text-gray-300 mt-1 block">',
            content
        )

    # For ModuleNav.tsx
    if 'ModuleNav.tsx' in filepath:
        # Fix text-gray-500 heading on glass background
        content = content.replace(
            'text-sm font-bold text-gray-500 uppercase',
            'text-sm font-bold text-gray-700 uppercase'
        )

    # Write back if changed
    if content != original_content:
        with open(full_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✓ Fixed {filepath}")
        return True
    else:
        print(f"- No changes needed in {filepath}")
        return False

def main():
    print("WCAG 2.1 AA Color Contrast Compliance Fixer")
    print("=" * 50)

    fixed_count = 0
    for filepath in files_to_fix:
        if fix_file(filepath):
            fixed_count += 1

    print("=" * 50)
    print(f"Fixed {fixed_count} file(s)")

if __name__ == '__main__':
    main()
