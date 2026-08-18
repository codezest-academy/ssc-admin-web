import re
import os

files_to_fix = [
    'src/pages/articles/index.tsx',
    'src/pages/categories/index.tsx',
    'src/pages/chapters/index.tsx',
    'src/pages/lessons/index.tsx',
    'src/pages/mockTests/builder.tsx',
    'src/pages/mockTests/editor.tsx',
    'src/pages/products/editor.tsx'
]

for file in files_to_fix:
    with open(file, 'r') as f:
        content = f.read()

    # Find the first if statement checking for loading
    def inject_error(m):
        original = m.group(0)
        return 'if (isError) {\n    return <ErrorState title="Failed to load data" onRetry={() => refetch()} />;\n  }\n\n  ' + original

    content = re.sub(r'if\s*\([^)]*Loading[^)]*\)\s*\{', inject_error, content, count=1)
    
    with open(file, 'w') as f:
        f.write(content)

