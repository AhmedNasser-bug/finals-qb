import json

def check():
    with open('public/examples/advanced-programming.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    questions = data.get("questions", [])
    seen = {}
    duplicates = []
    for q in questions:
        qtext = q.get("question", "").strip()
        if qtext in seen:
            duplicates.append((q.get("id"), seen[qtext], qtext))
        seen[qtext] = q.get("id")

    print(f"Total duplicates found: {len(duplicates)}")
    for d in duplicates:
        print(f"Duplicate between {d[0]} and {d[1]}:")
        print(f"  Text: {d[2][:100]}...")

if __name__ == '__main__':
    check()
