import json

def check():
    with open('public/examples/advanced-programming.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    questions = data.get("questions", [])
    
    tf_issues = 0
    option_label_issues = 0
    for q in questions:
        qid = q.get("id")
        qtype = q.get("type")
        options = q.get("options", [])
        
        if qtype == "TrueFalse":
            if len(options) != 2:
                print(f"TrueFalse Question {qid} does not have 2 options, has {len(options)}")
                tf_issues += 1
            else:
                texts = [opt.get("text") for opt in options]
                if "True" not in texts or "False" not in texts:
                    print(f"TrueFalse Question {qid} does not have 'True'/'False' texts: {texts}")
                    tf_issues += 1
                    
        for idx, opt in enumerate(options):
            expected_label = chr(65 + idx) # A, B, C...
            if opt.get("label") != expected_label:
                print(f"Question {qid} option index {idx} has label '{opt.get('label')}', expected '{expected_label}'")
                option_label_issues += 1
                
    print(f"Total TF issues: {tf_issues}")
    print(f"Total option label issues: {option_label_issues}")

if __name__ == '__main__':
    check()
