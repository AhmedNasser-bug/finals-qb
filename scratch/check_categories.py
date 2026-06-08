import json

def check():
    with open('public/examples/advanced-programming.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    questions = data.get("questions", [])
    flashcards = data.get("flashcards", [])
    terminology = data.get("terminology", {})
    achievements = data.get("achievements", [])

    q_cats = set(q.get("category") for q in questions)
    f_cats = set(fc.get("category") for fc in flashcards)
    t_cats = set(terminology.keys())

    print("Question categories:", q_cats)
    print("Flashcard categories:", f_cats)
    print("Terminology categories:", t_cats)

    print("\nCategories in questions but not in terminology:")
    print(q_cats - t_cats)

    print("\nCategories in terminology but not in questions:")
    print(t_cats - q_cats)

    print("\nCategories in flashcards but not in questions:")
    print(f_cats - q_cats)

    print("\nCategories in questions but not in flashcards:")
    print(q_cats - f_cats)

if __name__ == '__main__':
    check()
