import re
import os

pages = [
    'src/pages/subjects/index.tsx',
    'src/pages/chapters/index.tsx',
    'src/pages/lessons/index.tsx',
    'src/pages/mockTests/index.tsx',
    'src/pages/mockTests/editor.tsx',
    'src/pages/mockTests/builder.tsx',
    'src/pages/products/index.tsx',
    'src/pages/products/builder.tsx',
    'src/pages/products/editor.tsx',
    'src/pages/users/index.tsx',
    'src/pages/feedback/index.tsx',
    'src/pages/purchases/index.tsx',
    'src/pages/categories/index.tsx',
    'src/pages/articles/index.tsx'
]

for page in pages:
    if not os.path.exists(page): continue
    with open(page, 'r') as f:
        content = f.read()

    original_content = content

    if "import { ErrorState }" not in content and "import {ErrorState}" not in content:
        import_match = list(re.finditer(r'^import .*?;?\n', content, re.MULTILINE))
        if import_match:
            last_import = import_match[-1]
            content = content[:last_import.end()] + 'import { ErrorState } from "@/components/ui/error-state";\n' + content[last_import.end():]
        else:
            content = 'import { ErrorState } from "@/components/ui/error-state";\n' + content

    def replace_query(m):
        inner = m.group(1)
        if "isError" not in inner:
            inner += ", isError, refetch"
        return f"const {{ {inner} }} = useQuery("

    content = re.sub(r'const\s+\{\s*([^}]+isLoading[^}]*)\s*\}\s*=\s*useQuery\(', replace_query, content, count=1)

    if "if (isError)" not in content:
        def replace_loading(m):
            original = m.group(0)
            return 'if (isError) {\n    return <ErrorState title="Failed to load data" onRetry={() => refetch()} />;\n  }\n\n  ' + original

        content = re.sub(r'if\s*\([^)]*isLoading[^)]*\)\s*\{', replace_loading, content, count=1)

    if content != original_content:
        with open(page, 'w') as f:
            f.write(content)
        print(f"Updated {page}")

