import json

def check():
    with open('public/examples/advanced-programming.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    flashcards = data.get("flashcards", [])
    terminology = data.get("terminology", {})

    # Gather terms from terminology
    t_terms = {}
    for cat, entries in terminology.items():
        t_terms[cat] = set(e.get("term").strip().lower() for e in entries)

    # Gather terms from flashcards
    fc_terms = {}
    for fc in flashcards:
        cat = fc.get("category")
        if cat not in fc_terms:
            fc_terms[cat] = set()
        fc_terms[cat].add(fc.get("term").strip().lower())

    all_cats = set(t_terms.keys()).union(set(fc_terms.keys()))
    
    for cat in all_cats:
        t_set = t_terms.get(cat, set())
        fc_set = fc_terms.get(cat, set())
        
        diff_t = t_set - fc_set
        diff_fc = fc_set - t_set
        
        if diff_t or diff_fc:
            print(f"Category: {cat}")
            if diff_t:
                print(f"  In terminology but NOT in flashcards: {diff_t}")
            if diff_fc:
                print(f"  In flashcards but NOT in terminology: {diff_fc}")

if __name__ == '__main__':
    check()
