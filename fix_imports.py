import re

files_to_fix = [
    'src/pages/mockTests/builder.tsx',
    'src/pages/products/builder.tsx'
]

for file in files_to_fix:
    with open(file, 'r') as f:
        content = f.read()
    
    # Remove the bad inline import
    content = content.replace('import {\nimport { ErrorState } from "@/components/ui/error-state";\n', 'import {\n')
    
    # Add it to the top
    if 'import { ErrorState } from "@/components/ui/error-state";' not in content:
        content = 'import { ErrorState } from "@/components/ui/error-state";\n' + content
        
    with open(file, 'w') as f:
        f.write(content)
