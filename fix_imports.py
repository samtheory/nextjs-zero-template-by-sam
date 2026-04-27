import os

pages = [
    "src/app/docs/zustand/page.tsx",
    "src/app/docs/zod/page.tsx",
    "src/app/docs/authentication/page.tsx",
    "src/app/docs/build-feature/page.tsx",
    "src/app/docs/build-ui-component/page.tsx",
    "src/app/docs/env-config/page.tsx",
    "src/app/docs/core-services/page.tsx",
    "src/app/docs/framer-motion/page.tsx",
    "src/app/docs/form-validation/page.tsx",
    "src/app/docs/typescript/page.tsx",
    "src/app/docs/tailwind-variables/page.tsx",
    "src/app/docs/react-query/page.tsx",
    "src/app/docs/react-hook-form-zod/page.tsx",
    "src/app/docs/pocketbase/page.tsx",
]

for filepath in pages:
    full_path = os.path.join(r"D:\sam\nextjs-zero-template-by-sam", filepath)
    if not os.path.exists(full_path):
        print(f"ERROR: File not found: {filepath}")
        continue

    with open(full_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    if "WorkingExampleCard" in content and 'import { WorkingExampleCard }' not in content:
        print(f"Adding import for {filepath}")
        if 'import { DocsSection } from "../_components/DocsSection";' in content:
            new_content = content.replace(
                'import { DocsSection } from "../_components/DocsSection";',
                'import { DocsSection } from "../_components/DocsSection";\nimport { WorkingExampleCard } from "../_components/WorkingExampleCard";'
            )
        else:
            # Fallback for pages that might not have DocsSection?
            # Find the last import and add after it
            lines = content.splitlines()
            last_import_idx = -1
            for i, line in enumerate(lines):
                if line.startswith('import '):
                    last_import_idx = i
            if last_import_idx != -1:
                lines.insert(last_import_idx + 1, 'import { WorkingExampleCard } from "../_components/WorkingExampleCard";')
                new_content = "\n".join(lines)
            else:
                new_content = content # Should not happen

        with open(full_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"  Fixed: Added import to {filepath}")
    else:
        print(f"SKIP: {filepath} (Already has import or doesn't use component)")

print("Done!")
