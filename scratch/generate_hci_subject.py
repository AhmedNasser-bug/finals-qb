import json
import os
import re

def make_same_length_options(opts_text, labels=["A", "B", "C", "D"]):
    """Pads MCQ options with trailing spaces to ensure strictly equal character length."""
    max_len = max(len(t) for t in opts_text)
    return [
        {"label": labels[idx], "text": t.ljust(max_len)}
        for idx, t in enumerate(opts_text)
    ]

def build_hci_subject():
    subject_id = "human-computer-interaction"

    subject_data = {
        "id": subject_id,
        "name": "Human-Computer Interaction",
        "config": {
            "title": "Human-Computer Interaction Mastery",
            "description": "Comprehensive Socratic mastery of usability engineering, display design principles, perceptual ergonomics, and cognitive mental models.",
            "version": "1.0",
            "storageKey": f"mold_v2_{subject_id.replace('-', '_')}"
        },
        "questions": [],
        "flashcards": [],
        "terminology": {},
        "achievements": []
    }

    # 40 Questions: 8 questions across 5 categories
    # Structure: (category, difficulty, type, question_text, options_list, correct_answer, explanation, hint, diagram_mermaid)
    raw_questions = [
        # ── CATEGORY 1: foundations-and-usability (Questions 1-8) ───────────────
        (
            "foundations-and-usability", "Easy", "MCQ",
            "What is the primary overarching goal of Human-Computer Interaction (HCI)?",
            [
                "Make systems usable, efficient, and user-friendly",
                "Maximize raw CPU throughput and transistor speed",
                "Increase display screen resolution to 4K and 8K",
                "Minimize software production costs and licensing"
            ],
            "A",
            "HCI focuses fundamentally on human cognitive and physical workflows, striving to make systems usable, effective, and user-friendly rather than optimizing low-level hardware speed.",
            "Does HCI prioritize the internal silicon mechanics of the CPU or how effectively humans achieve their task goals?",
            None
        ),
        (
            "foundations-and-usability", "Easy", "MCQ",
            "Which component represents the physical or digital boundary where communication between a user and a computer system takes place?",
            [
                "User Interface (UI)",
                "Central Processing Unit",
                "Relational Database Core",
                "Operating System Kernel"
            ],
            "A",
            "The User Interface (UI) is the interactive contact point and communication bridge through which humans express intent and receive system state feedback.",
            "What layer directly translates human physical actions (clicks, taps, typing) into system commands and presents the visual results?",
            None
        ),
        (
            "foundations-and-usability", "Medium", "MCQ",
            "Which foundational design principle requires testing prototypes with real human users and recording quantitative task performance?",
            [
                "Empirical measurement",
                "Subjective introspection",
                "Aesthetic rationalization",
                "Algorithmic minimization"
            ],
            "A",
            "Empirical measurement mandates observing representative users performing realistic tasks while recording objective benchmarks like completion times and error rates.",
            "Which scientific approach relies on observable data gathered from actual operators rather than designers guessing how users behave?",
            None
        ),
        (
            "foundations-and-usability", "Easy", "TrueFalse",
            "True or False: User Interface (UI) refers to how usable and satisfying a product is to use, while User Experience (UX) is strictly limited to visual colors and styling.",
            [
                "True",
                "False"
            ],
            "B",
            "False. UI represents the graphical layout, visual controls, and interactive elements, whereas UX encompasses the holistic usability, emotional satisfaction, and overall workflow ease.",
            "Which term encompasses the user's broader journey and emotional satisfaction versus the graphical skin of the controls?",
            None
        ),
        (
            "foundations-and-usability", "Hard", "MCQ",
            "An enterprise monitoring portal presents 45 competing data streams without structure or visual hierarchy. What primary cognitive failure occurs?",
            [
                "Cognitive load saturation from competing visual stimuli",
                "Hardware frame dropping caused by low monitor refresh",
                "Operating system thread thrashing during sensor poll",
                "Relational database query lockouts in backend caches"
            ],
            "A",
            "A cluttered UI overwhelms finite human working memory, causing severe cognitive load saturation where operators struggle to filter noise and locate critical cues.",
            "How does human working memory respond when forced to parse dozens of unprioritized visual stimuli simultaneously?",
            None
        ),
        (
            "foundations-and-usability", "Medium", "MCQ",
            "According to Dix et al. and ISO usability models, which of the following is NOT one of the recognized primary dimensions of usability?",
            [
                "Cryptographic complexity of underlying cipher suites",
                "Learnability for novice users encountering the system",
                "Efficiency of task completion for experienced users",
                "Error recovery and prevention during critical operations"
            ],
            "A",
            "Usability measures human efficacy—specifically learnability, efficiency, memorability, error tolerance, and satisfaction. Cryptographic complexity is an internal security attribute.",
            "Does usability evaluate how easily humans interact with a system, or does it measure the mathematical difficulty of its encryption algorithms?",
            None
        ),
        (
            "foundations-and-usability", "Medium", "TrueFalse",
            "True or False: In iterative design, usability testing is conducted repeatedly across successive prototype cycles rather than as a single post-deployment evaluation.",
            [
                "True",
                "False"
            ],
            "A",
            "True. Iterative design is inherently cyclical—analyzing, designing, prototyping, and testing through repeated loops to identify and resolve defects early.",
            "Does the concept of 'iteration' suggest a single final test or a continuous cycle of prototyping, evaluation, and refinement?",
            None
        ),
        (
            "foundations-and-usability", "Hard", "MCQ",
            "In the interactive system cycle shown in the diagram, how do User Interface (UI) and User Experience (UX) functionally relate?",
            [
                "UI provides the interactive medium, while UX represents cumulative cognitive satisfaction",
                "UI is the backend database layer, while UX is the frontend presentation stylesheet code   ",
                "UI completely replaces UX once the application visual design reaches aesthetic maturity    ",
                "UI and UX are synonymous terms describing the same graphical widget rendering library      "
            ],
            "A",
            "UI is the visible, tangible surface through which users act and observe, whereas UX is the overarching cognitive and emotional outcome formed by the entire interactive cycle.",
            "Look at the directional flow: what serves as the physical interaction surface versus the internal cognitive and emotional evaluation?",
            "flowchart TD\n  User[\"User Intent\"] --> UI[\"User Interface (Visual Form & Controls)\"]\n  UI --> System[\"System Execution\"]\n  System --> Feedback[\"Feedback & Results\"]\n  Feedback --> UX[\"User Experience (Satisfaction & Mental Model)\"]\n  UX -.-> User"
        ),

        # ── CATEGORY 2: core-design-principles (Questions 9-16) ──────────────────
        (
            "core-design-principles", "Easy", "MCQ",
            "A prominent screen button features beveled borders and subtle shadows that instinctively communicate it can be pressed. Which design principle is this?",
            [
                "Affordance (making usage obvious)",
                "Information access cost reduction",
                "Principle of multiple resources  ",
                "Absolute judgment sensory limits "
            ],
            "A",
            "Affordance refers to perceived and actual physical or visual properties of an element that intuitively suggest how it can be operated.",
            "What term describes visual cues that reveal the mechanical function of an object directly through its shape and styling?",
            None
        ),
        (
            "core-design-principles", "Medium", "MCQ",
            "When an operator triggers a dataset export, the interface renders a progress bar displaying exact completion percentage and transfer speed. Which principle is applied?",
            [
                "Feedback (showing results of action)",
                "Absolute judgment sensory limits    ",
                "Skeuomorphic visual ornamentation    ",
                "Selective attentional isolation      "
            ],
            "A",
            "Feedback provides immediate, clear operational confirmation regarding current system state changes resulting from user actions.",
            "How does a system reassure an operator that their command was received and is currently being executed?",
            None
        ),
        (
            "core-design-principles", "Medium", "MCQ",
            "An application standardizes Ctrl+S for saving, uses identical dialog layouts, and applies consistent iconography across all modules. Which principle is exemplified?",
            [
                "Consistency (same pattern everywhere)",
                "Cross-modal sensory interference     ",
                "Visual angle angular magnification   ",
                "Principle of sensory habituation     "
            ],
            "A",
            "Consistency ensures that identical actions, visual cues, and terminologies behave uniformly across the entire system, minimizing the learning curve.",
            "What principle guarantees that familiar shortcuts and visual symbols mean the exact same thing throughout every screen of an app?",
            None
        ),
        (
            "core-design-principles", "Easy", "TrueFalse",
            "True or False: The principle of Tolerance requires systems to prevent user slips where possible and offer simple, non-destructive recovery actions like Undo.",
            [
                "True",
                "False"
            ],
            "A",
            "True. Tolerance means designing forgiving interfaces that prevent errors (e.g., confirmations, input constraints) and provide clear recovery paths (like Undo or Trash retention).",
            "Does a tolerant system punish user mistakes or provide safety nets to absorb slips gracefully?",
            None
        ),
        (
            "core-design-principles", "Hard", "MCQ",
            "A designer reorganizes 70 chaotic configuration switches into a structured 3-stage wizard with clear categorization. Which two core principles are directly strengthened?",
            [
                "Structure and Simplicity         ",
                "Redundancy and Skeuomorphism     ",
                "Sensory adaptation and Latency   ",
                "Absolute judgment and Encryption "
            ],
            "A",
            "Progressive disclosure organizes complex parameters into a logical architecture (Structure) while hiding non-immediate items to reduce cognitive clutter (Simplicity).",
            "Which principles dictate grouping related elements logically while stripping away superfluous visual noise?",
            None
        ),
        (
            "core-design-principles", "Medium", "TrueFalse",
            "True or False: The principle of Visibility mandates that every conceivable advanced command and diagnostic log must be permanently displayed on the home screen.",
            [
                "True",
                "False"
            ],
            "B",
            "False. Visibility requires that current system state and contextually relevant actions are readily discoverable, not that all possible features clutter the screen at once.",
            "Does visibility mean making relevant states and actions discoverable, or does it mean overwhelming the viewport with every obscure setting?",
            None
        ),
        (
            "core-design-principles", "Hard", "MCQ",
            "In the form layout shown in the diagram, organizing inputs into distinct bordered cards with clear margins relies primarily on which psychological law?",
            [
                "Gestalt Principle of Proximity and Common Region",
                "Visual Angle Trigonometric Retinal Resolution   ",
                "Fitts Law Target Movement Index of Difficulty   ",
                "Hick-Hyman Logarithmic Decision Reaction Time   "
            ],
            "A",
            "The Gestalt principles of Proximity and Common Region explain that items located close together and bound inside a shared contour or border are naturally perceived as a functional unit.",
            "How does human visual perception instinctively organize items enclosed inside distinct geometric boundaries?",
            "graph LR\n  subgraph GroupA[\"Group A: Shipping Address\"]\n    f1[\"Street Input\"]\n    f2[\"Postal Code\"]\n  end\n  subgraph GroupB[\"Group B: Payment Details\"]\n    f3[\"Card Number\"]\n    f4[\"Expiry Date\"]\n  end"
        ),
        (
            "core-design-principles", "Medium", "MCQ",
            "When an operator selects 'Delete Repository', the system requests typed confirmation and holds the files in a 30-day soft-delete bin. Which principle is demonstrated?",
            [
                "Tolerance (Error prevention and recovery)",
                "Absolute judgment limit sensory overload ",
                "Top-down predictive automation bias      ",
                "Minimizing information access cost       "
            ],
            "A",
            "Tolerance safeguards against irreversible catastrophic actions by introducing deliberate confirmation hurdles and providing non-destructive recovery windows.",
            "Does this mechanism eliminate destructive mistakes through forgiving error-interception protocols?",
            None
        ),

        # ── CATEGORY 3: perceptual-principles (Questions 17-24) ─────────────────
        (
            "perceptual-principles", "Easy", "MCQ",
            "A traffic light communicates stop and go using both distinctive spatial positions (top, middle, bottom) and distinctive colors. Which perceptual principle does this embody?",
            [
                "Redundancy gain                   ",
                "Avoid absolute judgment limits    ",
                "Similarity causes confusion       ",
                "Minimizing information access cost"
            ],
            "A",
            "Redundancy gain occurs when the same message is presented across multiple physical dimensions (position + color), speeding up recognition and assisting color-blind drivers.",
            "What principle explains why providing more than one sensory cue for the same piece of information improves recognition speed and accuracy?",
            None
        ),
        (
            "perceptual-principles", "Medium", "MCQ",
            "An avionics engineer sizes cockpit character height $$H$$ based on viewing distance $$D$$ using the visual angle formula. Which perceptual principle is being satisfied?",
            [
                "Make displays legible (Visual Angle) ",
                "Principle of the moving part         ",
                "Proximity compatibility principle    ",
                "Principle of predictive aiding       "
            ],
            "A",
            "Legibility mandates that displayed symbols must subtend a sufficient visual angle at the user's viewing distance so the human retina can physically resolve the characters.",
            "What fundamental perceptual rule ensures that text and symbols physically project an image large enough on the eye to be deciphered?",
            None
        ),
        (
            "perceptual-principles", "Hard", "MCQ",
            "A pressure monitor asks an operator to identify 12 subtle shades of yellow to determine safety thresholds without numerical readouts. Why is this flawed?",
            [
                "It violates the limit on absolute judgments for a single sensory variable",
                "It contradicts the principle of the moving part during dynamic operations",
                "It introduces excessive mechanical latency in analog hardware sensors    ",
                "It violates Gestalt symmetry closure during high-stress alert monitoring  "
            ],
            "A",
            "The 'Avoid absolute judgment limits' principle states that humans cannot reliably identify more than 5 to 7 discrete levels along a single sensory dimension (such as hue or loudness).",
            "Can human working perception accurately distinguish more than 5 to 7 discrete levels of a single sensory variable without an adjacent reference scale?",
            None
        ),
        (
            "perceptual-principles", "Medium", "MCQ",
            "Users recognize a magnifying glass as 'search' and a shopping cart as 'checkout' without instructions. Which perceptual mechanism enables this?",
            [
                "Top-down processing based on prior knowledge and context",
                "Bottom-up sensory stimulus threshold integration        ",
                "Rapid sensory habituation in high-contrast displays     ",
                "Absolute perceptual acuity in peripheral vision         "
            ],
            "A",
            "Top-down processing allows users to interpret visual stimuli quickly by matching incoming shapes to prior experiences, real-world mental models, and contextual expectations.",
            "Do users decode icons by analyzing raw pixels from scratch, or does their memory immediately match symbols to real-world objects?",
            None
        ),
        (
            "perceptual-principles", "Hard", "MCQ",
            "Two adjacent buttons labeled 'Purge Data' and 'Print Report' share identical grey rectangular boxes, identical fonts, and identical sizes. What flaw exists?",
            [
                "Similarity causes confusion        ",
                "Predictive aiding over-reliance    ",
                "Sensory habituation degradation    ",
                "Redundancy gain cross-contamination"
            ],
            "A",
            "When controls with drastically different consequences share identical visual attributes (color, shape, size), visual discriminability drops and similarity causes confusion.",
            "What happens to operator error rates when a dangerous action and a benign action look visually indistinguishable?",
            None
        ),
        (
            "perceptual-principles", "Easy", "TrueFalse",
            "True or False: If characters on an emergency display are too small to satisfy visual angle thresholds, operators can compensate completely through intense mental concentration.",
            [
                "True",
                "False"
            ],
            "B",
            "False. If visual angle is below the optical resolution threshold, the human retina cannot physically distinguish the character shapes regardless of cognitive effort.",
            "Can mental willpower overcome physical optical limits when character size is smaller than retinal resolution thresholds?",
            None
        ),
        (
            "perceptual-principles", "Medium", "TrueFalse",
            "True or False: Displaying an urgent critical alert using only red text without an accompanying hazard icon, bold font, or audible chime represents optimal Redundancy Gain.",
            [
                "True",
                "False"
            ],
            "B",
            "False. Redundancy gain explicitly requires expressing the same message across multiple visual or sensory cues (e.g., color + shape + text + audio). Single-cue encoding is not redundant.",
            "Does relying on a single visual attribute (color alone) fulfill the definition of redundancy gain?",
            None
        ),
        (
            "perceptual-principles", "Hard", "MCQ",
            "According to the visual angle principle shown in the schematic, if viewing distance $$D$$ between operator and screen doubles, what must happen to character height $$H$$ to maintain legibility?",
            [
                "Character height $$H$$ must double to maintain a constant visual angle  ",
                "Character height $$H$$ can remain unchanged because visual acuity is fixed",
                "Character height $$H$$ must be halved to avoid optical retinal saturation",
                "Character height $$H$$ must quadruple according to the inverse square law "
            ],
            "A",
            "Visual angle is proportional to $$H / D$$. If distance $$D$$ doubles, character height $$H$$ must also double to project the identical subtended angular arc onto the retina.",
            "To keep the subtended retinal arc $$H/D$$ constant when distance $$D$$ is multiplied by 2, what mathematical adjustment is required for height $$H$$?",
            "flowchart LR\n  Eye[\"Observer Eye\"] ---|\"Distance (D)\"| Display[\"Display Screen\"]\n  Display ---|\"Height (H)\"| Top[\"Character Top\"]\n  Display ---|\"Height (H)\"| Bottom[\"Character Bottom\"]"
        ),

        # ── CATEGORY 4: mental-models-and-attention (Questions 25-32) ───────────
        (
            "mental-models-and-attention", "Easy", "MCQ",
            "An operating system represents file deletion with an icon of a physical trash can that appears full when files are deleted. Which mental model principle is this?",
            [
                "Principle of pictorial realism   ",
                "Principle of the moving part     ",
                "Principle of multiple resources  ",
                "Avoid absolute judgment limits   "
            ],
            "A",
            "The Principle of Pictorial Realism asserts that displays and icons should visually resemble the real-world physical objects or conceptual relationships they represent.",
            "Which principle dictates that a display or icon should look like the physical real-world object it represents?",
            None
        ),
        (
            "mental-models-and-attention", "Medium", "MCQ",
            "A file download dialog features a progress bar that smoothly extends from left to right as bytes transfer. Why does this dynamic motion aid user comprehension?",
            [
                "Principle of the moving part (motion sensitivity)",
                "Avoid absolute judgment limits                  ",
                "Minimizing information access cost               ",
                "Sensory cross-modal habituation                  "
            ],
            "A",
            "The Principle of the Moving Part states that moving elements should match the user's mental model of motion; humans are biologically sensitive to movement, detecting progress effortlessly.",
            "Human visual perception is uniquely sensitive to movement; which principle states that moving parts should match internal models of system change?",
            None
        ),
        (
            "mental-models-and-attention", "Medium", "MCQ",
            "Placing frequently used tools (Save, Undo, Search) directly on a top toolbar rather than buried within nested submenus directly satisfies which principle?",
            [
                "Minimizing information access cost",
                "Principle of pictorial realism    ",
                "Sensory adaptation threshold      ",
                "Principle of multiple resources   "
            ],
            "A",
            "Minimizing Information Access Cost states that critical and frequent data or controls should require minimal time, navigation steps, and physical effort to access.",
            "What principle aims to reduce the physical clicks, keystrokes, and mental search time required to access critical tools?",
            None
        ),
        (
            "mental-models-and-attention", "Hard", "MCQ",
            "On an aircraft primary flight display, airspeed, attitude, and altitude indicators are grouped into an integrated central HUD cluster. Which principle dictates this?",
            [
                "Proximity compatibility principle ",
                "Top-down semantic interference    ",
                "Principle of sensory habituation  ",
                "Avoid absolute judgment limits    "
            ],
            "A",
            "The Proximity Compatibility Principle requires that display elements that must be mentally integrated to complete a single task (flying an aircraft) should be placed in close spatial proximity.",
            "When multiple flight parameters must be cognitively integrated to maintain flight attitude, should they be grouped closely or scattered across the cabin?",
            None
        ),
        (
            "mental-models-and-attention", "Hard", "MCQ",
            "An automobile safety system alerts a driver to an impending collision using both a loud audible chime and a vibrating steering wheel. Which principle is being applied?",
            [
                "Principle of multiple resources ",
                "Principle of pictorial realism  ",
                "Replace memory with visual info ",
                "Principle of predictive aiding  "
            ],
            "A",
            "The Principle of Multiple Resources acknowledges that human attentional capacity is split across separate sensory channels (visual, auditory, tactile); distributing cues prevents channel saturation.",
            "By alerting the driver through hearing and touch rather than overloading the visual windshield, what cognitive resource division is being leveraged?",
            None
        ),
        (
            "mental-models-and-attention", "Easy", "TrueFalse",
            "True or False: Visual motion and flashing animations should be added to every widget on a screen because movement always improves user satisfaction.",
            [
                "True",
                "False"
            ],
            "B",
            "False. Visual movement demands involuntary selective attention. Overusing animation creates chaotic visual distraction, causes fatigue, and destroys the operator's ability to spot critical alerts.",
            "What happens to human selective attention when dozens of moving elements compete for visual focus simultaneously?",
            None
        ),
        (
            "mental-models-and-attention", "Medium", "TrueFalse",
            "True or False: According to the Proximity Compatibility Principle, unrelated actions with catastrophic consequences (like 'Format Hard Drive') should be placed right next to 'Save File'.",
            [
                "True",
                "False"
            ],
            "B",
            "False. Proximity compatibility dictates that related items belong close together, while unrelated items or conflicting actions must be kept perceptually and spatially separated.",
            "Should unrelated actions with high potential for destructive error be placed right next to routine buttons?",
            None
        ),
        (
            "mental-models-and-attention", "Hard", "MCQ",
            "Based on the cockpit architectural diagram shown, why are Flight Control instruments grouped into a unified cluster while Cabin Amenities are isolated?",
            [
                "High mental task correlation demands close spatial display proximity ",
                "Aviation electrical wiring prevents flight dials from being separated  ",
                "Cabin amenities require higher visual refresh rates than flight dials ",
                "Absolute judgment restrictions cap cockpits at five total gauges total"
            ],
            "A",
            "Because flight control requires pilots to cognitively integrate airspeed, attitude, and altitude simultaneously, high mental task proximity requires close spatial proximity (Proximity Compatibility).",
            "Does task integration demand perceptual closeness between flight parameters, or should they be scattered near lighting switches?",
            "flowchart TD\n  subgraph FlightDynamics[\"High Task Proximity: Flight Control\"]\n    Airspeed[\"Airspeed Gauge\"]\n    Attitude[\"Attitude Horizon\"]\n    Altitude[\"Altimeter Tape\"]\n  end\n  subgraph CabinAux[\"Low Task Proximity: Cabin Amenities\"]\n    Temp[\"Cabin Temp Control\"]\n    Lighting[\"Overhead Reading Light\"]\n  end"
        ),

        # ── CATEGORY 5: memory-and-evaluation (Questions 33-40) ──────────────────
        (
            "memory-and-evaluation", "Easy", "MCQ",
            "A web checkout form suggests previously saved shipping addresses and automatically fills city and state upon entering a postal code. Which memory principle is applied?",
            [
                "Replace memory with visual information",
                "Principle of the moving part          ",
                "Avoid absolute judgment limits        ",
                "Visual angle angular magnification    "
            ],
            "A",
            "Replacing memory with visual information relieves limited working memory by providing on-screen cues, past entries, and visible options rather than forcing users to recall details.",
            "Does auto-fill force the human to retrieve postal codes from memory, or does it visually present the data directly on screen?",
            None
        ),
        (
            "memory-and-evaluation", "Medium", "MCQ",
            "A GPS navigation app displays the driver's current position alongside a projected traffic slowdown 2 miles ahead with expected delay and a suggested detour. Which principle is applied?",
            [
                "Principle of predictive aiding   ",
                "Principle of pictorial realism   ",
                "Proximity compatibility principle",
                "Avoid absolute judgment limits   "
            ],
            "A",
            "Predictive aiding presents upcoming future states and projected obstacles, enabling operators to plan proactive responses and make informed decisions before bottlenecks occur.",
            "How does showing projected future conditions and estimated arrival delays help the driver make decisions before hitting the traffic jam?",
            None
        ),
        (
            "memory-and-evaluation", "Medium", "MCQ",
            "An autopilot system displays a predictive trajectory vector showing the aircraft position in 30 seconds given current control inputs. How does this enhance safety?",
            [
                "It transforms reactive emergency correction into proactive planned navigation",
                "It forces the pilot to compute differential flight trajectory equations      ",
                "It eliminates the need for the pilot to monitor primary flight instruments    ",
                "It replaces visual display legibility with acoustic alert announcements       "
            ],
            "A",
            "Predictive aiding replaces reactive panic correction with proactive planning, allowing pilots to anticipate trajectory drift and stabilize flight paths before deviations happen.",
            "Does seeing a forecasted future trajectory allow pilots to prevent deviations before they actually happen?",
            None
        ),
        (
            "memory-and-evaluation", "Easy", "TrueFalse",
            "True or False: Human short-term working memory capacity is virtually limitless, so asking users to remember complex alphanumeric keys across multi-step wizards is good design.",
            [
                "True",
                "False"
            ],
            "B",
            "False. Human short-term working memory is strictly limited (typically 4 to 7 discrete chunks). Forcing users to memorize and recall complex strings across screens induces errors.",
            "Can human working memory reliably store dozens of arbitrary characters across multiple screens without degradation?",
            None
        ),
        (
            "memory-and-evaluation", "Hard", "MCQ",
            "A cloud platform consistently uses red exclusively for severe errors, yellow for warnings, and green for completed jobs across 50 independent dashboard pages. Which principle is this?",
            [
                "Principle of consistency (memory schema reinforcement)",
                "Principle of the moving part                          ",
                "Sensory channel absolute judgment saturation          ",
                "Proximity compatibility violation                     "
            ],
            "A",
            "The Principle of Consistency ensures that visual vocabularies and color meanings remain invariant across all contexts, reinforcing long-term memory schemas and eliminating relearning.",
            "How does maintaining identical color meanings across all modules help users leverage long-term memory schemas?",
            None
        ),
        (
            "memory-and-evaluation", "Medium", "TrueFalse",
            "True or False: Rendering a dropdown list of recent search queries when a user clicks into a search bar embodies the cognitive ergonomic principle of 'Recognition over Recall'.",
            [
                "True",
                "False"
            ],
            "A",
            "True. Displaying past search terms allows users to recognize what they need from visual cues rather than exerting mental effort to recall exact keywords from memory.",
            "Is recognizing a desired item from a visible list easier for human memory than retrieving the exact term from scratch?",
            None
        ),
        (
            "memory-and-evaluation", "Hard", "MCQ",
            "During an industrial audit, operators missed tank overflow alerts because the warning was a tiny static label in a table. Which combination of principles best solves this?",
            [
                "Redundancy gain (color + icon + chime) and Principle of the moving part (motion/flash)",
                "Minimizing information access cost and Absolute judgment sensory saturation          ",
                "Strict monochrome legibility formatting and Task elimination protocols               ",
                "Top-down assumption reliance and Silent background audit logging                      "
            ],
            "A",
            "Combining Redundancy Gain (color + visual symbol + audio chime) with the Principle of the Moving Part (flashing/animated indicator) triggers motion and multi-modal sensory channels, making alerts unmissable.",
            "What combination of multi-sensory encoding and dynamic motion ensures critical status changes are immediately noticed?",
            None
        ),
        (
            "memory-and-evaluation", "Hard", "MCQ",
            "According to the cognitive decision model shown in the flowchart, how does Predictive Aiding alter operator workflow?",
            [
                "It shifts operator behavior from reactive panic correction to proactive planned intervention",
                "It forces the operator to manually compute differential equations under high stress        ",
                "It introduces sensory confusion by displaying conflicting telemetry records                 ",
                "It replaces visual legibility with unsupervised artificial intelligence automation          "
            ],
            "A",
            "Predictive aiding projects future system states based on current trajectories, transforming operators from reactive emergency responders into proactive, calm planners.",
            "Look at the final node in the flowchart: does the operator react after a failure or proactively intervene based on a forecasted future state?",
            "flowchart LR\n  Current[\"Current State (T=0)\"] --> Trend[\"Trend Analysis (Slope dX/dt)\"]\n  Trend --> Projected[\"Predictive Aiding: Projected State (T+30s)\"]\n  Projected --> Action[\"Proactive Operator Intervention\"]"
        ),
    ]

    # Populate questions
    for idx, (cat, diff, qtype, qtext, opts, ans, expl, hint, diag) in enumerate(raw_questions, 1):
        q_id = f"q-hci-{idx:03d}"
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

    # Terminology dictionary (5 categories)
    subject_data["terminology"] = {
        "foundations-and-usability": [
            {"term": "Human-Computer Interaction (HCI)", "definition": "A multidisciplinary discipline focused on designing, evaluating, and implementing interactive computing systems for human use that are usable, efficient, and satisfying."},
            {"term": "User Interface (UI)", "definition": "The visual look, feel, and interactive point of contact where communication between the user and the computer system occurs."},
            {"term": "User Experience (UX)", "definition": "The holistic emotional, cognitive, and practical satisfaction an individual experiences when interacting with a digital product or service."},
            {"term": "Cognitive Load", "definition": "The total volume of mental effort and working memory resources required to process information and complete a task within an interface."},
            {"term": "Cluttered UI", "definition": "An interface featuring excessive competing visual elements, unclear structural hierarchy, or unnecessary styling that overwhelms working memory."},
            {"term": "Empirical Measurement", "definition": "The usability principle requiring early and continuous testing of system prototypes with real users to measure concrete task performance benchmarks."},
            {"term": "Iterative Design", "definition": "A cyclical design methodology involving prototyping, testing, analyzing, and refining an interface through multiple successive cycles."},
            {"term": "Usability Dimensions", "definition": "The core qualitative and quantitative metrics of system efficacy: learnability, efficiency, memorability, error tolerance, and user satisfaction."}
        ],
        "core-design-principles": [
            {"term": "Affordance", "definition": "The perceived and actual physical properties of an object that intuitively indicate how it can be used or manipulated."},
            {"term": "Visibility", "definition": "The degree to which the system state and available context-dependent actions are easily observable and discoverable by the user."},
            {"term": "Consistency", "definition": "The principle that identical actions, visual styles, and conceptual patterns should behave identically across all contexts."},
            {"term": "Tolerance", "definition": "Designing systems that prevent errors before they occur and provide clear, forgiving recovery paths when mistakes happen."},
            {"term": "Simplicity", "definition": "Stripping away non-essential visual and cognitive clutter to focus user attention strictly on primary task goals."},
            {"term": "Feedback", "definition": "Sending immediate, understandable confirmation back to the user regarding the outcome and processing state of an action."},
            {"term": "Structure", "definition": "Organizing interface elements into logical, meaningful spatial and conceptual relationships that reflect human mental models."},
            {"term": "Gestalt Principles", "definition": "Psychological laws describing how human perception naturally groups visual stimuli into unified wholes based on proximity, similarity, continuity, and closure."}
        ],
        "perceptual-principles": [
            {"term": "Legibility", "definition": "The ease with which individual characters, symbols, or graphical elements can be physically discerned and distinguished from their background."},
            {"term": "Visual Angle", "definition": "The angle subtended by an object at the human eye, determining the physical size of the image projected onto the retina."},
            {"term": "Absolute Judgment Limits", "definition": "The perceptual limitation where humans struggle to accurately differentiate more than 5 to 7 discrete levels along a single sensory dimension."},
            {"term": "Top-Down Processing", "definition": "Perceptual interpretation driven by prior knowledge, past experience, and contextual expectations rather than raw sensory data alone."},
            {"term": "Redundancy Gain", "definition": "Presenting identical information through multiple simultaneous sensory cues (e.g., color + shape + text) to enhance recognition speed and accuracy."},
            {"term": "Similarity Confusion", "definition": "The usability degradation that occurs when distinct actions or controls share identical visual properties, inducing user slips."},
            {"term": "Sensory Dimension", "definition": "A fundamental physical stimulus channel, such as hue, brightness, sound frequency, or loudness, along which information can vary."},
            {"term": "Discriminability", "definition": "The visual contrast and difference between distinct interface options that allows users to rapidly tell them apart without error."}
        ],
        "mental-models-and-attention": [
            {"term": "Principle of Pictorial Realism", "definition": "The display design rule stating that a display should visually resemble the physical object or conceptual spatial layout it represents."},
            {"term": "Principle of the Moving Part", "definition": "The display rule stating that moving display elements should move in a direction and manner consistent with the user's mental model of the physical system."},
            {"term": "Information Access Cost", "definition": "The cumulative cognitive, attentional, and physical effort or time required for a user to navigate to and retrieve required data."},
            {"term": "Proximity Compatibility Principle", "definition": "The attention principle requiring that information sources related to the same mental task must be placed close together spatially or perceptually."},
            {"term": "Principle of Multiple Resources", "definition": "The cognitive principle stating that human attention is split across separate sensory modalities (visual, auditory, tactile), so workloads should be distributed across channels."},
            {"term": "Mental Model", "definition": "A user's internal cognitive representation of how a system works, built from experience, training, and environmental feedback."},
            {"term": "Sensory Channel Overload", "definition": "The performance breakdown that occurs when too much competing information floods a single sensory modality (such as the visual field)."},
            {"term": "Selective Attention", "definition": "The cognitive process of focusing conscious mental effort on specific stimuli while filtering out irrelevant surrounding noise."}
        ],
        "memory-and-evaluation": [
            {"term": "Replace Memory with Visual Information", "definition": "The memory principle stating that interfaces should present necessary knowledge on-screen rather than forcing users to rely on fragile short-term recall."},
            {"term": "Principle of Predictive Aiding", "definition": "The memory principle stating that displays should project future system states and trends to help users plan proactive, timely interventions."},
            {"term": "Consistency in Memory", "definition": "Maintaining uniform terminology, color meanings, and spatial structures across an application so that long-term memory schemas remain valid."},
            {"term": "Short-Term Memory Limits", "definition": "The biological constraint that human working memory can only hold approximately 4 to 7 chunks of transient information for 15 to 30 seconds."},
            {"term": "Recognition over Recall", "definition": "The cognitive ergonomics axiom that recognizing a visually present cue requires significantly less mental effort than retrieving facts from memory."},
            {"term": "Proactive Planning", "definition": "Anticipating future changes in system behavior and taking corrective action before errors or bottlenecks occur."},
            {"term": "Auto-Fill / Auto-Complete", "definition": "A predictive and memory-sparing interaction technique that recalls past input strings to eliminate redundant typing and recall."},
            {"term": "Usability Evaluation", "definition": "The systematic assessment of an interface's effectiveness, efficiency, and satisfaction using empirical user testing and heuristic inspections."}
        ]
    }

    # Flashcards array matching terminology exactly
    fc_index = 1
    for cat, entries in subject_data["terminology"].items():
        for entry in entries:
            subject_data["flashcards"].append({
                "id": f"fc-hci-{fc_index:03d}",
                "term": entry["term"],
                "definition": entry["definition"],
                "category": cat
            })
            fc_index += 1

    # Achievements
    subject_data["achievements"] = [
        {
            "id": "ach-hci-first-contact",
            "title": "First Evaluation",
            "description": "Complete your first HCI session.",
            "icon": "Target",
            "condition": {"type": "runs_gte", "value": 1}
        },
        {
            "id": "ach-hci-perceptual-mastery",
            "title": "Cognitive Fluency",
            "description": "Achieve 85% or higher accuracy on an HCI run.",
            "icon": "Award",
            "condition": {"type": "accuracy_gte", "value": 85}
        },
        {
            "id": "ach-hci-perfect-ergonomics",
            "title": "Zero Cognitive Friction",
            "description": "Score a flawless 100% accuracy on a full HCI session.",
            "icon": "Trophy",
            "condition": {"type": "accuracy_gte", "value": 100}
        },
        {
            "id": "ach-hci-streak-10",
            "title": "Usability Streak",
            "description": "Answer 10 consecutive HCI questions correctly.",
            "icon": "Zap",
            "condition": {"type": "streak_gte", "value": 10}
        },
        {
            "id": "ach-hci-streak-20",
            "title": "Sensory Acuity",
            "description": "Answer 20 consecutive HCI questions correctly.",
            "icon": "Flame",
            "condition": {"type": "streak_gte", "value": 20}
        },
        {
            "id": "ach-hci-speedrun-complete",
            "title": "Rapid Interface Evaluator",
            "description": "Complete a Speedrun session under high cognitive velocity.",
            "icon": "Clock",
            "condition": {"type": "mode_complete", "mode": "speedrun"}
        },
        {
            "id": "ach-hci-speedrun-velocity",
            "title": "Sub-5 Rapid Transit",
            "description": "Complete a Speedrun mode run in under 300 seconds.",
            "icon": "Activity",
            "condition": {"type": "speedrun_under", "mode": "speedrun", "seconds": 300}
        },
        {
            "id": "ach-hci-hardcore-no-hints",
            "title": "Pure Mental Model",
            "description": "Complete Hardcore mode without using any hint nudges.",
            "icon": "ShieldCheck",
            "condition": {"type": "no_hints", "mode": "hardcore"}
        },
        {
            "id": "ach-hci-all-sectors-explored",
            "title": "Full Spectrum Ergonomist",
            "description": "Practice across every HCI category domain.",
            "icon": "Compass",
            "condition": {"type": "all_categories"}
        },
        {
            "id": "ach-hci-grandmaster",
            "title": "Grandmaster of Interaction",
            "description": "Unlock all other Human-Computer Interaction achievements.",
            "icon": "Crown",
            "condition": {"type": "all_unlocked"}
        }
    ]

    return subject_data

