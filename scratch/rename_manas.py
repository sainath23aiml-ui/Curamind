
import os
import re

def replace_in_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace cases
    new_content = re.sub(r'manas', 'curamind', content)
    new_content = re.sub(r'Manas', 'CuraMind', new_content)
    new_content = re.sub(r'MANAS', 'CURAMIND', new_content)
    
    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated: {file_path}")

def main():
    root_dir = '/Users/sainath/Downloads/manas_-sensory-support'
    for root, dirs, files in os.walk(root_dir):
        if 'node_modules' in dirs:
            dirs.remove('node_modules')
        if '.git' in dirs:
            dirs.remove('.git')
            
        for file in files:
            if file.endswith(('.tsx', '.ts', '.css', '.html', '.json', '.md')):
                file_path = os.path.join(root, file)
                replace_in_file(file_path)

if __name__ == "__main__":
    main()
