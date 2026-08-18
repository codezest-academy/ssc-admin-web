import os
import re

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
    if not os.path.exists(page):
        print(f"Skipping {page} - does not exist")
        continue
    
    with open(page, 'r') as f:
        content = f.read()

    # check if already has ErrorState imported
    if "import { ErrorState }" not in content and "import {ErrorState}" not in content:
        # find the last import
        import_match = list(re.finditer(r'^import .*?;?\n', content, re.MULTILINE))
        if import_match:
            last_import = import_match[-1]
            content = content[:last_import.end()] + 'import { ErrorState } from "@/components/ui/error-state";\n' + content[last_import.end():]
        else:
            content = 'import { ErrorState } from "@/components/ui/error-state";\n' + content

    # Check if isError is already used for the primary query.
    # A bit naive but we look for `} = useQuery(`
    # and if it doesn't have `isError`, add it.
    
    # We will just do a dry run of what useQueries we find
    queries = re.findall(r'const\s+\{\s*([^}]+)\s*\}\s*=\s*useQuery\(', content)
    print(f"--- {page} ---")
    print(queries)

