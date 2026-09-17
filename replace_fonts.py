import re

def replace_font_sizes(content):
    # Mapping exact or pattern matches
    replacements = [
        (r'font-size:\s*clamp\([^\)]+\);', r'font-size: var(--font-size-3xl);'), # For large clamps
        (r'font-size:\s*3rem;', r'font-size: var(--font-size-3xl);'),
        (r'font-size:\s*2\.8rem;', r'font-size: var(--font-size-3xl);'),
        (r'font-size:\s*2\.6rem;', r'font-size: var(--font-size-3xl);'),
        (r'font-size:\s*2\.4rem;', r'font-size: var(--font-size-2xl);'),
        (r'font-size:\s*2\.2rem;', r'font-size: var(--font-size-2xl);'),
        (r'font-size:\s*2\.1rem;', r'font-size: var(--font-size-2xl);'),
        (r'font-size:\s*2rem;', r'font-size: var(--font-size-2xl);'),
        (r'font-size:\s*1\.8rem;', r'font-size: var(--font-size-xl);'),
        (r'font-size:\s*1\.6rem;', r'font-size: var(--font-size-xl);'),
        (r'font-size:\s*1\.5rem;', r'font-size: var(--font-size-lg);'),
        (r'font-size:\s*1\.4rem;', r'font-size: var(--font-size-lg);'),
        (r'font-size:\s*1\.3rem;', r'font-size: var(--font-size-lg);'),
        (r'font-size:\s*1\.25rem;', r'font-size: var(--font-size-lg);'),
        (r'font-size:\s*1\.2rem;', r'font-size: var(--font-size-lg);'),
        (r'font-size:\s*1\.15rem;', r'font-size: var(--font-size-md);'),
        (r'font-size:\s*1\.1rem;', r'font-size: var(--font-size-md);'),
        (r'font-size:\s*1\.05rem;', r'font-size: var(--font-size-base);'),
        (r'font-size:\s*1rem;', r'font-size: var(--font-size-base);'),
        (r'font-size:\s*16px;', r'font-size: var(--font-size-base);'),
        (r'font-size:\s*0\.95rem;', r'font-size: var(--font-size-sm);'),
        (r'font-size:\s*0\.92rem;', r'font-size: var(--font-size-sm);'),
        (r'font-size:\s*0\.9rem;', r'font-size: var(--font-size-sm);'),
        (r'font-size:\s*0\.88rem;', r'font-size: var(--font-size-sm);'),
        (r'font-size:\s*0\.85rem;', r'font-size: var(--font-size-xs);'),
        (r'font-size:\s*0\.82rem;', r'font-size: var(--font-size-xs);'),
        (r'font-size:\s*0\.8rem;', r'font-size: var(--font-size-xs);'),
        (r'font-size:\s*0\.75rem;', r'font-size: var(--font-size-xs);'),
        (r'font-size:\s*0\.72rem;', r'font-size: var(--font-size-xs);'),
        (r'font-size:\s*28px;', r'font-size: var(--font-size-2xl);'),
    ]
    
    for pattern, replacement in replacements:
        content = re.sub(pattern, replacement, content)
        
    return content

with open('style.css', 'r', encoding='utf-8') as f:
    content = f.read()

# Protect the newly added variables in root
root_end_idx = content.find('/* Dark mode variable overrides */')
header = content[:root_end_idx]
body = content[root_end_idx:]

new_body = replace_font_sizes(body)
new_content = header + new_body

with open('style.css', 'w', encoding='utf-8') as f:
    f.write(new_content)
