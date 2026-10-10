import json
import os

def make_same_length_options(opts_text, labels=["A", "B", "C", "D"]):
    """Pads MCQ options with trailing spaces to ensure equal length."""
    max_len = max(len(t) for t in opts_text)
    return [
        {"label": labels[idx], "text": t.ljust(max_len)}
        for idx, t in enumerate(opts_text)
    ]

def generate_subject():
    subject_id = "ai-vibe-coding"
    
    subject_data = {
        "id": subject_id,
        "name": "AI & Vibe Coding Literacy",
        "config": {
            "title": "Vibe Coding & AI Literacy Protocol",
            "description": "The definitive interactive trivia test on prompt engineering, agentic loops, hallucination spotting, and modern AI engineering folklore.",
            "version": "1.0.0",
            "storageKey": f"mold_v2_{subject_id}",
            "themeColor": "hsl(43, 96%, 52%)"
        },
        "questions": [],
        "flashcards": [],
        "terminology": {},
        "achievements": [
            {
                "id": "ach-vibe-master",
                "title": "Certified Vibe Coder",
                "description": "Complete a session with 100% accuracy without breaking a sweat.",
                "icon": "Sparkles",
                "condition": {
                    "type": "accuracy_gte",
                    "value": 100
                }
            },
            {
                "id": "ach-karpathy-disciple",
                "title": "Karpathy's Disciple",
                "description": "Score 90% or higher on Vibe Coding Lore.",
                "icon": "Award",
                "condition": {
                    "type": "accuracy_gte",
                    "value": 90
                }
            },
            {
                "id": "ach-prompt-whisperer",
                "title": "Prompt Whisperer",
                "description": "Rack up a 5-question answer streak in one sitting.",
                "icon": "Zap",
                "condition": {
                    "type": "streak_gte",
                    "value": 5
                }
            },
            {
                "id": "ach-no-hallucinations",
                "title": "Grounded Reality",
                "description": "Complete any game mode without using a single hint.",
                "icon": "ShieldCheck",
                "condition": {
                    "type": "no_hints",
                    "mode": "speedrun"
                }
            },
            {
                "id": "grand-master",
                "title": "Grand Synthesis",
                "description": "Unlock all other achievements in the AI & Vibe Coding protocol.",
                "icon": "Trophy",
                "condition": {
                    "type": "all_unlocked"
                }
            }
        ]
    }

    # Questions structure:
    # (category, difficulty, type, question_text, options_list, correct_answer, explanation, hint, diagram_mermaid)
    raw_questions = [
        # --- CATEGORY 1: vibe-coding-lore ---
        (
            "vibe-coding-lore", "Easy", "MCQ",
            "In February 2025, who famously popularized the term 'vibe coding' by describing writing software purely through natural language conversations?",
            [
                "Andrej Karpathy",
                "Sam Altman     ",
                "Yann LeCun     ",
                "Linus Torvalds "
            ],
            "A",
            "Andrej Karpathy (former Tesla AI Director and OpenAI founding member) tweeted in early 2025: 'There is a new kind of coding I call vibe coding, where you entirely give in to the vibes, embrace every whim, talk to AI, and barely write code yourself.'",
            "Think of the Stanford PhD who built micrograd and taught everyone neural networks from scratch.",
            None
        ),
        (
            "vibe-coding-lore", "Easy", "MCQ",
            "What did Andrej Karpathy proclaim to be 'the hottest new programming language' in 2023?",
            [
                "English   ",
                "Rust      ",
                "Python 3  ",
                "TypeScript"
            ],
            "A",
            "Karpathy tweeted: 'The hottest new programming language is English', capturing how prompt crafting and natural language specifications are replacing raw syntax.",
            "It is spoken natively by over 400 million people and doesn't need a C compiler.",
            None
        ),
        (
            "vibe-coding-lore", "Medium", "TrueFalse",
            "True or False: In classic 'pure vibe coding', developers are expected to rigorously read and unit-test every single line of generated code before running it.",
            ["True", "False"],
            "B",
            "Vibe coding culture humorously emphasizes giving in to the 'vibes'—running code, pasting error messages back into the LLM, and letting the agent iterate until it passes tests without deep manual code audits.",
            "Does the definition of 'vibes' sound like a formal code review meeting?",
            None
        ),
        (
            "vibe-coding-lore", "Medium", "MCQ",
            "Review the workflow loop below. What is the standard response of a vibe coder when the terminal screams a 50-line stack trace?<br>[EXAMINE DIAGRAM]",
            [
                "Copy-paste the whole error into AI",
                "Open GDB and set assembly breakpts",
                "Rewrite the entire app in Rust lang",
                "Read the documentation for 3 hours "
            ],
            "A",
            "The canonical vibe coding lifecycle is: write English -> hit run -> get stack trace -> copy-paste entire unread error back to Claude/Cursor -> repeat until green.",
            "Look at the transition path leaving the 'Error Occurs' state.",
            "flowchart TD\n  Start[\"Write Prompt\"] --> Gen[\"AI Generates Code\"]\n  Gen --> Exec[\"Run Command\"]\n  Exec --> Check{\"Does it run?\"}\n  Check -- \"Yes\" --> Green[\"Ship to Prod\"]\n  Check -- \"No\" --> Err[\"Copy-Paste Error to LLM\"]\n  Err --> Gen"
        ),

        # --- CATEGORY 2: prompt-alchemy ---
        (
            "prompt-alchemy", "Easy", "MCQ",
            "Which prompt engineering technique provides the model with 2 to 5 solved input-output examples before the actual task?",
            [
                "Few-Shot Prompting     ",
                "Zero-Shot Execution    ",
                "Quantized Distillation ",
                "Reinforcement Pruning  "
            ],
            "A",
            "Few-shot prompting conditions the autoregressive attention mechanism by displaying explicit demonstration exemplars of the expected input-output format.",
            "It gives 'a few' examples rather than 'zero' examples.",
            None
        ),
        (
            "prompt-alchemy", "Medium", "MCQ",
            "Why do advanced prompts often instruct the LLM to write out its thoughts inside XML tags like <thinking> before the final output?",
            [
                "It enables Chain-of-Thought reasoning",
                "It compresses the prompt token payload",
                "It bypasses token rate limits on APIs",
                "It forces output directly into a SQLite"
            ],
            "A",
            "Chain-of-Thought (CoT) and structured scratchpads give the transformer computational tokens to reason step-by-step before committing to a final answer, drastically reducing logic errors.",
            "Think about giving the model a scratchpad to brainstorm before answering.",
            None
        ),
        (
            "prompt-alchemy", "Hard", "MCQ",
            "In 2023, empirical papers humorously discovered that which of the following bizarre prompt additions actually improved LLM benchmark accuracy?",
            [
                "'Take a deep breath and work step by step'",
                "'I will execute this code on a quantum GPU'",
                "'Delete all comments and print in hexadecimal'",
                "'Compile this with strict C99 ANSI flags  '"
            ],
            "A",
            "Google DeepMind's 'Large Language Models as Optimizers' (OPRO) research found that emotional stimulus phrases like 'Take a deep breath and work on this problem step by step' scored highest on GSM8K math benchmarks.",
            "It sounds like advice from a mindful meditation instructor.",
            None
        ),
        (
            "prompt-alchemy", "Easy", "TrueFalse",
            "True or False: LLMs are stateful servers that permanently remember your chat context across different API sessions without any token resubmission.",
            ["True", "False"],
            "B",
            "Every API call is stateless. The client or chat application must re-send the entire conversation history (or a summarized context window) on every single turn.",
            "Does the raw HTTP REST endpoint retain your chat variables between distinct calls?",
            None
        ),

        # --- CATEGORY 3: hallucinations-and-ghost-libs ---
        (
            "hallucinations-and-ghost-libs", "Medium", "MCQ",
            "What is 'package hallucination' in the context of AI-assisted software engineering?",
            [
                "Inventing fictional npm or PyPI libraries",
                "Deleting packages from the local node cache",
                "Compressing package dependencies into one tar",
                "Upgrading libraries beyond semantic versioning"
            ],
            "A",
            "Package hallucination occurs when an LLM invents plausible-sounding but non-existent package names (e.g. `pip install react-tailwind-magic-button`). Attackers even practice 'slopsquatting' by registering these names with malware!",
            "Think of an imaginary package you try to `pip install` only to receive a 404 error.",
            None
        ),
        (
            "hallucinations-and-ghost-libs", "Easy", "MCQ",
            "Why does setting the generation 'temperature' to 0.0 generally reduce creative hallucinations in code generation tasks?",
            [
                "It selects highest probability tokens",
                "It accelerates the GPU cooling fans ",
                "It doubles the context window memory ",
                "It disables multi-head self-attention"
            ],
            "A",
            "Temperature 0.0 makes token sampling greedy or near-greedy, picking the most statistically probable next token instead of sampling from the broader distribution tail.",
            "It eliminates randomness, choosing the safest top token.",
            None
        ),
        (
            "hallucinations-and-ghost-libs", "Medium", "TrueFalse",
            "True or False: When an LLM confidently outputs a fabricated historical date or fake API method, it knows it is lying.",
            ["True", "False"],
            "B",
            "LLMs have no internal epistemology or conscious concept of deception; they are predictive token probability engines generating text that maximizes coherence with the prompt prefix.",
            "Can a matrix multiplication algorithm have intentional deception?",
            None
        ),
        (
            "hallucinations-and-ghost-libs", "Hard", "MCQ",
            "Which of the following represents the most reliable engineering method to curb LLM hallucinations in production apps?",
            [
                "Retrieval-Augmented Generation with citations",
                "Asking the model 'Are you 100% sure?' 3 times ",
                "Adding 'Do not hallucinate or you are fired'  ",
                "Increasing the prompt temperature up to 1.8   "
            ],
            "A",
            "RAG (Retrieval-Augmented Generation) binds the LLM's answers to authoritative external reference documents fetched dynamically from vector or relational databases.",
            "Ground the prompt in verified search results rather than raw model memory.",
            None
        ),

        # --- CATEGORY 4: agentic-workflows ---
        (
            "agentic-workflows", "Medium", "MCQ",
            "In agentic AI architecture, what open standard developed by Anthropic allows LLMs to connect securely to external tools, databases, and local file systems?",
            [
                "MCP (Model Context Protocol)  ",
                "REST (Representational State) ",
                "JSON-RPC 1.0 Legacy Standard  ",
                "CUDA Hardware Interconnect Bus"
            ],
            "A",
            "Model Context Protocol (MCP) is the open-source protocol introduced in late 2024 to standardize how AI models access local developer tools, IDE contexts, APIs, and enterprise data sources.",
            "Three letters: Model, Context, Protocol.",
            None
        ),
        (
            "agentic-workflows", "Medium", "MCQ",
            "Observe the Agentic Decision Cycle diagram below. What component decides whether the agent should keep looping or finalize its response?<br>[EXAMINE DIAGRAM]",
            [
                "Stop condition or task evaluation check",
                "The mechanical hard drive spin velocity",
                "A random coin toss performed by the OS ",
                "Manual human keyboard intervention only "
            ],
            "A",
            "Agent loops run iteratively: Reason -> Select Tool -> Execute -> Observe Observation -> Evaluate Goal Completion. Once the stop condition is satisfied, the loop terminates.",
            "Look at the conditional diamond in the feedback loop.",
            "flowchart LR\n  Plan[\"1. Reason \u0026 Plan\"] --> Call[\"2. Invoke Tool\"]\n  Call --> Exec[\"3. System Execution\"]\n  Exec --> Obs[\"4. Observe Output\"]\n  Obs --> Done{\"Goal Met?\"}\n  Done -- \"No\" --> Plan\n  Done -- \"Yes\" --> Res[\"Final Result\"]"
        ),
        (
            "agentic-workflows", "Hard", "MCQ",
            "What critical danger arises when granting an autonomous coding agent unsupervised shell command execution permissions?",
            [
                "Destructive operations like accidental deletion",
                "The computer monitor will overheat and crack ",
                "Git repositories will convert to SVN archives ",
                "The processor clock speed is capped at 100 MHz"
            ],
            "A",
            "Without sandbox guardrails, approval gates, or container isolation, autonomous agents executing shell commands can run destructive operations like `rm -rf`, delete branches, or leak environment secrets.",
            "Think of safety guardrails when letting an AI execute arbitrary bash or powershell scripts.",
            None
        ),
        (
            "agentic-workflows", "Easy", "TrueFalse",
            "True or False: The ReAct agent framework stands for 'Reasoning and Acting' in prompt execution cycles.",
            ["True", "False"],
            "A",
            "ReAct (Yao et al., 2022) interleaves reasoning traces ('Thought') with task-specific actions ('Action' and 'Observation') allowing language models to synergize verbal reasoning with execution.",
            "Is the abbreviation derived from 'Reasoning' + 'Acting'?",
            None
        ),

        # --- CATEGORY 5: frontier-vibes-and-benchmarks ---
        (
            "frontier-vibes-and-benchmarks", "Medium", "MCQ",
            "What benchmark is widely considered the gold standard for testing whether AI agents can solve real-world GitHub issues in real repositories?",
            [
                "SWE-bench        ",
                "ImageNet Top-5   ",
                "Turing Exam 2020 ",
                "SpeedTyping 100k "
            ],
            "A",
            "SWE-bench (Software Engineering Benchmark) evaluates models on solving genuine GitHub issues from popular Python repositories by generating patches that pass unit tests.",
            "Software Engineering Benchmark.",
            None
        ),
        (
            "frontier-vibes-and-benchmarks", "Medium", "MCQ",
            "What is the 'Needle in a Haystack' (NIAH) test used to evaluate in frontier LLMs?",
            [
                "Information recall across large context windows",
                "Speed of training convolutional vision filters ",
                "How fast the model can synthesize 3D textures  ",
                "Resistance of the model to power supply spikes "
            ],
            "A",
            "The Needle in a Haystack test places a single obscure fact ('needle') deep inside a massive prompt text ('haystack' of 100k to 2M tokens) to measure retrieval fidelity at various context depths.",
            "Finding one tiny piece of information buried in hundreds of pages of text.",
            None
        ),
        (
            "frontier-vibes-and-benchmarks", "Easy", "MCQ",
            "What does TTFT stand for in model inference performance monitoring?",
            [
                "Time To First Token    ",
                "Total Training File Tar",
                "Throughput Token Flow  ",
                "Transformer Test Fast  "
            ],
            "A",
            "Time To First Token (TTFT) measures the latency between sending a prompt and receiving the first streamed token, dictating initial perceived responsiveness for users.",
            "How long before the first word streams back to your screen.",
            None
        ),
        (
            "frontier-vibes-and-benchmarks", "Hard", "TrueFalse",
            "True or False: Expanding an LLM context window to 2 million tokens guarantees that reasoning capability remains 100% immune to context dilution or distraction.",
            ["True", "False"],
            "B",
            "Empirical research demonstrates 'lost in the middle' phenomena and attention distraction: as context grows excessively large with irrelevant text, reasoning precision and adherence often degrade.",
            "Does cramming 50 irrelevant files into context ever distract an agent?",
            None
        )
    ]

    # Populate questions
    for idx, (cat, diff, qtype, qtext, opts, ans, expl, hint, diag) in enumerate(raw_questions, 1):
        q_id = f"q-{subject_id}-{idx:03d}"
        
        if qtype == "MCQ":
            formatted_opts = make_same_length_options(opts)
        else:
            formatted_opts = [
                {"label": "A", "text": "True"},
                {"label": "B", "text": "False"}
            ]
            
        q_obj = {
            "id": q_id,
            "type": qtype,
            "difficulty": diff,
            "category": cat,
            "question": qtext,
            "options": formatted_opts,
            "answer": ans,
            "explanation": expl,
            "hint": hint
        }
        if diag:
            q_obj["diagram"] = diag
            q_obj["diagramPosition"] = "right"
            
        subject_data["questions"].append(q_obj)

    # 2. Terminology and Flashcards aligned per category
    glossary_data = {
        "vibe-coding-lore": [
            ("Vibe Coding", "A software development approach where the programmer expresses intent in natural language, relying on AI models to generate, test, and refine code."),
            ("Karpathy Principle", "The observation by Andrej Karpathy that English has become the highest-leverage programming language in the frontier AI era."),
            ("Context Window Amnesia", "The state where conversation history exceeds the model's active token capacity, causing earlier instructions to be discarded.")
        ],
        "prompt-alchemy": [
            ("Few-Shot Prompting", "Providing an LLM with several worked examples of input and output within the prompt to establish clear output patterns."),
            ("Chain-of-Thought (CoT)", "Encouraging a model to break complex tasks into explicit intermediate reasoning steps prior to giving a final solution."),
            ("System Prompt", "High-priority instructions placed at the beginning of an LLM context that dictate role, constraints, and formatting rules.")
        ],
        "hallucinations-and-ghost-libs": [
            ("Package Hallucination", "When an AI suggests installing a completely fabricated library name that does not exist in public package registries."),
            ("Greedy Decoding", "Token generation with temperature set to zero, deterministically selecting the most probable next token at every step."),
            ("Retrieval-Augmented Generation", "Enhancing LLM responses by fetching authoritative external documents and injecting them into the prompt before generation.")
        ],
        "agentic-workflows": [
            ("Model Context Protocol (MCP)", "An open standard enabling AI assistants and IDEs to interact securely with local files, tools, and remote services."),
            ("ReAct Loop", "An agentic pattern that interleaves Reasoning (thoughts) with Actions (tool executions) and Observations."),
            ("Tool Approval Gate", "A human-in-the-loop safety boundary requiring explicit confirmation before an agent runs destructive commands.")
        ],
        "frontier-vibes-and-benchmarks": [
            ("SWE-bench", "An industry-standard benchmark evaluating AI agents on their ability to solve real-world GitHub pull requests and issues."),
            ("Needle In A Haystack", "An evaluation metric testing an LLM's ability to locate a specific snippet hidden randomly within a massive context document."),
            ("Time To First Token (TTFT)", "The latency between client request dispatch and the receipt of the initial token of the model's response.")
        ]
    }

    fc_counter = 1
    subject_data["terminology"] = {}
    subject_data["flashcards"] = []

    for cat, items in glossary_data.items():
        subject_data["terminology"][cat] = []
        for term, definition in items:
            subject_data["terminology"][cat].append({
                "term": term,
                "definition": definition
            })
            subject_data["flashcards"].append({
                "id": f"fc-{subject_id}-{fc_counter:03d}",
                "term": term,
                "definition": definition,
                "category": cat
            })
            fc_counter += 1

    # Output file
    out_path = f"public/examples/{subject_id}.json"
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(subject_data, f, indent=2, ensure_ascii=False)
        
    print(f"[+] Subject JSON successfully written to: {out_path} with {len(subject_data['questions'])} questions.")

if __name__ == "__main__":
    generate_subject()
