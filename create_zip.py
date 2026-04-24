import zipfile
import os

def create_zip(output_filename, source_dir):
    print(f"Creating {output_filename}...")
    
    # Directories to exclude entirely
    exclude_dirs = {'venv'}
    # Directories to include as empty folders (exclude contents)
    keep_empty_dirs = {'data', 'models'}
    
    with zipfile.ZipFile(output_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(source_dir):
            # Calculate relative path from source_dir
            rel_path = os.path.relpath(root, source_dir)
            if rel_path == '.':
                rel_path = ''
            
            # Split path for easier checking
            path_parts = rel_path.split(os.sep) if rel_path else []
            
            # Skip venv and its contents
            if any(part.lower() in exclude_dirs for part in path_parts):
                continue
            
            # Check if current path is inside a 'keep_empty' directory
            # We check if any parent part is in keep_empty
            top_level_dir = path_parts[0].lower() if path_parts else None
            is_inside_restricted = top_level_dir in keep_empty_dirs
            
            # Add the folder itself to the zip (except for the root '.')
            if rel_path:
                # ZipFile entries should use forward slashes
                zip_dir_path = rel_path.replace(os.sep, '/') + '/'
                zipf.write(root, zip_dir_path)
            
            # Only add files if we are NOT inside a restricted (Data/models) directory
            if not is_inside_restricted:
                for file in files:
                    # Skip the script itself and the output zip file
                    if file == output_filename or file == 'create_zip.py':
                        continue
                    
                    file_path = os.path.join(root, file)
                    zip_file_path = os.path.join(rel_path, file).replace(os.sep, '/')
                    
                    try:
                        zipf.write(file_path, zip_file_path)
                        print(f"  Added: {zip_file_path}")
                    except (PermissionError, OSError) as e:
                        print(f"  SKIPPED (Access Denied/Locked): {zip_file_path}")
            else:
                # We skip files inside restricted folders
                pass

    print(f"\nSuccessfully created {output_filename}")

if __name__ == "__main__":
    # Specify the name of the zip file
    create_zip("EmiHate_Submission.zip", ".")
