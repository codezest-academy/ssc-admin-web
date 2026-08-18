import re

files_to_fix = [
    ('src/pages/articles/index.tsx', 'Failed to load articles'),
    ('src/pages/categories/index.tsx', 'Failed to load categories')
]

for filepath, error_msg in files_to_fix:
    with open(filepath, 'r') as f:
        content = f.read()

    replacement = f"""  if (isError) {{
    return (
      <div className="flex-1 w-full flex flex-col pt-10">
        <ErrorState title="{error_msg}" onRetry={{() => refetch()}} />
      </div>
    );
  }}

  return ("""
    
    content = content.replace('  return (', replacement, 1)

    with open(filepath, 'w') as f:
        f.write(content)
