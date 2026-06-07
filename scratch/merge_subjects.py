import json
import os

def merge_subjects():
    p1_path = 'd:/Study/Programming/Projects/finalsv2/finals-qb/public/examples/Merge-these-into-one-subject/Part1.json'
    p2_path = 'd:/Study/Programming/Projects/finalsv2/finals-qb/public/examples/Merge-these-into-one-subject/Part2.json'
    output_path = 'd:/Study/Programming/Projects/finalsv2/finals-qb/public/examples/Merge-these-into-one-subject/MergedSubject.json'

    print("Reading Part1.json...")
    with open(p1_path, 'r', encoding='utf-8') as f:
        part1 = json.load(f)

    print("Reading Part2.json...")
    with open(p2_path, 'r', encoding='utf-8') as f:
        part2 = json.load(f)

    # 1. Start with metadata from Part 1
    merged = {
        "id": part1.get("id", "merged-subject"),
        "name": part1.get("name", "Merged Subject"),
        "config": part1.get("config", {}),
        "questions": [],
        "flashcards": [],
        "terminology": {},
        "achievements": []
    }

    # 2. Merge Questions (ensure unique IDs)
    seen_q_ids = set()
    questions = []
    
    for q in part1.get("questions", []):
        q_id = q.get("id")
        seen_q_ids.add(q_id)
        questions.append(q)

    for q in part2.get("questions", []):
        q_id = q.get("id")
        if q_id in seen_q_ids:
            # Generate a new unique ID if duplicate exists
            base_id = q_id
            counter = 2
            while f"{base_id}-{counter}" in seen_q_ids:
                counter += 1
            new_id = f"{base_id}-{counter}"
            print(f"Warning: Duplicate Question ID '{q_id}' found in Part 2. Renamed to '{new_id}'.")
            q["id"] = new_id
            seen_q_ids.add(new_id)
        else:
            seen_q_ids.add(q_id)
        questions.append(q)

    merged["questions"] = questions
    print(f"Merged {len(questions)} questions ({len(part1.get('questions', []))} from Part1, {len(part2.get('questions', []))} from Part2)")

    # 3. Merge Flashcards
    seen_fc_ids = set()
    flashcards = []

    for fc in part1.get("flashcards", []):
        fc_id = fc.get("id")
        seen_fc_ids.add(fc_id)
        flashcards.append(fc)

    for fc in part2.get("flashcards", []):
        fc_id = fc.get("id")
        if fc_id in seen_fc_ids:
            base_id = fc_id
            counter = 2
            while f"{base_id}-{counter}" in seen_fc_ids:
                counter += 1
            new_id = f"{base_id}-{counter}"
            print(f"Warning: Duplicate Flashcard ID '{fc_id}' found in Part 2. Renamed to '{new_id}'.")
            fc["id"] = new_id
            seen_fc_ids.add(new_id)
        else:
            seen_fc_ids.add(fc_id)
        flashcards.append(fc)

    merged["flashcards"] = flashcards
    print(f"Merged {len(flashcards)} flashcards")

    # 4. Merge Terminology
    t1 = part1.get("terminology", {})
    t2 = part2.get("terminology", {})
    
    # Standardize terminology structure to dictionary
    if not isinstance(t1, dict):
        t1 = {}
    if not isinstance(t2, dict):
        t2 = {}

    all_categories = set(t1.keys()).union(set(t2.keys()))
    terminology = {}

    for cat in all_categories:
        cat_terms = []
        seen_terms = set()
        
        # Get terms from Part 1
        for entry in t1.get(cat, []):
            term = entry.get("term", "").strip()
            if term.lower() not in seen_terms:
                seen_terms.add(term.lower())
                cat_terms.append(entry)

        # Get terms from Part 2
        for entry in t2.get(cat, []):
            term = entry.get("term", "").strip()
            if term.lower() not in seen_terms:
                seen_terms.add(term.lower())
                cat_terms.append(entry)

        terminology[cat] = cat_terms

    merged["terminology"] = terminology
    print(f"Merged terminology for {len(terminology)} categories")

    # 5. Merge Achievements
    seen_ach_ids = set()
    achievements = []

    for ach in part1.get("achievements", []):
        ach_id = ach.get("id")
        seen_ach_ids.add(ach_id)
        achievements.append(ach)

    for ach in part2.get("achievements", []):
        ach_id = ach.get("id")
        if ach_id in seen_ach_ids:
            base_id = ach_id
            counter = 2
            while f"{base_id}-{counter}" in seen_ach_ids:
                counter += 1
            new_id = f"{base_id}-{counter}"
            print(f"Warning: Duplicate Achievement ID '{ach_id}' found in Part 2. Renamed to '{new_id}'.")
            ach["id"] = new_id
            seen_ach_ids.add(new_id)
        else:
            seen_ach_ids.add(ach_id)
        achievements.append(ach)

    merged["achievements"] = achievements
    print(f"Merged {len(achievements)} achievements")

    # 6. Save Merged Subject File
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(merged, f, indent=4, ensure_ascii=False)
    
    print(f"Successfully merged subject saved to: {output_path}")

if __name__ == "__main__":
    merge_subjects()
