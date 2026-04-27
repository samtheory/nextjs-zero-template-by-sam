import re
import os

pages = [
    ("src/app/docs/zustand/page.tsx", "/how-to-zustand", "src/features/how-to-zustand"),
    ("src/app/docs/zod/page.tsx", "/how-to-zod", "src/features/how-to-zod"),
    ("src/app/docs/authentication/page.tsx", "/how-to-auth", "src/features/how-to-auth"),
    ("src/app/docs/build-feature/page.tsx", "/how-to-build-feature", "src/features/how-to-build-feature"),
    ("src/app/docs/build-ui-component/page.tsx", "/how-to-build-ui", "src/features/how-to-build-ui"),
    ("src/app/docs/env-config/page.tsx", "/how-to-env-config", "src/features/how-to-env-config"),
    ("src/app/docs/core-services/page.tsx", "/how-to-core-services", "src/features/how-to-core-services"),
    ("src/app/docs/framer-motion/page.tsx", "/how-to-framer-motion", "src/features/how-to-framer-motion"),
    ("src/app/docs/form-validation/page.tsx", "/how-to-form-validation", "src/features/how-to-form-validation"),
    ("src/app/docs/typescript/page.tsx", "/how-to-typescript", "src/features/how-to-typescript"),
    ("src/app/docs/tailwind-variables/page.tsx", "/how-to-tailwind", "src/features/how-to-tailwind"),
    ("src/app/docs/react-query/page.tsx", "/how-to-react-query", "src/features/how-to-react-query"),
    ("src/app/docs/react-hook-form-zod/page.tsx", "/how-to-react-hook-form", "src/features/how-to-react-hook-form"),
    ("src/app/docs/pocketbase/page.tsx", "/how-to-pocketbase", "src/features/how-to-pocketbase"),
]

for filepath, href, label in pages:
    full_path = os.path.join(r"D:\sam\nextjs-zero-template-by-sam", filepath)
    if not os.path.exists(full_path):
        print(f"ERROR: File not found: {filepath}")
        continue

    with open(full_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Replace the Working Example DocsSection block with WorkingExampleCard
    old_section_pattern = r'        <DocsSection className="p-4 bg-secondary-50/80 border border-secondary-200 rounded-xl transition-colors duration-200 dark:bg-secondary-950/80 dark:border-secondary-700">\s+<p className="text-sm font-semibold text-secondary-700 mb-1 dark:text-secondary-200">Working Example</p>\s+<p className="text-xs text-secondary-600 mb-3 dark:text-secondary-300">Open the working example for this topic\.</p>\s+<Link[^<]+</Link[^<]+<span[^>]+>[^<]+<\/span>\s+<\/Link>\s+<\/DocsSection>'
    
    new_section = f'        <WorkingExampleCard href="{href}" label="{label}" />'
    
    new_content = re.sub(old_section_pattern, new_section, content, flags=re.DOTALL)
    
    if new_content == content:
        print(f"WARNING: No replacement made in {filepath}")
        start_marker = '        <DocsSection className="p-4 bg-secondary-50/80 border border-secondary-200 rounded-xl transition-colors duration-200 dark:bg-secondary-950/80 dark:border-secondary-700">'
        end_marker = '        </DocsSection>'
        start_idx = new_content.find(start_marker)
        if start_idx != -1:
            end_idx = new_content.find(end_marker, start_idx)
            if end_idx != -1:
                end_idx += len(end_marker)
                section_content = new_content[start_idx:end_idx]
                if "Working Example" in section_content:
                    new_content = new_content[:start_idx] + f'        <WorkingExampleCard href="{href}" label="{label}" />' + new_content[end_idx:]
                    print(f"  Fixed with fallback in {filepath}")
                else:
                    print(f"  Could not find Working Example block in {filepath}")
    else:
        print(f"OK: {filepath}")
    
    if "WorkingExampleCard" not in new_content:
        new_content = new_content.replace(
            'import { DocsSection } from "../_components/DocsSection";',
            'import { DocsSection } from "../_components/DocsSection";\nimport { WorkingExampleCard } from "../_components/WorkingExampleCard";'
        )
    
    if '<Link' not in new_content and 'import Link' in new_content:
        new_content = re.sub(r'import Link from "next/link";\n', '', new_content)
        print(f"  Removed unused Link import from {filepath}")
    
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    
    print(f"Written: {filepath}")

print("Done!")
