import json

def check():
    with open('public/examples/advanced-programming.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    questions = data.get("questions", [])
    seen = set()
    for q in questions:
        diag = q.get("diagram")
        if diag and diag not in seen:
            seen.add(diag)
            print("-" * 40)
            print(f"Question Category: {q.get('category')}")
            print(f"Question ID: {q.get('id')}")
            print("Diagram:")
            print(diag)
            print("-" * 40)

if __name__ == '__main__':
    check()