def validate_and_save():
    subject_data = build_hci_subject()
    errors = []
    warnings = []

    # 1. Check Questions
    questions = subject_data.get("questions", [])
    if len(questions) != 40:
        errors.append(f"Expected 40 questions, found {len(questions)}")

    q_ids = set()
    categories_used = set()
    for idx, q in enumerate(questions):
        qid = q.get("id")
        if qid in q_ids:
            errors.append(f"Duplicate question id: {qid}")
        q_ids.add(qid)

        qtype = q.get("type")
        opts = q.get("options", [])
        if qtype == "MCQ":
            if len(opts) != 4:
                errors.append(f"Question {qid} must have exactly 4 options")
            lengths = [len(o["text"]) for o in opts]
            if len(set(lengths)) > 1:
                errors.append(f"Question {qid} MCQ options have mismatched lengths: {lengths}")
        elif qtype == "TrueFalse":
            if len(opts) != 2:
                errors.append(f"Question {qid} TrueFalse must have 2 options")
            if [o["text"] for o in opts] != ["True", "False"]:
                errors.append(f"Question {qid} TrueFalse options must be exactly True, False")
        else:
            errors.append(f"Question {qid} has unknown type: {qtype}")

        cat = q.get("category")
        categories_used.add(cat)
        if cat not in subject_data["terminology"]:
            errors.append(f"Question {qid} category '{cat}' not found in terminology")

        if not q.get("explanation"):
            errors.append(f"Question {qid} missing explanation")
        if not q.get("hint"):
            errors.append(f"Question {qid} missing hint")

    # 2. Check LaTeX delimiters (no single $)
    json_str_raw = json.dumps(subject_data)
    # Scan for lone $ not preceded by $ and not followed by $
    # (Matches any unescaped single $)
    lone_dollars = re.findall(r'(?<!\$)\$(?!\$)', json_str_raw)
    if lone_dollars:
        errors.append(f"Found {len(lone_dollars)} single '$' LaTeX delimiters! Must use '$$'")

    # 3. Check Terminology vs Flashcards alignment
    term_terms = set()
    for cat, items in subject_data["terminology"].items():
        for item in items:
            term_terms.add(item["term"])

    fc_terms = set(fc["term"] for fc in subject_data["flashcards"])
    if term_terms != fc_terms:
        diff1 = term_terms - fc_terms
        diff2 = fc_terms - term_terms
        errors.append(f"Terminology and Flashcards terms mismatch! In terminology not fc: {diff1}, in fc not terminology: {diff2}")

    print(f"Validation Result: {len(errors)} Errors, {len(warnings)} Warnings")
    if errors:
        for err in errors:
            print(f"  [ERROR] {err}")
        return False

    out_file = "public/examples/human-computer-interaction.json"
    os.makedirs(os.path.dirname(out_file), exist_ok=True)
    # Output single-line compact JSON without unnecessary whitespace
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(subject_data, f, separators=(',', ':'), ensure_ascii=False)

    print(f"Successfully generated and validated {out_file} ({os.path.getsize(out_file)} bytes)")
    return True

if __name__ == "__main__":
    success = validate_and_save()
    exit(0 if success else 1)
