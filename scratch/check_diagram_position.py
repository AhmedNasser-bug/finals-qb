import json

def check():
    with open('public/examples/advanced-programming.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    questions = data.get("questions", [])
    count = 0
    for q in questions:
        diag = q.get("diagram")
        pos = q.get("diagramPosition")
        if pos and not diag:
            print(f"Question {q.get('id')} has diagramPosition '{pos}' but NO DIAGRAM!")
            count += 1
    print(f"Total questions with position but no diagram: {count}")

if __name__ == '__main__':
    check()
