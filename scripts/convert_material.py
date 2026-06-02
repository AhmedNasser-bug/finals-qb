import sys
import os
from markitdown import MarkItDown

def main():
    if len(sys.argv) < 2:
        print("Error: Missing input file path.", file=sys.stderr)
        sys.exit(1)
        
    input_path = sys.argv[1]
    if not os.path.exists(input_path):
        print(f"Error: File '{input_path}' does not exist.", file=sys.stderr)
        sys.exit(1)
        
    try:
        md = MarkItDown()
        result = md.convert(input_path)
        # Write output to stdout with utf-8 encoding to support all characters
        sys.stdout.buffer.write(result.text_content.encode('utf-8'))
    except Exception as e:
        print(f"Error during conversion: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
