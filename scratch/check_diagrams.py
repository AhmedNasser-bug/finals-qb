import json

def check():
    with open('public/examples/advanced-programming.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    questions = data.get("questions", [])
    count = 0
    for q in questions:
        text = q.get("question", "")
        has_diagram_tag = "[EXAMINE DIAGRAM]" in text
        has_diagram_field = bool(q.get("diagram"))
        
        if has_diagram_tag and not has_diagram_field:
            print(f"Question ID: {q.get('id')} has tag but NO DIAGRAM FIELD!")
            print(f"  Category: {q.get('category')}")
            print(f"  Text: {text[:100]}...")
            count += 1
            
    print(f"Total problematic questions: {count}")

if __name__ == '__main__':
    check()
