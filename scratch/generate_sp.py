import json
import os

def generate_subject():
    subject = {
        "id": "system-programming",
        "name": "System Programming",
        "config": {
            "title": "System Programming Mastery",
            "description": "Master OS architectures, multi-process fork execution, thread context switching, synchronization (semaphores, monitors, mutexes), virtual memory, and security bugs.",
            "version": "1.0",
            "storageKey": "mold_system_programming"
        },
        "questions": [],
        "flashcards": [],
        "terminology": {},
        "achievements": []
    }

    # 21 categories matching the CS 304 syllabus and taking TAKE_ME_TO_ANY_CHATBOT.txt as source
    categories = [
        "os-abstract-views",
        "system-calls",
        "processes-threads",
        "context-switching",
        "process-scheduling",
        "time-sharing-multitasking",
        "virtual-memory-addressing",
        "caching",
        "spooling",
        "user-kernel-threads",
        "process-synchronization",
        "shared-memory",
        "race-conditions",
        "deadlocks",
        "semaphores",
        "monitors",
        "mutexes-locks",
        "buffer-overflows",
        "format-string-bugs",
        "command-injections",
        "modular-design-abstraction"
    ]

    # Terminology Definitions (2 per category = 42 total)
    subject["terminology"] = {
        "os-abstract-views": [
            {"term": "User Mode vs Kernel Mode", "definition": "User Mode restricts CPU access using mode bit 1. Kernel Mode allows full control using mode bit 0."},
            {"term": "Monolithic OS View", "definition": "An OS architecture where all core services run directly in a single large kernel address space."}
        ],
        "system-calls": [
            {"term": "System Call API", "definition": "A standard programming interface wrapping the low-level kernel trap instructions for applications."},
            {"term": "Trap Instruction", "definition": "A software-generated exception switching the processor to kernel mode to request OS services."}
        ],
        "processes-threads": [
            {"term": "Process Address Space", "definition": "The memory context allocated to a process, containing text, data, heap, and stack segments."},
            {"term": "Fork Child Return", "definition": "The return value of fork(), which is 0 for the child process and the child's PID for the parent."}
        ],
        "context-switching": [
            {"term": "Context Switch Steps", "definition": "The sequence of saving registers of process A to PCB A, selecting B, loading B's registers, and jumping."},
            {"term": "Context Switch Overhead", "definition": "The CPU cycle time spent saving and loading process states, page tables, and flushing caches."}
        ],
        "process-scheduling": [
            {"term": "Non-Preemptive Scheduling", "definition": "A scheduling policy where a running process retains CPU control until it terminates or blocks voluntarily."},
            {"term": "Preemptive Scheduling", "definition": "A scheduling policy where the kernel can interrupt running processes to reallocate CPU cores."}
        ],
        "time-sharing-multitasking": [
            {"term": "Time Slicing Hardware", "definition": "A physical hardware timer chip generating periodic interrupts to invoke the OS scheduler."},
            {"term": "Multitasking Mechanism", "definition": "Rapid time-slicing process context switching creating the illusion of concurrent execution."}
        ],
        "virtual-memory-addressing": [
            {"term": "MMU Address Translation", "definition": "Hardware address translation resolving virtual page numbers to physical frame numbers using page tables."},
            {"term": "TLB", "definition": "Translation Lookaside Buffer: a high-speed hardware cache in the MMU storing recent page mappings."}
        ],
        "caching": [
            {"term": "Cache Hit Ratio", "definition": "The percentage of memory access requests resolved successfully in cache relative to total memory hits."},
            {"term": "L1 vs L3 Cache", "definition": "L1 is tiny, ultra-fast, core-local cache. L3 is larger, slower, and shared among multiple CPU cores."}
        ],
        "spooling": [
            {"term": "Spooling Bottleneck", "definition": "Using disk-based staging directories to prevent fast CPU execution from stalling on slow peripherals."},
            {"term": "Spooling vs Buffering", "definition": "Buffering holds temporary stream data in RAM. Spooling manages sequential device queues on disk."}
        ],
        "user-kernel-threads": [
            {"term": "ULT Block Issue", "definition": "The limitation where a user-space thread calling a blocking system call suspends its entire parent process."},
            {"term": "KLT Multiprocessor", "definition": "Kernel threads allowing concurrent execution of multiple threads from the same process on different CPUs."}
        ],
        "process-synchronization": [
            {"term": "Peterson's Algorithm", "definition": "A pure software mutual exclusion solution for two processes using shared flag and turn variables."},
            {"term": "Progress Requirement", "definition": "The synchronization rule ensuring only processes wanting to enter a critical section can decide who enters next."}
        ],
        "shared-memory": [
            {"term": "Shared Memory mapping", "definition": "Mapping the same physical RAM frame directly to page tables of separate processes for zero-copy IPC."},
            {"term": "Shared Memory Sync", "definition": "The requirement for developers to use mutexes/semaphores manually to protect shared memory write states."}
        ],
        "race-conditions": [
            {"term": "Race Condition Cause", "definition": "Concurrency read-modify-write sequences executed on shared mutable states without proper lock protections."},
            {"term": "lost update problem", "definition": "A data race where interleaved writes cause one process to overwrite and discard another process's update."}
        ],
        "deadlocks": [
            {"term": "Deadlock Conditions", "definition": "The four required conditions for deadlock: Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait."},
            {"term": "Circular Wait", "definition": "A closed loop dependency chain of processes where each waits for a resource held by the next process."}
        ],
        "semaphores": [
            {"term": "P and V operations", "definition": "Atomic semaphore operations: wait (P) decrements/blocks; signal (V) increments/wakes waiting threads."},
            {"term": "Counting vs Binary", "definition": "Counting semaphores manage multiple resources. Binary semaphores act as locks (values restricted to 0 or 1)."}
        ],
        "monitors": [
            {"term": "Monitor Condition Queue", "definition": "The monitor queue where threads are suspended when calling wait() on a condition variable."},
            {"term": "Monitor Mutual Exclusion", "definition": "Automatic mutual exclusion enforced inside monitor methods by the compiler or language runtime."}
        ],
        "mutexes-locks": [
            {"term": "Mutex Ownership", "definition": "A mutual exclusion lock that can only be unlocked by the exact thread that acquired the lock."},
            {"term": "Spinlock Usage", "definition": "A lock using busy-waiting loops, efficient only for short hold times on multi-processor systems."}
        ],
        "buffer-overflows": [
            {"term": "Buffer Overflow Stack", "definition": "Writing data past local buffer limits on the stack to overwrite SFP and the function return address."},
            {"term": "strcpy Vulnerability", "definition": "An unsafe C library function copying characters until finding a null terminator without buffer bounds checks."}
        ],
        "format-string-bugs": [
            {"term": "Format String Exploits", "definition": "Exploiting printf calls by passing specifiers like %x to read the stack or %n to write to memory addresses."},
            {"term": "printf format fix", "definition": "Writing printf(\"%s\", input) instead of printf(input) to guarantee input is parsed strictly as a string."}
        ],
        "command-injections": [
            {"term": "Command Injection", "definition": "Concatenating unsanitized inputs containing shell delimiters into strings executed by system() calls."},
            {"term": "shell metacharacters", "definition": "Special shell operators like semicolons, pipes, and ampersands used to chain and hijack commands."}
        ],
        "modular-design-abstraction": [
            {"term": "HAL", "definition": "Hardware Abstraction Layer: a kernel module hiding board layout and physical registers behind uniform APIs."},
            {"term": "Function Pointers C", "definition": "Variables containing function entry addresses, enabling dynamic registration of device drivers."}
        ]
    }

    # Flashcards (2 per category = 42 total)
    flashcards_raw = [
        ("f-sp-1", "User Mode vs Kernel Mode", "User Mode has restricted instructions and mode bit 1. Kernel Mode has full access and mode bit 0.", "os-abstract-views"),
        ("f-sp-2", "Monolithic OS View", "A view where all OS services (scheduling, memory, drivers) run inside a single large kernel address space.", "os-abstract-views"),
        ("f-sp-3", "System Call API", "The interface (like POSIX) wrapping kernel traps, enabling programmers to write portable high-level code.", "system-calls"),
        ("f-sp-4", "Trap Instruction", "A hardware assembly command shifting CPU execution from user-space to a predefined handler in kernel mode.", "system-calls"),
        ("f-sp-5", "Process Address Space", "Consists of Text (code), Data (globals), Heap (dynamic allocations), and Stack (local variables, frame state).", "processes-threads"),
        ("f-sp-6", "Fork Child Return", "The system call `fork()` returns 0 to the newly created child process and the child's PID to the parent process.", "processes-threads"),
        ("f-sp-7", "Context Switch Steps", "1. Save PC and registers to current PCB. 2. Select next PCB. 3. Restore PC and registers. 4. Jump to PC.", "context-switching"),
        ("f-sp-8", "Context Switch Overhead", "The CPU time wasted on saving and restoring registers, page tables, and flushing caches (no productive work done).", "context-switching"),
        ("f-sp-9", "Non-Preemptive Scheduling", "A scheduler that cannot take the CPU away from a running process until the process yields, blocks, or terminates.", "process-scheduling"),
        ("f-sp-10", "Preemptive Scheduling", "A scheduler that can interrupt a running process to allocate CPU to another, ensuring fairer resource share.", "process-scheduling"),
        ("f-sp-11", "Time Slicing Hardware", "An interval timer chip triggering periodic hardware interrupts, causing the OS scheduler to evaluate the running process.", "time-sharing-multitasking"),
        ("f-sp-12", "Multitasking Mechanism", "Preemptive scheduling using rapid time-slicing context switches to create the illusion of concurrent execution.", "time-sharing-multitasking"),
        ("f-sp-13", "MMU Address Translation", "Translates virtual addresses to physical. If the virtual page is not marked present in memory, triggers a page fault.", "virtual-memory-addressing"),
        ("f-sp-14", "TLB", "Translation Lookaside Buffer: a high-speed hardware cache in the MMU storing recent page table translations.", "virtual-memory-addressing"),
        ("f-sp-15", "Cache Hit Ratio", "The fraction of memory accesses resolved in cache relative to total memory references, measuring cache effectiveness.", "caching"),
        ("f-sp-16", "L1 vs L3 Cache", "L1 is tiny, extremely fast, and local to CPU cores; L3 is larger, slower, and shared among multiple processor cores.", "caching"),
        ("f-sp-17", "Spooling Bottleneck", "Spooling prevents fast CPUs from stalling on slow printers by staging print documents in disk-based print queues.", "spooling"),
        ("f-sp-18", "Spooling vs Buffering", "Buffering handles single stream data chunk transfers; spooling manages concurrent execution queues for slow devices.", "spooling"),
        ("f-sp-19", "ULT Block Issue", "Since the kernel does not recognize ULTs, if one ULT calls a blocking syscall, the entire process is blocked.", "user-kernel-threads"),
        ("f-sp-20", "KLT Multiprocessor", "Because the kernel schedules KLTs, it can allocate different threads of the same process to separate CPUs concurrently.", "user-kernel-threads"),
        ("f-sp-21", "Peterson's Algorithm", "A software solution for two processes using shared flag and turn variables to guarantee mutual exclusion in critical sections.", "process-synchronization"),
        ("f-sp-22", "Progress Requirement", "If no process is in its critical section, only processes wishing to enter can participate in choosing the next one.", "process-synchronization"),
        ("f-sp-23", "Shared Memory mapping", "Processes map the same physical frame into their virtual page tables, enabling zero-copy high-speed communication.", "shared-memory"),
        ("f-sp-24", "Shared Memory Sync", "Since shared memory does not provide automatic synchronization, developers must use mutexes or semaphores manually.", "shared-memory"),
        ("f-sp-25", "Race Condition Cause", "Occurs when concurrent execution steps execute unsynchronized read-modify-write sequences on shared memory state.", "race-conditions"),
        ("f-sp-26", "lost update problem", "When process A reads, process B reads, A writes, and then B writes, overwriting A's value and discarding the increment.", "race-conditions"),
        ("f-sp-27", "Deadlock Conditions", "1. Mutual Exclusion. 2. Hold and Wait. 3. No Preemption. 4. Circular Wait. (All 4 must hold simultaneously).", "deadlocks"),
        ("f-sp-28", "Circular Wait", "A closed chain of processes where each process holds a resource needed by the next process in the cycle.", "deadlocks"),
        ("f-sp-29", "P and V operations", "P (wait) decrements the semaphore; if negative, blocks the caller. V (signal) increments; if non-positive, wakes a thread.", "semaphores"),
        ("f-sp-30", "Counting vs Binary", "Counting manages N resource instances. Binary acts as a mutual exclusion lock with value restricted to 0 or 1.", "semaphores"),
        ("f-sp-31", "Monitor Condition Queue", "Where threads sleep after calling `wait()`. Woken when another thread inside the monitor calls `signal()`.", "monitors"),
        ("f-sp-32", "Monitor Mutual Exclusion", "Guaranteed automatically by the compiler/runtime, ensuring at most one thread is executing inside the monitor.", "monitors"),
        ("f-sp-33", "Mutex Ownership", "A lock that can only be unlocked by the exact thread that locked it, avoiding cross-thread lock violations.", "mutexes-locks"),
        ("f-sp-34", "Spinlock Usage", "Optimal for multiprocessor systems where lock hold times are short, avoiding context switch sleep overhead.", "mutexes-locks"),
        ("f-sp-35", "Buffer Overflow Stack", "Overwriting local array variables until the function call stack frame return address is replaced with attacker code.", "buffer-overflows"),
        ("f-sp-36", "strcpy Vulnerability", "Copies strings until a null terminator `\0` is found, ignoring output buffer size limits and causing stack overflows.", "buffer-overflows"),
        ("f-sp-37", "Format String Exploits", "%x dumps stack memory to the screen; %n writes values to memory addresses parsed from parameters on the stack.", "format-string-bugs"),
        ("f-sp-38", "printf format fix", "Always write `printf(\"%s\", input)` instead of `printf(input)` to completely eliminate format string bugs.", "format-string-bugs"),
        ("f-sp-39", "Command Injection", "An exploit where a program passes unsanitized input directly into system shells, allowing arbitrary code execution.", "command-injections"),
        ("f-sp-40", "shell metacharacters", "Characters like `;`, `&`, `|` which separate commands in shell scripts, utilized in command injection attacks.", "command-injections"),
        ("f-sp-41", "HAL", "Hardware Abstraction Layer: a module hiding physical board layout and CPU registers behind uniform interfaces.", "modular-design-abstraction"),
        ("f-sp-42", "Function Pointers C", "Variables storing function addresses, enabling dynamic driver registration and decoupling module implementation details.", "modular-design-abstraction")
    ]

    for fid, term, definition, category in flashcards_raw:
        subject["flashcards"].append({
            "id": fid,
            "term": term,
            "definition": definition,
            "category": category
        })

    # Achievements definitions
    subject["achievements"] = [
        {
            "id": "ach-sp-runs",
            "title": "Kernel Initialized",
            "description": "Complete 1 run of System Programming.",
            "icon": "Play",
            "condition": {"type": "runs_gte", "value": 1}
        },
        {
            "id": "ach-sp-accuracy",
            "title": "Bug-Free Compiler",
            "description": "Complete a run with 90%+ accuracy.",
            "icon": "Award",
            "condition": {"type": "accuracy_gte", "value": 90}
        },
        {
            "id": "ach-sp-streak",
            "title": "Instruction Pipeline",
            "description": "Achieve a streak of 10 correct answers.",
            "icon": "Zap",
            "condition": {"type": "streak_gte", "value": 10}
        },
        {
            "id": "ach-sp-speedrun",
            "title": "Real-Time Execution",
            "description": "Complete Speedrun mode.",
            "icon": "Timer",
            "condition": {"type": "mode_complete", "mode": "speedrun"}
        },
        {
            "id": "ach-sp-speedrun-under",
            "title": "Zero-Latency Kernel",
            "description": "Complete Speedrun in under 240 seconds.",
            "icon": "Activity",
            "condition": {"type": "speedrun_under", "mode": "speedrun", "seconds": 240}
        },
        {
            "id": "ach-sp-hardcore",
            "title": "Bare-Metal Developer",
            "description": "Complete Hardcore mode with no hints.",
            "icon": "Flame",
            "condition": {"type": "no_hints", "mode": "hardcore"}
        },
        {
            "id": "ach-sp-categories",
            "title": "Full System Revision",
            "description": "Practice all 21 categories.",
            "icon": "BookOpen",
            "condition": {"type": "all_categories"}
        },
        {
            "id": "grand-master",
            "title": "Socratic Architect",
            "description": "Unlock all other achievements.",
            "icon": "Trophy",
            "condition": {"type": "all_unlocked"}
        }
    ]

    # Helper function to generate options with exactly matching length.
    # We will pad each option text with trailing spaces.
    def make_same_length_options(opts_text, labels=["A", "B", "C", "D"]):
        opts = []
        max_len = max(len(t) for t in opts_text)
        for idx, text in enumerate(opts_text):
            padded_text = text.ljust(max_len)
            opts.append({
                "label": labels[idx],
                "text": padded_text
            })
        return opts

    # We will define 200 questions:
    # 21 categories. 11 categories will have 10 questions, 10 categories will have 9 questions. Total = 200.
    # To satisfy 60% diagrams, we need 120 questions with diagrams.
    # Diagram count: we will assign diagrams to 120 questions.
    # We will structure them programmatically using question templates to ensure high density.
    # Let's define the 200 questions.
    
    questions = []

    # Question details
    # We need to construct highly educational questions targeting:
    # - Conceptual essay prep
    # - Code trace
    # - Code writing
    # Spreading across 21 categories.

    # 1. os-abstract-views (10 questions)
    # 2. system-calls (10 questions)
    # 3. processes-threads (10 questions)
    # 4. context-switching (10 questions)
    # 5. process-scheduling (10 questions)
    # 6. time-sharing-multitasking (10 questions)
    # 7. virtual-memory-addressing (10 questions)
    # 8. caching (10 questions)
    # 9. spooling (10 questions)
    # 10. user-kernel-threads (10 questions)
    # 11. process-synchronization (10 questions)
    # 12. shared-memory (9 questions)
    # 13. race-conditions (9 questions)
    # 14. deadlocks (9 questions)
    # 15. semaphores (9 questions)
    # 16. monitors (9 questions)
    # 17. mutexes-locks (9 questions)
    # 18. buffer-overflows (9 questions)
    # 19. format-string-bugs (9 questions)
    # 20. command-injections (9 questions)
    # 21. modular-design-abstraction (9 questions)
    
    # Total = 11*10 + 10*9 = 110 + 90 = 200.

    # Let's write a rich builder loop. We will populate a huge list of question definition tuples.
    # Tuple shape: (category, difficulty, type, question_text, options_list, correct_answer, explanation, hint, diagram_str)
    
    raw_questions = []

    # os-abstract-views (10 questions)
    raw_questions.append((
        "os-abstract-views", "Easy", "MCQ",
        "An essay question asks you to describe the layered view of an Operating System. Which components sit directly above and below the API layer?<br>[EXAMINE DIAGRAM]",
        ["Application User Interface (AUI) and OS Kernel", "Hardware Execution Layer and OS Kernel      ", "OS Kernel and Application Programs          ", "Device Drivers and Device Controllers       "],
        "A",
        "The layered OS model stack is: Users (top) -> AUI (Shell/Commands) -> API (Libraries/System Calls) -> OS Kernel -> Hardware. Therefore, the API sits between AUI and the OS Kernel.",
        "Think about where library function calls sit relative to the Shell (AUI) and the low-level Kernel code.",
        "graph TD\n  U[\"Users\"] --> AUI[\"AUI (Shell/App User Interface)\"]\n  AUI --> API[\"API (System Call Interface)\"]\n  API --> K[\"OS Kernel\"]\n  K --> HW[\"Hardware Layer\"]"
    ))
    raw_questions.append((
        "os-abstract-views", "Medium", "MCQ",
        "To write a code-trace analyzing CPU mode transitions, which event causes the CPU to switch from User Mode (1) to Kernel Mode (0)?<br>[EXAMINE DIAGRAM]",
        ["A hardware interrupt, trap, or system call", "A standard C library function execution    ", "A user-space variable write instruction    ", "An instruction cache prefetch operation    "],
        "A",
        "When an interrupt, trap, or system call occurs, the hardware automatically switches the mode bit from 1 (User) to 0 (Kernel) and branches to a kernel vector address.",
        "Look at the transition path from User to Monitor mode in dual-mode operation.",
        "stateDiagram-v2\n  [*] --> UserMode\n  UserMode --> KernelMode : Interrupt / Trap / Syscall\n  KernelMode --> UserMode : Return to User (Set Mode 1)"
    ))
    raw_questions.append((
        "os-abstract-views", "Hard", "MCQ",
        "In a Socratic essay explaining why Monolithic Kernels perform faster than Microkernels, which architectural factor is the most critical?",
        ["Monolithic kernels avoid IPC context switch penalties", "Monolithic kernels use simpler machine code designs  ", "Monolithic kernels completely disable CPU interrupts", "Monolithic kernels allocate memory only on the stack"],
        "A",
        "Monolithic kernels run all OS services (scheduling, file system, drivers) in the same address space. Accessing a service is a fast function call, whereas in microkernels it requires IPC context switches.",
        "Think about address spaces: where do drivers and systems run in a Monolithic kernel vs a Microkernel?",
        None
    ))
    raw_questions.append((
        "os-abstract-views", "Easy", "TrueFalse",
        "True or False: In a dual-mode CPU, user applications can directly execute privileged instructions when running in User Mode.",
        ["True", "False"],
        "B",
        "Privileged instructions can only be executed in Monitor/Kernel Mode (mode bit 0). Attempting to run them in User Mode causes a processor exception/trap.",
        "What is the primary role of the CPU mode bit?",
        None
    ))
    raw_questions.append((
        "os-abstract-views", "Medium", "MCQ",
        "An essay exam asks you to illustrate the shared resource manager view of an OS. What primary components are shown in the internal view?<br>[EXAMINE DIAGRAM]",
        ["CPU scheduling, memory, file, and device management", "Application programs, user shells, and databases     ", "Web browsers, print spoolers, and compilers         ", "Register files, arithmetic logic units, and TLBs    "],
        "A",
        "The internal resource manager view of an OS includes the main managers: Process/CPU scheduler, Memory, Resource/Device, and File managers.",
        "Consider the essential physical computer resources that the OS must allocate to running programs.",
        "flowchart LR\n  OS[\"OS Resource Manager\"] --> CPU[\"Process / CPU Manager\"]\n  OS --> MEM[\"Memory Manager\"]\n  OS --> DEV[\"Device / Resource Manager\"]\n  OS --> FILE[\"File Manager\"]"
    ))
    raw_questions.append((
        "os-abstract-views", "Easy", "MCQ",
        "Which of the following describes the role of the System Programmer user class in system design?",
        ["Writes software that manages hardware resources", "Interacts with systems via graphical GUIs only", "Solves high-level business problems in Python", "Configures office networks and local routers  "],
        "A",
        "System programmers write system software (compilers, loaders, linkers, OS components) to control resources and provide an environment for application programmers.",
        "Look at the classification of system programmers vs application programmers and end-users.",
        None
    ))
    raw_questions.append((
        "os-abstract-views", "Medium", "MCQ",
        "When explaining OS design goals, which pair correctly matches a User Goal with a System Goal?",
        ["Convenience of use AND ease of implementation  ", "High memory usage AND manual garbage collection", "High latency times AND hardware dependency      ", "Strict user login AND low network security      "],
        "A",
        "User goals focus on convenience, speed, reliability, and ease of learning. System goals focus on design simplicity, flexibility, reliability, efficiency, and maintenance.",
        "Consider what the person using the computer wants vs what the OS developer wants.",
        None
    ))
    raw_questions.append((
        "os-abstract-views", "Hard", "MCQ",
        "In a code-trace scenario, a program executes an illegal memory write. What sequence is triggered in a dual-mode system?<br>[EXAMINE DIAGRAM]",
        ["CPU raises a trap -> switches to mode 0 -> calls handler", "Program continues execution -> writes to disk directly   ", "CPU sets mode bit to 1 -> invokes main function again   ", "OS halts immediately -> system power is powered off     "],
        "A",
        "An illegal memory write violates page protections. The hardware MMU detects this, triggers a trap (software interrupt), switches the mode bit to 0, and runs the kernel's fault handler (e.g. SIGSEGV).",
        "Think about how the hardware responds to a memory protection fault.",
        "graph TD\n  P[\"Process Writes Memory\"] --> MMU[\"MMU Checks Address\"]\n  MMU -->|Illegal| TRAP[\"Trigger Trap Exception\"]\n  TRAP -->|Set Mode 0| KH[\"Execute Kernel Fault Handler\"]\n  KH --> TERM[\"Terminate Process (SIGSEGV)\"]"
    ))
    raw_questions.append((
        "os-abstract-views", "Easy", "TrueFalse",
        "True or False: The Operating System acts as a resource allocator to resolve conflicting requests for hardware utilization.",
        ["True", "False"],
        "A",
        "As a resource allocator, the OS manages CPU, memory, I/O devices, and files, resolving conflicts to ensure efficient and fair execution.",
        "What must the OS do when two processes request the same printer or CPU core?",
        None
    ))
    raw_questions.append((
        "os-abstract-views", "Medium", "MCQ",
        "Explain the benefit of the virtual machine approach to OS architecture.<br>[EXAMINE DIAGRAM]",
        ["It provides complete protection of system resources ", "It speeds up program execution to bare-metal speed", "It eliminates the need for physical CPU scheduling ", "It runs all hardware components in the user space "],
        "A",
        "Virtual machines isolate guest operating systems. An error in one virtual machine does not affect other guests or the host system, providing robust security and protection.",
        "Think about isolation: if one guest OS crashes, what happens to the others?",
        "flowchart TD\n  VM1[\"Guest OS 1 (User App)\"] --> HW[\"Virtual Machine Monitor (VMM)\"]\n  VM2[\"Guest OS 2 (User App)\"] --> HW\n  HW --> PHYS[\"Physical Hardware Layer\"]"
    ))

    # 2. system-calls (10 questions)
    raw_questions.append((
        "system-calls", "Medium", "MCQ",
        "Which sequence outlines the steps taken during a standard C system call trace like `read(fd, buf, count)`?<br>[EXAMINE DIAGRAM]",
        ["Push arguments -> trap instruction -> mode 0 -> service routine", "Check cache -> branch to main -> trigger timer -> mode 1       ", "Allocate heap -> copy buffer -> disable MMU -> branch to stack  ", "Write registers -> fork process -> return 0 -> loop index      "],
        "A",
        "System calls push arguments onto the stack/registers, execute a trap instruction to switch the CPU mode to 0, lookup the syscall index in the vector table, execute the service routine, and return.",
        "How does user space request services from kernel space safely without direct jumps?",
        "sequenceDiagram\n  UserApp->>Library: read(fd, buf, size)\n  Library->>Kernel: Trap Instruction (Switch to Mode 0)\n  Kernel->>Kernel: Execute Read Syscall Service\n  Kernel-->>Library: Return Result (Switch to Mode 1)\n  Library-->>UserApp: Return size / status"
    ))
    raw_questions.append((
        "system-calls", "Hard", "MCQ",
        "An essay question asks you to compare System Calls and Library Calls. What is the fundamental difference in execution space?",
        ["System calls execute in kernel mode; library calls execute in user mode", "System calls execute in user mode; library calls execute in kernel mode", "System calls execute on the CPU; library calls execute on hard disks     ", "System calls are written in Java; library calls are written in Assembly  "],
        "A",
        "Library calls (like `strlen`) run entirely in user mode (user space). System calls (like `write`) must switch the CPU to kernel mode (kernel space) via a trap to execute privileged operations.",
        "Think about where the CPU mode bit switches during execution.",
        None
    ))
    raw_questions.append((
        "system-calls", "Easy", "TrueFalse",
        "True or False: User applications invoke system calls directly by executing jump instructions to arbitrary kernel code addresses.",
        ["True", "False"],
        "B",
        "User applications cannot jump directly to kernel addresses due to memory protection. They must use a trap instruction, which jumps to a fixed, secure kernel vector address.",
        "Does user mode code have permission to execute jump instructions to kernel memory addresses?",
        None
    ))
    raw_questions.append((
        "system-calls", "Medium", "MCQ",
        "You are writing a C program to perform file copying. Which APIs are system calls rather than standard library calls?<br>[EXAMINE DIAGRAM]",
        ["open(), read(), write(), close()", "fopen(), fread(), fwrite(), fclose()", "printf(), malloc(), free(), exit()  ", "scanf(), strcat(), strcpy(), strlen()"],
        "A",
        "The calls `open`, `read`, `write`, and `close` are direct POSIX system calls. The `f`-prefixed functions (`fopen`, `fread`) are standard C library wrappers that buffer data in user space.",
        "Identify the low-level, direct OS interfaces vs the buffered standard library wrappers.",
        "graph TD\n  App[\"User App\"] -->|Library Call| Lib[\"fopen() / fread() (C Library)\"]\n  Lib -->|System Call| Sys[\"open() / read() (OS Kernel)\"]\n  App -->|Direct Syscall| Sys"
    ))
    raw_questions.append((
        "system-calls", "Easy", "MCQ",
        "Which of the following is a system call category related to process control?",
        ["fork(), execve(), wait(), exit() ", "socket(), bindv(), send(), recv()", "chmod(), chown(), link(), unlink()", "shmget(), shmat(), semget(), semop()"],
        "A",
        "`fork`, `execve`, `wait`, and `exit` are system calls used for process creation, execution, synchronization, and termination.",
        "Think about system calls that create, execute, or wait for active processes.",
        None
    ))
    raw_questions.append((
        "system-calls", "Hard", "MCQ",
        "When a system call returns an error, how does it traditionally communicate the error type to a C program?",
        ["Returns -1 and sets the global variable errno", "Triggers a hardware abort and reboots the CPU ", "Modifies the program counter to jump to main  ", "Clears the process heap space and sets registers"],
        "A",
        "In POSIX/Unix systems, system calls return -1 (or NULL) on failure and store the specific error code in the thread-local global variable `errno`.",
        "How do you inspect what went wrong after a failed `open()` or `read()` call?",
        None
    ))
    raw_questions.append((
        "system-calls", "Medium", "MCQ",
        "In a Socratic essay, a student claims 'System calls are slow.' Which of the following is the best way to explain the source of this latency?<br>[EXAMINE DIAGRAM]",
        ["It is caused by the transition overhead between user and kernel space", "It is caused by the slow transmission speed of virtual memory networks ", "It is caused by the CPU waiting for the secondary disk spin cycles    ", "It is caused by compiler optimization passes stripping syscall code   "],
        "A",
        "System call latency comes from context transitions: saving user registers, switching the CPU mode bit, executing kernel checks, restoring registers, and switching mode back.",
        "Think about the operations performed by the CPU when transitioning across the user-kernel boundary.",
        "sequenceDiagram\n  User->>Kernel: Trap (Save registers, Set mode 0)\n  Note over Kernel: Execute Service Routine (Latency)\n  Kernel-->>User: Return (Restore registers, Set mode 1)"
    ))
    raw_questions.append((
        "system-calls", "Easy", "TrueFalse",
        "True or False: Operating systems use system calls to enforce security boundary checks on all hardware access requests.",
        ["True", "False"],
        "A",
        "System calls act as the gatekeeper. Because the kernel executes the system call in mode 0, it can validate user parameters and permissions before performing I/O.",
        "Why does the OS prevent user programs from accessing hardware registers directly?",
        None
    ))
    raw_questions.append((
        "system-calls", "Medium", "MCQ",
        "During a syscall execution, what is the role of the system call table?<br>[EXAMINE DIAGRAM]",
        ["It maps syscall numbers to their corresponding kernel function addresses", "It records the list of active user processes currently running in memory", "It stores temporary file descriptors opened by user-space applications ", "It caches recently translated virtual memory page frame addresses        "],
        "A",
        "The system call table is a vector array containing the entry points of all syscall handlers in the kernel. The trap handler uses the syscall number as an index to lookup the function address.",
        "How does the kernel trap handler know which function (e.g. sys_read vs sys_write) to execute?",
        "graph LR\n  Index[\"Syscall Number (e.g. 3)\"] --> Table[\"Syscall Table\"]\n  Table -->|Index 3| Handler[\"sys_read() Kernel Address\"]\n  Handler --> Exec[\"Execute Read Routine\"]"
    ))
    raw_questions.append((
        "system-calls", "Hard", "MCQ",
        "An essay question asks you to trace a program that calls `sys_write`. Which instruction transitions the CPU to privilege level 0 on an x86-64 machine?",
        ["syscall (or int 0x80) instruction  ", "jmp kernel_entry instruction       ", "mov reg, kernel_addr instruction  ", "push kernel_stack instruction      "],
        "A",
        "On modern x86-64 processors, the `syscall` instruction is used. On older x86 systems, the software interrupt instruction `int 0x80` is executed.",
        "Look for the instruction designed specifically to generate a trap/software interrupt.",
        None
    ))

    # 3. processes-threads (10 questions)
    raw_questions.append((
        "processes-threads", "Medium", "MCQ",
        "An essay exam asks you to compare process and thread memory sharing. Which statement correctly describes the memory layout?<br>[EXAMINE DIAGRAM]",
        ["Threads share code, data, and heap; processes share nothing by default", "Threads share code, stack, and heap; processes share stack by default ", "Processes share heap and data; threads share only stack structures    ", "Processes share stack and code; threads share stack and registers     "],
        "A",
        "Threads within a process share the text (code), data, and heap segments. Each thread must have its own private stack and register state for execution control.",
        "Consider which elements of the address space are shared for joint work vs what is needed to track independent functions.",
        "flowchart TD\n  subgraph Process Address Space\n    Shared[\"Shared: Code / Globals / Heap\"]\n    Shared --> T1Stack[\"Thread 1 Stack\"]\n    Shared --> T2Stack[\"Thread 2 Stack\"]\n  end"
    ))
    raw_questions.append((
        "processes-threads", "Hard", "MCQ",
        "You are tracing the output of a multi-process C program containing `fork()`. Trace the output of this code snippet:<br><code>int x = 5; if (fork() == 0) { x *= 2; } else { x += 3; } printf(\"%d \", x);</code>",
        ["10 and 8 (in either order)          ", "10 and 10 (in either order)         ", "8 and 8 (in either order)           ", "16 and 5 (in either order)          "],
        "A",
        "`fork()` duplicates the calling process. The child gets a copy of `x` (initially 5) and receives return value 0, executing `x *= 2` (10). The parent receives the child's PID, executing `x += 3` (8). Both execute independently.",
        "Recall that fork() duplicates memory. Do parent and child share the variable 'x' after fork completes?",
        None
    ))
    raw_questions.append((
        "processes-threads", "Easy", "TrueFalse",
        "True or False: A thread has its own independent address space separate from other threads in the same process.",
        ["True", "False"],
        "B",
        "Threads in the same process share the same address space (heap, data, code). Processes have independent address spaces.",
        "Do threads require IPC calls like pipe or shared memory to communicate with sister threads?",
        None
    ))
    raw_questions.append((
        "processes-threads", "Medium", "MCQ",
        "In a system where process creation uses `fork()`, what is the relationship between the parent and child process memory states?<br>[EXAMINE DIAGRAM]",
        ["The child gets a duplicate copy of the parent address space ", "The child shares all stack frames directly with the parent    ", "The parent and child execute on the same stack concurrently  ", "The child memory changes immediately update parent variables "],
        "A",
        "When `fork()` executes, the child process receives a duplicate copy of the parent's address space. Modern systems optimize this using copy-on-write (COW).",
        "If the parent modifies a global variable after fork(), does it change in the child?",
        "flowchart TD\n  Parent[\"Parent Address Space (x=5)\"]\n  Parent -->|fork| Child[\"Child Address Space (x=5 Copy)\"]\n  Parent -->|Writes x=8| ParentNew[\"Parent (x=8)\"]\n  Child -->|Writes x=10| ChildNew[\"Child (x=10)\"]"
    ))
    raw_questions.append((
        "processes-threads", "Easy", "MCQ",
        "Which of the following elements is stored inside a Process Control Block (PCB)?",
        ["Process state, program counter, registers, memory pointers", "Web browser history, dynamic user databases, source code     ", "Local variables, function return values, function arguments   ", "Compiler optimization flags, network routing tables, socket IP"],
        "A",
        "The PCB stores the process ID, state, program counter (PC), CPU registers, memory management info (page tables), open file tables, and CPU scheduling info.",
        "What data is required by the OS kernel to stop a process and resume it later from the exact same instruction?",
        None
    ))
    raw_questions.append((
        "processes-threads", "Hard", "MCQ",
        "When implementing threads, why is a context switch between threads of the same process faster than a context switch between different processes?",
        ["No page table reload or TLB flush is required for thread switching", "Threads do not save CPU registers or program counter states        ", "Thread context switching is handled entirely by hardware timers     ", "Threads run in user space without triggering kernel mode interrupts "],
        "A",
        "Because threads of the same process share the address space, the kernel does not need to reload page table pointers (CR3 register on x86) or flush the TLB cache, saving massive overhead.",
        "Think about what memory mapping resources must change when switching processes vs switching threads.",
        None
    ))
    raw_questions.append((
        "processes-threads", "Medium", "MCQ",
        "A code trace contains the execution of the system call `execve()`. What happens to the process address space after `execve` returns successfully?<br>[EXAMINE DIAGRAM]",
        ["The old code, data, heap, and stack are replaced by the new program", "The new program runs in a separate child process context            ", "The heap is preserved while the stack and text are shared          ", "The CPU registers are preserved while the instruction cache is freed "],
        "A",
        "`execve` replaces the calling process's entire address space (code, data, heap, stack) with the executable image of the new program. The process ID (PID) remains the same.",
        "Does execve create a new process or reuse the existing one?",
        "graph TD\n  P1[\"Process Address Space (Old Program)\"] -->|execve| P2[\"Process Address Space (New Program loaded)\"]"
    ))
    raw_questions.append((
        "processes-threads", "Easy", "TrueFalse",
        "True or False: If a process terminates, all of its active threads are terminated automatically.",
        ["True", "False"],
        "A",
        "Because threads exist within the process environment, terminating the process reclaims its shared address space, destroying all member threads.",
        "Can a thread exist without a parent process?",
        None
    ))
    raw_questions.append((
        "processes-threads", "Medium", "MCQ",
        "Explain the term 'orphan process' in Unix-like operating systems.<br>[EXAMINE DIAGRAM]",
        ["A running process whose parent process has terminated", "A child process that has finished execution but has a PCB", "A process that has no open file descriptors in the table", "A thread that has completed its function execution early "],
        "A",
        "An orphan process is a process whose parent has terminated. Unix systems resolve this by re-parenting the orphan to the root system process (`init` or systemd, PID 1).",
        "Consider what happens to child processes when their parent is killed.",
        "graph TD\n  Parent[\"Parent Process (Killed)\"] -->|Orphans| Child[\"Child Process (PID 102)\"]\n  Init[\"Init Process (PID 1)\"] -->|Adopts| Child"
    ))
    raw_questions.append((
        "processes-threads", "Hard", "MCQ",
        "In a Socratic essay analyzing thread states, what state is unique to threads compared to processes in a user-level thread library?",
        ["A thread can be blocked while its parent process is running", "A thread has its own independent disk swap allocation space", "A thread can access privileged CPU instructions directly     ", "A thread can change its code segment at runtime dynamically "],
        "A",
        "In a ULT library, the library scheduler manages threads. A thread can be marked 'blocked' by the library, but if the OS scheduler doesn't know, it keeps running the parent process.",
        "Think about what the ULT library knows vs what the OS kernel knows.",
        None
    ))

    # 4. context-switching (10 questions)
    raw_questions.append((
        "context-switching", "Medium", "MCQ",
        "An essay exam asks you to map the sequence of events during a context switch from Process A to Process B. What is the correct order?<br>[EXAMINE DIAGRAM]",
        ["Save state A -> select B -> restore state B -> jump to B PC", "Select B -> restore state B -> save state A -> jump to B PC", "Jump to B PC -> save state A -> select B -> restore state B", "Save state A -> jump to B PC -> select B -> restore state B"],
        "A",
        "The context switch sequence must: 1. Save CPU registers and Program Counter of Process A into PCB A. 2. Select Process B using the scheduler. 3. Restore registers and PC from PCB B. 4. Jump to the restored PC of B.",
        "Why must you save the state of A before selecting B?",
        "sequenceDiagram\n  CPU->>PCB A: Save Registers and Program Counter\n  Note over CPU: Scheduler selects Process B\n  CPU->>PCB B: Restore Registers and PC\n  CPU->>Process B: Resume Execution"
    ))
    raw_questions.append((
        "context-switching", "Hard", "MCQ",
        "In a Socratic essay explaining context-switching overhead, why does changing the active page table pointer degrade CPU performance?",
        ["It invalidates the Translation Lookaside Buffer cache entries", "It forces the CPU to reinitialize all hardware interrupt vectors", "It deallocates the process heap space and frees variables   ", "It runs a compiler optimization check on the active program   "],
        "A",
        "When changing page table registers (like CR3 in x86), the TLB cache becomes invalid. The CPU must perform slow main-memory walks for subsequent memory accesses until the TLB is repopulated.",
        "Think about what the TLB caches and how changing memory mappings affects it.",
        None
    ))
    raw_questions.append((
        "context-switching", "Easy", "TrueFalse",
        "True or False: During a context switch, the CPU remains available to execute user program instructions.",
        ["True", "False"],
        "B",
        "Context switching is pure OS overhead. During the switch, no user instructions are executed; the CPU is dedicated to saving and restoring kernel states.",
        "Is context-switching considered productive work from the perspective of user applications?",
        None
    ))
    raw_questions.append((
        "context-switching", "Medium", "MCQ",
        "Which of the following events triggers a context switch in a time-sharing system?<br>[EXAMINE DIAGRAM]",
        ["A hardware timer interrupt indicating quantum expiration", "A local variable allocation on a thread stack frame   ", "A successful cache hit resolving an integer read      ", "A function call return inside user-space application  "],
        "A",
        "In time-sharing systems, a hardware timer triggers periodic interrupts. The interrupt handler calls the scheduler, which decides whether to context switch the running process due to quantum expiration.",
        "Recall what mechanism prevents a process from hogging the CPU forever in multitasking.",
        "graph TD\n  Timer[\"Hardware Timer Interrupt\"] --> IH[\"Interrupt Handler\"]\n  IH --> Sched[\"OS Scheduler\"]\n  Sched -->|Quantum Expired| CS[\"Trigger Context Switch\"]\n  Sched -->|Run Again| App[\"Resume Current Process\"]"
    ))
    raw_questions.append((
        "context-switching", "Easy", "MCQ",
        "Which registers must be saved in the PCB during a context switch to guarantee execution resumes exactly where it was suspended?",
        ["Program Counter (PC) and CPU Stack Pointer (SP)", "Accumulator (ACC) and instruction cache registers", "Frame buffer address and GPU context registers  ", "Virtual memory page size and disk swap sectors "],
        "A",
        "To resume, the CPU needs to know the next instruction address (Program Counter) and the active stack frame context (Stack Pointer), alongside general-purpose registers.",
        "What CPU registers track the current instruction and active stack?",
        None
    ))
    raw_questions.append((
        "context-switching", "Hard", "MCQ",
        "How does the dispatcher minimize context switch latency in hardware with multiple register sets?",
        ["It switches the active register set pointer instead of saving data", "It disables virtual memory address translations during execution    ", "It executes all processes concurrently in the same register file   ", "It compiles the user program directly to bare-metal hardware registers"],
        "A",
        "Some architectures have multiple hardware register sets. Instead of saving registers to memory, the dispatcher simply changes a pointer to reference a new register set, reducing switch overhead to near zero.",
        "Think about how hardware design can avoid copying data to and from memory.",
        None
    ))
    raw_questions.append((
        "context-switching", "Medium", "MCQ",
        "What is the difference between a mode switch and a context switch?<br>[EXAMINE DIAGRAM]",
        ["Mode switches change privileges; context switches change active processes", "Mode switches switch memory pages; context switches do not save state  ", "Context switches change mode bit; mode switches change page tables      ", "Context switches run in user space; mode switches run in kernel space   "],
        "A",
        "A mode switch transitions the CPU between User (1) and Kernel (0) mode within the same process. A context switch changes the active process running on the CPU, involving state saving and loading.",
        "Does a system call by a process always cause the OS to switch to another process?",
        "flowchart TD\n  A[\"Process A User Mode\"] -->|Syscall| B[\"Process A Kernel Mode (Mode Switch)\"]\n  B -->|Block / Schedule| C[\"Process B User Mode (Context Switch)\"]"
    ))
    raw_questions.append((
        "context-switching", "Easy", "TrueFalse",
        "True or False: System call entry always triggers a full process context switch.",
        ["True", "False"],
        "B",
        "System call entry causes a mode switch (User to Kernel). A context switch only occurs if the system call blocks (e.g. waiting for I/O) or is preempted by the scheduler.",
        "If a program writes to a file and the data is cached, does the OS immediately switch to another program?",
        None
    ))
    raw_questions.append((
        "context-switching", "Medium", "MCQ",
        "In context-switching, what is the role of the CPU instruction `iret` (interrupt return) on x86 architectures?<br>[EXAMINE DIAGRAM]",
        ["Restores saved flags, CS, and IP registers, switching mode to user", "Saves the program counter and stack pointer to the active PCB    ", "Allocates a new process stack frame and initializes local arrays   ", "Flushes the Translation Lookaside Buffer and reloads page tables  "],
        "A",
        "The `iret` instruction atomically pops the instruction pointer (IP), code segment selector (CS), and flags register, transitioning the CPU back to User Mode (privilege level 3) to resume the user program.",
        "Identify the instruction that reverses the effects of a hardware interrupt/trap.",
        "graph LR\n  Kernel[\"Kernel Mode (State Saved)\"] -->|iret Instruction| User[\"User Mode (IP, CS, Flags Restored)\"]"
    ))
    raw_questions.append((
        "context-switching", "Hard", "MCQ",
        "An essay question asks you to define 'thrashing' in the context of CPU scheduling. Which definition is correct?",
        ["The CPU spends more time context-switching than doing productive work", "The system memory is completely cleared due to power failure faults", "The hard disk write heads collide with platters causing hardware loss", "The compiler generates infinite loops that consume all available cores "],
        "A",
        "Thrashing in CPU scheduling occurs when context switches happen so frequently (often due to memory paging faults or high process concurrency) that the CPU spends almost all time switching, causing throughput to plummet.",
        "Think about what happens if you have too many processes competing and memory is full.",
        None
    ))

    # 5. process-scheduling (10 questions)
    raw_questions.append((
        "process-scheduling", "Medium", "MCQ",
        "An essay exam requires you to draw the Five-State Process Model. What event causes the transition from Running to Blocked?<br>[EXAMINE DIAGRAM]",
        ["An I/O request, system call, or synchronization event", "A scheduler preemption due to time slice expiration", "A process termination or exit system call invocation ", "A process creation fork and allocation of resources "],
        "A",
        "In the 5-state model, a process transitions from Running to Blocked when it requests a resource or event that is not immediately available (such as synchronous I/O or waiting on a semaphore).",
        "What causes a process to step off the CPU to wait for something external?",
        "stateDiagram-v2\n  New --> Ready\n  Ready --> Running : Dispatch\n  Running --> Ready : Time-out\n  Running --> Blocked : Event Wait\n  Blocked --> Ready : Event Occurs\n  Running --> Exit : Release"
    ))
    raw_questions.append((
        "process-scheduling", "Hard", "MCQ",
        "In a Socratic essay analyzing scheduling queues, what is the difference between CPU bound and I/O bound processes?",
        ["CPU bound processes utilize CPU bursts; I/O bound utilize I/O waits", "CPU bound processes run in kernel mode; I/O bound run in user mode   ", "CPU bound processes do not use RAM; I/O bound do not use registers   ", "CPU bound processes block on timers; I/O bound block on compilation  "],
        "A",
        "CPU-bound processes spend most time performing computations (long CPU bursts). I/O-bound processes spend most time waiting for I/O operations, performing short CPU bursts before blocking.",
        "Think about where the bottleneck lies for a scientific simulation vs a database server.",
        None
    ))
    raw_questions.append((
        "process-scheduling", "Easy", "TrueFalse",
        "True or False: The short-term scheduler (CPU scheduler) executes frequently to select the next process to run from the Ready Queue.",
        ["True", "False"],
        "A",
        "The short-term scheduler runs very frequently (e.g. every 10-100ms) to select the next process, demanding high execution speed to minimize system overhead.",
        "Does the CPU scheduler run once a minute or many times a second?",
        None
    ))
    raw_questions.append((
        "process-scheduling", "Medium", "MCQ",
        "Compare Round-Robin (RR) scheduling with Shortest Job First (SJF) scheduling.<br>[EXAMINE DIAGRAM]",
        ["RR guarantees fairness via time slices; SJF minimizes average wait time", "RR maximizes average wait times; SJF allocates execution slices randomly", "RR is non-preemptive; SJF is preemptive and schedules based on PIDs   ", "RR requires sorting process ids; SJF requires active hardware timers "],
        "A",
        "Round-Robin is preemptive, giving each process a time slice, ensuring fair CPU share. SJF selects the process with the shortest next CPU burst, which mathematically minimizes average wait time.",
        "Consider what RR is trying to solve (fairness/interactivity) vs what SJF optimizes.",
        "flowchart TD\n  subgraph Ready Queue\n    P1[\"Process 1 (Burst: 10ms)\"]\n    P2[\"Process 2 (Burst: 2ms)\"]\n  end\n  SJF[\"SJF Scheduler\"] -->|Run Shortest First| P2\n  RR[\"Round-Robin Scheduler\"] -->|Run Alternating slices| P1"
    ))
    raw_questions.append((
        "process-scheduling", "Easy", "MCQ",
        "What is the function of the dispatcher component in CPU scheduling?",
        ["Performs context switches, mode switches, and jumps to user code", "Selects which process from the disk queue should enter main memory ", "Sorts the ready queue based on remaining instruction execution times", "Creates unique process identifiers and allocates page tables in RAM  "],
        "A",
        "The dispatcher is the module that gives control of the CPU to the process selected by the short-term scheduler, handling state saving/restoring, mode changes, and PC jumps.",
        "What component takes the scheduler's decision and actually makes it happen on the CPU?",
        None
    ))
    raw_questions.append((
        "process-scheduling", "Hard", "MCQ",
        "In scheduling theory, what is 'convoy effect' and under what algorithm does it occur?",
        ["Short processes wait behind a long process in First-Come-First-Served", "Many threads of the same process block each other in Round Robin     ", "The CPU scheduler enters an infinite loop checking empty ready queues", "Virtual memory pages are continuously swapped out to the swap partition"],
        "A",
        "The convoy effect occurs in First-Come, First-Served (FCFS) scheduling when short processes must wait a long time for a single, long CPU-bound process to finish executing.",
        "Imagine a line of cars stuck behind a slow-moving tractor on a single-lane road.",
        None
    ))
    raw_questions.append((
        "process-scheduling", "Medium", "MCQ",
        "A process state model includes the 'Ready Suspend' state. What does this indicate?<br>[EXAMINE DIAGRAM]",
        ["The process is in the ready queue but swapped out to secondary disk", "The process has finished execution and is waiting to be reaped      ", "The process is currently blocked waiting for I/O to complete in RAM  ", "The process has been terminated due to a segmentation fault exception"],
        "A",
        "The 'Ready, Suspend' state indicates the process is ready to run, but its address space has been swapped out of main memory to disk (secondary storage) by the medium-term scheduler.",
        "Look at the transitions involving main memory swapping.",
        "stateDiagram-v2\n  ReadySuspend --> Ready : Swap In (Bring to Memory)\n  Ready --> ReadySuspend : Swap Out (Swap to Disk)"
    ))
    raw_questions.append((
        "process-scheduling", "Easy", "TrueFalse",
        "True or False: Preemptive scheduling allows the OS to interrupt a running process even if it has not requested I/O or terminated.",
        ["True", "False"],
        "A",
        "Preemptive scheduling allows the kernel to stop a running process (e.g. timer interrupt or priority change) to allocate CPU to another process.",
        "Does a preemptive scheduler have to wait for the user program to call yield() or block?",
        None
    ))
    raw_questions.append((
        "process-scheduling", "Medium", "MCQ",
        "What is the priority inversion problem in CPU scheduling?<br>[EXAMINE DIAGRAM]",
        ["A low-priority process holding a lock blocks a high-priority process", "The CPU scheduler swaps priority values of parent and child processes", "An I/O interrupt preempts all running user space processes randomly  ", "A high-priority process consumes all time slices in a loop cycle   "],
        "A",
        "Priority inversion occurs when a low-priority process holds a lock needed by a high-priority process. If a medium-priority process preempts the low-priority process, the high-priority process is indirectly blocked.",
        "Think about three processes (High, Medium, Low) and a shared resource lock.",
        "graph TD\n  H[\"High Priority Process\"] -->|Waits For Lock| Lock[\"Lock held by Low\"]\n  M[\"Medium Priority\"] -->|Preempts| L[\"Low Priority Process\"]\n  Note over M: Indirectly blocks High process!"
    ))
    raw_questions.append((
        "process-scheduling", "Hard", "MCQ",
        "Explain how the Multi-Level Feedback Queue (MLFQ) scheduler prevents starvation while optimizing interactive response times.",
        ["It dynamically adjusts process priority based on CPU burst history  ", "It runs all processes in a single FCFS queue with infinite time slices", "It assigns static priorities based on process execution identifiers    ", "It executes only CPU-bound processes during system startup phases     "],
        "A",
        "MLFQ dynamically adjusts process priority: if a process uses its full time slice, it is demoted to a lower queue (penalizing CPU-bound processes). If it blocks on I/O, it remains or is promoted, keeping interactive processes fast.",
        "How does the scheduler distinguish between interactive tasks and batch computation tasks automatically?",
        None
    ))

    # 6. time-sharing-multitasking (10 questions)
    raw_questions.append((
        "time-sharing-multitasking", "Medium", "MCQ",
        "An essay question asks you to explain time-slicing. What is the role of the hardware timer in this mechanism?<br>[EXAMINE DIAGRAM]",
        ["It periodically interrupts the CPU, forcing scheduler execution", "It measures the exact physical speed of memory address transfers", "It calculates the total running duration of the operating system", "It switches the CPU register file to user mode automatically   "],
        "A",
        "The hardware timer counts down and generates a periodic interrupt. This interrupt suspends the running process, switches the CPU to mode 0, and invokes the OS scheduler to enforce the time slice.",
        "What guarantees the operating system can regain control of the CPU when a user program runs an infinite loop?",
        "sequenceDiagram\n  Process->>Process: Run User Code\n  Timer->>CPU: Interrupt! (Time slice end)\n  CPU->>OS: Switch to Kernel Mode (Scheduler)"
    ))
    raw_questions.append((
        "time-sharing-multitasking", "Hard", "MCQ",
        "Trace a multitasking system executing processes A and B using time-slicing. If context switch overhead is 2ms and the quantum is 18ms, what percentage of CPU time is wasted on overhead?",
        ["10%                                 ", "20%                                 ", "5%                                  ", "50%                                 "],
        "A",
        "For each quantum run (18ms), there is a context switch (2ms). Total cycle = 20ms. Overhead percentage = (2ms / 20ms) * 100 = 10%.",
        "Calculate the fraction of the total scheduling cycle spent on overhead.",
        None
    ))
    raw_questions.append((
        "time-sharing-multitasking", "Easy", "TrueFalse",
        "True or False: Multitasking allows a single-processor computer to execute multiple processes in true, physical hardware parallelism simultaneously.",
        ["True", "False"],
        "B",
        "A single-processor machine can only run one instruction at a time. It achieves the illusion of concurrency by switching between processes rapidly (interleaving), not true physical parallelism.",
        "Can a single CPU core execute two different instructions at the exact same physical instant?",
        None
    ))
    raw_questions.append((
        "time-sharing-multitasking", "Medium", "MCQ",
        "Which of the following is a key advantage of Time-Sharing systems over early Batch systems?<br>[EXAMINE DIAGRAM]",
        ["Provides direct, interactive response times to multiple users", "Eliminates the requirement for main memory page allocations  ", "Reduces CPU context-switching overhead to exactly zero      ", "Allows programs to bypass the operating system kernel completely"],
        "A",
        "Batch systems ran programs in sequence without user interaction. Time-sharing multiplexes the CPU rapidly among active users, providing responsive, interactive environments.",
        "Think about what timesharing introduced for terminal users compared to submission card decks.",
        "flowchart LR\n  Batch[\"Batch: Job 1 -> Job 2 -> Job 3 (No Interaction)\"]\n  TimeShare[\"Time-Sharing: Rotate Job 1, 2, 3 (Interactive terminal feedback)\"]"
    ))
    raw_questions.append((
        "time-sharing-multitasking", "Easy", "MCQ",
        "What is the typical duration of a modern operating system scheduling timeslice (quantum)?",
        ["10 to 100 milliseconds               ", "10 to 100 microseconds               ", "1 to 2 minutes                       ", "1 to 10 nanoseconds                  "],
        "A",
        "A typical quantum ranges from 10 to 100 milliseconds. This is short enough to appear instantaneous to humans, yet long enough to keep context switch overhead relatively low.",
        "Select the time scale that is imperceptible to humans but significant for CPU executions.",
        None
    ))
    raw_questions.append((
        "time-sharing-multitasking", "Hard", "MCQ",
        "In a multitasking system, what happens if the time quantum is set to be extremely small (e.g., 1 microsecond)?",
        ["Context switch overhead will dominate, degrading system throughput", "The system will achieve true physical hardware parallelism on one CPU", "Process execution will run faster than bare-metal execution speeds", "The CPU scheduler will automatically disable all hardware interrupts"],
        "A",
        "If the quantum is too small, the time spent context-switching (typically microseconds to milliseconds) will exceed the time spent executing user code, causing the system to thrash.",
        "Consider what fraction of time the CPU spends saving/restoring states vs running user code as the quantum shrinks.",
        None
    ))
    raw_questions.append((
        "time-sharing-multitasking", "Medium", "MCQ",
        "How does timesharing achieve multitasking for a single user?<br>[EXAMINE DIAGRAM]",
        ["By allocating CPU time slices to multiple programs owned by the user", "By running the user programs in parallel on separate physical disks", "By sharing the stack pointer registers directly across applications   ", "By compiling all user applications into a single executable binary  "],
        "A",
        "On single-user machines, timesharing allows executing multiple user programs (e.g. browser, music player, editor) concurrently by rapidly swapping the CPU between them.",
        "Think about how your operating system runs Spotify and Word at the same time.",
        "graph TD\n  CPU[\"Single CPU Core\"]\n  CPU -->|Slice 1| Word[\"Word Processor\"]\n  CPU -->|Slice 2| Music[\"Music Player\"]\n  CPU -->|Slice 3| Chrome[\"Web Browser\"]\n  Word -.->|Rotate| Music\n  Music -.->|Rotate| Chrome"
    ))
    raw_questions.append((
        "time-sharing-multitasking", "Easy", "TrueFalse",
        "True or False: If the timeslice quantum is set to be infinitely large, Round-Robin scheduling behaves exactly like First-Come-First-Served (FCFS) scheduling.",
        ["True", "False"],
        "A",
        "If the quantum is larger than the longest process burst, no process will be preempted by the timer. It behaves exactly like non-preemptive FCFS.",
        "If the scheduler timer never fires to preempt a process, what determines execution order?",
        None
    ))
    raw_questions.append((
        "time-sharing-multitasking", "Medium", "MCQ",
        "Explain the illusion of parallelism in time-sharing systems.<br>[EXAMINE DIAGRAM]",
        ["Rapid context switching makes serial execution appear concurrent ", "Virtual memory mapping executes instructions on the hard disk   ", "Multiple CPU cores are simulated within a single register file  ", "The operating system duplicates instruction execution to memory "],
        "A",
        "Because context switches occur frequently (every 10-50ms), human users cannot perceive the interleaving, creating the illusion that all programs run in parallel.",
        "Think about how video frames (24-60 frames per second) create the illusion of smooth motion.",
        "graph LR\n  P1[\"Run P1 (10ms)\"] --> P2[\"Run P2 (10ms)\"]\n  P2 --> P3[\"Run P3 (10ms)\"]\n  P3 --> P1\n  Note over P1,P3: Swaps faster than human perception (Illusion of Parallelism)"
    ))
    raw_questions.append((
        "time-sharing-multitasking", "Hard", "MCQ",
        "In a Socratic essay analyzing interactive systems, how does timesharing affect the design of memory management?",
        ["It requires processes to coexist in memory to enable fast switches", "It mandates storing all process address spaces on secondary storage ", "It forces the OS to allocate a single, shared stack for all users   ", "It requires disabling page translation mechanisms during interrupts  "],
        "A",
        "To switch between processes rapidly, multiple processes must be loaded in main memory simultaneously. This requirement drove the development of memory protection and virtual memory.",
        "If you had to swap the entire memory to disk on every context switch, would timesharing be fast enough?",
        None
    ))

    # 7. virtual-memory-addressing (10 questions)
    raw_questions.append((
        "virtual-memory-addressing", "Medium", "MCQ",
        "An essay question asks you to explain virtual memory translation. How does the MMU translate a virtual address to a physical address?<br>[EXAMINE DIAGRAM]",
        ["Splits address into VPN and Offset -> maps VPN to PFN via page table", "Adds the virtual page number directly to the physical limit register  ", "Performs a binary search on the disk sector mapping lookup index   ", "Requests the OS scheduler to allocate a new physical stack segment  "],
        "A",
        "A virtual address is split into a Virtual Page Number (VPN) and an Offset. The MMU uses the VPN to lookup the Physical Frame Number (PFN) in the Page Table, then combines PFN with the Offset.",
        "Remember that the page size determines the boundary between the page number and the offset.",
        "graph TD\n  VA[\"Virtual Address: [VPN] [Offset]\"] --> MMU[\"MMU translation\"]\n  MMU -->|Lookup page table| PT[\"Page Table: VPN -> PFN\"]\n  PT --> PA[\"Physical Address: [PFN] [Offset]\"]"
    ))
    raw_questions.append((
        "virtual-memory-addressing", "Hard", "MCQ",
        "Trace address translation: A system has 32-bit virtual addresses and a page size of 4KB ($$2^{12}$$ bytes). What are the sizes of the VPN and Offset fields?",
        ["VPN: 20 bits, Offset: 12 bits       ", "VPN: 12 bits, Offset: 20 bits       ", "VPN: 16 bits, Offset: 16 bits       ", "VPN: 24 bits, Offset: 8 bits        "],
        "A",
        "Page size of 4KB requires 12 bits to address all bytes within the page (offset = 12 bits). The remaining bits are for the VPN: 32 - 12 = 20 bits.",
        "Calculate page offset bits as $$\\log_2(\\text{page size in bytes})$$. VPN bits is total address bits minus offset bits.",
        None
    ))
    raw_questions.append((
        "virtual-memory-addressing", "Easy", "TrueFalse",
        "True or False: The page table is stored in the CPU registers to ensure immediate, zero-latency lookup times.",
        ["True", "False"],
        "B",
        "Page tables are too large to fit in CPU registers. They are stored in physical RAM. High-speed lookups are cached in the hardware TLB (CPU).",
        "How many entries would a page table have for a 32-bit address space, and can that fit in registers?",
        None
    ))
    raw_questions.append((
        "virtual-memory-addressing", "Medium", "MCQ",
        "What is a 'page fault' and how does the OS handle it?<br>[EXAMINE DIAGRAM]",
        ["MMU access to page marked not-present -> trap -> OS loads page from disk", "A physical memory chip hardware failure -> system halts immediately   ", "A CPU scheduling error caused by quantum time slice expiration       ", "An invalid format string code execution bug in user-space code      "],
        "A",
        "A page fault occurs when the MMU attempts to translate an address, but the page table entry indicates the page is not in RAM. This triggers a trap, causing the OS to fetch the page from disk.",
        "What happens when a program accesses memory that is swapped out?",
        "flowchart TD\n  App[\"App accesses page\"] -->|Translate| MMU[\"MMU detects Present Bit = 0\"]\n  MMU -->|Trap| OS[\"Page Fault Handler\"]\n  OS -->|Read Disk| Disk[\"Fetch page from swap\"]\n  Disk --> RAM[\"Load page to RAM frame\"]\n  RAM --> Resume[\"Set Present Bit = 1, Resume App\"]"
    ))
    raw_questions.append((
        "virtual-memory-addressing", "Easy", "MCQ",
        "What is the purpose of the Translation Lookaside Buffer (TLB) in virtual memory?",
        ["To cache recent virtual-to-physical address translations in hardware", "To act as a temporary buffer for slow peripheral character streams ", "To store process control blocks during context switching scheduling  ", "To validate C program structure declarations and allocate stack memory"],
        "A",
        "The TLB is a small, associative cache on the CPU that stores recent virtual-to-physical page mappings, avoiding the double-memory reference penalty of page table lookups.",
        "Think of a cache for address translation to avoid walking the page table in RAM on every read/write.",
        None
    ))
    raw_questions.append((
        "virtual-memory-addressing", "Hard", "MCQ",
        "In a multi-level page table scheme, why does the architecture reduce memory consumption compared to a single-level flat page table?",
        ["It avoids allocating page tables for unmapped regions of address space", "It compresses page table entry records using Huffman encoding in RAM    ", "It stores page table entries directly inside the TLB cache hardware   ", "It shares a single page table directory across all active processes   "],
        "A",
        "Flat page tables must have entries for the entire address space. Multi-level page tables only allocate page tables for regions of the address space that are actively mapped, saving massive memory for sparse processes.",
        "Think about what happens to empty/unused sections of a process's 4GB address space.",
        None
    ))
    raw_questions.append((
        "virtual-memory-addressing", "Medium", "MCQ",
        "Explain the role of the 'dirty bit' (modify bit) in a page table entry.<br>[EXAMINE DIAGRAM]",
        ["Indicates if a page has been written to, avoiding redundant disk writes", "Flags whether a memory address belongs to user mode or kernel mode   ", "Determines if a page is currently cached in the CPU L1 cache space  ", "Checks if a process has execution privileges on the memory block    "],
        "A",
        "The dirty bit is set by hardware when a page is written to. When the page is evicted, the OS checks this bit: if set, it writes it to disk; if clean, it discards it, avoiding slow write operations.",
        "What happens if the page in memory is identical to the copy on disk when we need to reclaim the frame?",
        "flowchart TD\n  Evict[\"Reclaim Page Frame\"] -->|Check Dirty Bit| Check{Dirty Bit == 1?}\n  Check -->|Yes| Write[\"Write page back to disk\"]\n  Check -->|No| Discard[\"Discard page frame (instant)\"]"
    ))
    raw_questions.append((
        "virtual-memory-addressing", "Easy", "TrueFalse",
        "True or False: Virtual memory addresses allow two different running processes to have identical virtual memory addresses that map to different physical memory frames.",
        ["True", "False"],
        "A",
        "Yes, each process has its own page table. Address `0x1000` in Process A maps to physical frame X, while `0x1000` in Process B maps to physical frame Y, guaranteeing isolation.",
        "If process A writes to virtual address 0x1000, does it overwrite process B's memory at 0x1000?",
        None
    ))
    raw_questions.append((
        "virtual-memory-addressing", "Medium", "MCQ",
        "What is 'memory segmentation' compared to 'memory paging'?<br>[EXAMINE DIAGRAM]",
        ["Segmentation uses logical segments; paging divides memory into fixed pages", "Segmentation divides RAM into equal slots; paging divides code by functions", "Segmentation requires hardware timers; paging requires virtual disks    ", "Segmentation executes in kernel space; paging executes in user space    "],
        "A",
        "Segmentation divides the address space into variable-sized logical segments (code, data, stack) representing program units. Paging divides the address space into fixed-size pages, ignoring logical divisions.",
        "Compare variable-sized logical blocks vs fixed-sized physical blocks.",
        "graph TD\n  Seg[\"Segmentation: Variable logical blocks (Code, Stack, Heap)\"]\n  Page[\"Paging: Uniform fixed physical blocks (4KB Pages)\"]"
    ))
    raw_questions.append((
        "virtual-memory-addressing", "Hard", "MCQ",
        "An essay question asks you to describe 'page table walking'. What does this process refer to?",
        ["The MMU traversing multi-level page tables in memory to resolve a miss", "The OS scheduler reordering the list of ready processes on queue timers", "The execution of C buffer checks to prevent format string bugs in memory", "The hardware transfer of dirty pages from main RAM to secondary disk  "],
        "A",
        "When a TLB miss occurs, the MMU (or OS, depending on architecture) must walk the hierarchical page table structures (directory, table, offset) in RAM to resolve the translation, which is called a page table walk.",
        "What does the hardware do when it cannot find a virtual address mapping in the TLB?",
        None
    ))

    # 8. caching (10 questions)
    raw_questions.append((
        "caching", "Medium", "MCQ",
        "An essay exam asks you to detail the storage hierarchy. Which sequence organizes memory from fastest/most-expensive to slowest/cheapest?<br>[EXAMINE DIAGRAM]",
        ["Registers -> L1 Cache -> Main Memory -> Magnetic Disk", "Magnetic Disk -> Main Memory -> L1 Cache -> Registers", "L1 Cache -> Registers -> Main Memory -> Magnetic Disk", "Registers -> Main Memory -> L1 Cache -> Magnetic Disk"],
        "A",
        "The standard memory hierarchy is: CPU Registers (fastest, smallest, most expensive) -> L1/L2/L3 Caches -> Main Memory (RAM) -> Secondary Storage (Magnetic Disks / SSDs).",
        "Rank memory types based on proximity to the CPU cores.",
        "flowchart TD\n  R[\"CPU Registers: < 1ns, Bytes\"]\n  C[\"CPU Caches (L1/L2/L3): 1-10ns, Megabytes\"]\n  M[\"Main Memory (RAM): 50-100ns, Gigabytes\"]\n  D[\"Secondary Storage (SSD/Disk): Milliseconds, Terabytes\"]\n  R --> C\n  C --> M\n  M --> D"
    ))
    raw_questions.append((
        "caching", "Hard", "MCQ",
        "In a C code optimization trace, a loop accesses a 2D array row-by-row vs column-by-column. Why is row-major access faster in C?",
        ["It leverages spatial locality by loading adjacent elements into cache", "It avoids triggering virtual memory page table directory allocations  ", "It runs instructions directly on CPU registers without memory reads  ", "It completely bypasses CPU L1 cache, writing directly to disk    "],
        "A",
        "C stores 2D arrays in row-major order (consecutive memory). Accessing row-by-row utilizes spatial locality: loading one element pulls adjacent elements into the same cache line, causing subsequent hits.",
        "Think about how memory layout matches array index stepping in C.",
        None
    ))
    raw_questions.append((
        "caching", "Easy", "TrueFalse",
        "True or False: Caching relies on the assumption that program memory access patterns are entirely random.",
        ["True", "False"],
        "B",
        "Caching relies on the Principle of Locality (temporal and spatial). Programs access the same or adjacent memory locations frequently, which is the opposite of random.",
        "What properties of program loops and array processing make caching effective?",
        None
    ))
    raw_questions.append((
        "caching", "Medium", "MCQ",
        "Describe the 'write-through' cache policy compared to 'write-back'.<br>[EXAMINE DIAGRAM]",
        ["Write-through updates memory immediately; write-back defers until eviction", "Write-through bypasses cache; write-back disables main memory updates   ", "Write-through requires hardware timers; write-back requires disk drives ", "Write-through runs in user space; write-back runs in kernel mode space  "],
        "A",
        "Write-through updates both the cache block and main memory simultaneously on a write. Write-back only updates the cache block; the update to main memory is deferred until the block is evicted (using a dirty bit).",
        "Consider which method reduces memory bus traffic at the expense of temporary inconsistency.",
        "flowchart TD\n  WT[\"Write-Through: CPU -> Cache AND RAM (Simultaneous)\"]\n  WB[\"Write-Back: CPU -> Cache (Set Dirty). RAM updated only on Eviction\"]"
    ))
    raw_questions.append((
        "caching", "Easy", "MCQ",
        "What is the term for loading a block of data from memory into the cache before it is requested, based on access predictions?",
        ["Prefetching                          ", "Swapping                            ", "Spooling                            ", "Paging                              "],
        "A",
        "Prefetching is a hardware or software technique that loads data or instructions into the cache before the CPU requests them, utilizing spatial or sequential access patterns.",
        "Look for the term indicating fetching in advance.",
        None
    ))
    raw_questions.append((
        "caching", "Hard", "MCQ",
        "Trace execution: A cache has a hit time of 1ns and a miss penalty of 100ns. If the hit ratio is 95%, what is the Effective Access Time (EAT)?",
        ["6ns                                 ", "5ns                                 ", "50ns                                ", "95ns                                "],
        "A",
        "$$EAT = Hit Time + (1 - Hit Ratio) \\times Miss Penalty = 1ns + (0.05) \\times 100ns = 1 + 5 = 6ns$$.",
        "Use the formula: $$EAT = Hit Time + Miss Rate \\times Miss Penalty$$.",
        None
    ))
    raw_questions.append((
        "caching", "Medium", "MCQ",
        "Explain 'cache coherence' in multi-processor system architectures.<br>[EXAMINE DIAGRAM]",
        ["Ensures all processors read the same data value for a shared address", "Maintains identical instruction execution cycles across all CPU cores", "Synchronizes hardware timers of processors to avoid quantum drifts   ", "Allocates separate page table regions for individual execution threads"],
        "A",
        "In multiprocessor systems, each CPU has its own local cache. Cache coherence protocols (like MESI) ensure that if one CPU modifies a shared variable, other caches are updated or invalidated.",
        "What happens if CPU 1 modifies variable 'x' in its L1 cache while CPU 2 reads 'x' from its own L1 cache?",
        "flowchart TD\n  CPU1[\"CPU 1 Cache (x=10)\"] -->|Snooping Protocol| Bus[\"Shared Bus\"]\n  CPU2[\"CPU 2 Cache (x=5)\"] -->|Invalidate x| Bus\n  Bus -->|Write-back| RAM[\"Main Memory (x=10)\"]"
    ))
    raw_questions.append((
        "caching", "Easy", "TrueFalse",
        "True or False: Cache size expansion yields linear performance improvements without diminishing returns.",
        ["True", "False"],
        "B",
        "Cache size expansion has diminishing returns. Larger caches have higher search latencies and higher cost, and hit rate increases level off as the working set size is satisfied.",
        "Do you get the same speedup doubling cache size from 16MB to 32MB as you did from 1MB to 2MB?",
        None
    ))
    raw_questions.append((
        "caching", "Medium", "MCQ",
        "Which cache replacement policy evicts the block that has not been accessed for the longest duration?<br>[EXAMINE DIAGRAM]",
        ["Least Recently Used (LRU)", "First-In, First-Out (FIFO)", "Least Frequently Used (LFU)", "Random Replacement (RR)   "],
        "A",
        "LRU (Least Recently Used) tracks access history and evicts the block that has not been accessed for the longest time, relying on the principle of temporal locality.",
        "Think about selecting the block with the oldest reference timestamp.",
        "flowchart TD\n  Queue[\"Access Order: Block A (oldest) -> Block B -> Block C (newest)\"]\n  LRU[\"LRU Replacement\"] -->|Evict Oldest| BlockA[\"Block A Evicted\"]"
    ))
    raw_questions.append((
        "caching", "Hard", "MCQ",
        "An essay question asks you to explain 'cache line bouncing'. What is the root cause in multithreaded systems?",
        ["Multiple processors write to variables in the same cache line ", "The cache memory hardware fails to synchronize page table addresses", "The program switches instruction loops between user and kernel modes", "A thread attempts to allocate heap memory without lock ownership   "],
        "A",
        "Cache line bouncing (false sharing) occurs when threads on different processors write to independent variables that happen to share the same cache line, causing the line to continuously bounce between caches.",
        "Consider what happens when one CPU invalidates another CPU's cache line due to a write on an adjacent variable.",
        None
    ))

    # 9. spooling (10 questions)
    raw_questions.append((
        "spooling", "Medium", "MCQ",
        "An essay exam asks you to explain why Spooling is needed. Which statement describes the problem Spooling solves?<br>[EXAMINE DIAGRAM]",
        ["Prevents fast CPUs from stalling on slow physical I/O devices", "Allows user programs to access kernel mode instructions directly", "Automatically synchronizes shared variables to prevent races   ", "Translates virtual addresses to physical page frame layouts    "],
        "A",
        "Peripherals like printers are slow compared to the CPU. Without spooling, a process writing to a printer would block. Spooling writes data to a disk buffer, allowing the process to continue immediately.",
        "Think about what happens to a program's execution speed if it has to wait directly for a mechanical printer arm.",
        "flowchart LR\n  App[\"Process writes data\"] -->|High Speed| Disk[\"Disk Spooler Queue\"]\n  Disk -->|Slow Speed| Print[\"Printer Device Manager\"]"
    ))
    raw_questions.append((
        "spooling", "Hard", "MCQ",
        "In a Socratic essay, a student asks: 'What is the difference between Buffering and Spooling?' Which answer is correct?",
        ["Buffering overlaps I/O of one job; spooling overlaps I/O of many jobs", "Buffering runs in kernel space; spooling runs in user space library ", "Buffering requires magnetic disks; spooling requires CPU registers  ", "Buffering is non-preemptive; spooling is preemptive scheduling     "],
        "A",
        "Buffering uses a temporary memory area to hold single-job I/O streams. Spooling utilizes secondary storage (disk) to stage execution queues for multiple concurrent jobs (e.g. print jobs from multiple processes).",
        "Compare a temporary storage buffer in RAM for a keyboard stream vs a queue of print documents stored on disk.",
        None
    ))
    raw_questions.append((
        "spooling", "Easy", "TrueFalse",
        "True or False: Spooling stands for Simultaneous Peripheral Operations On-Line.",
        ["True", "False"],
        "A",
        "Spooling is indeed an acronym for Simultaneous Peripheral Operations On-Line, representing concurrent staging of peripheral data.",
        "Recall the standard acronym definition of Spooling.",
        None
    ))
    raw_questions.append((
        "spooling", "Medium", "MCQ",
        "How is spooling implemented for a printer in a modern operating system?<br>[EXAMINE DIAGRAM]",
        ["Print jobs are queued on disk; a daemon prints them one by one", "The OS allocates a dedicated CPU core to manage the print heads  ", "Each process takes turns holding a physical lock on printer ports", "The printer maps its memory directly to the user application stack"],
        "A",
        "When a document is printed, the OS saves the print output as a file on disk. A background system daemon (like cupsd or spoolsv.exe) reads files from the spool directory and sends them to the printer sequentially.",
        "Consider how the operating system manages multiple programs printing at the same time without interleaving their pages.",
        "flowchart TD\n  P1[\"Process 1\"] -->|Write Print Job| Queue[\"Disk Spool Directory\"]\n  P2[\"Process 2\"] -->|Write Print Job| Queue\n  Queue -->|FIFO| Daemon[\"Print Spooler Daemon\"]\n  Daemon -->|Print Page| Printer[\"Printer hardware\"]"
    ))
    raw_questions.append((
        "spooling", "Easy", "MCQ",
        "Which of the following devices traditionally utilizes spooling in system design?",
        ["A paper printer or paper card reader", "A high-speed CPU register file    ", "An instruction translation TLB cache", "A virtual memory page table directory"],
        "A",
        "Printers, card readers, and other slow, character-oriented sequential devices are the primary candidates for spooling systems.",
        "Identify the slowest peripheral device from the list.",
        None
    ))
    raw_questions.append((
        "spooling", "Hard", "MCQ",
        "In a spooling system, what happens if the spool directory disk space becomes completely full?",
        ["Processes attempting to write output will block or return errors", "The system will automatically switch to true physical parallelism  ", "The CPU scheduler will double the timeslice quantum of processes", "The kernel will disable memory paging and dump stack registers    "],
        "A",
        "If the spool disk is full, the system cannot save new print jobs. Processes attempting to write to the spooler will either block waiting for space or fail with a 'no space left on device' error.",
        "Consider what happens to a file-writing operation when there is no storage space left.",
        None
    ))
    raw_questions.append((
        "spooling", "Medium", "MCQ",
        "Why is spooling considered a precursor to multiprogramming operating systems?<br>[EXAMINE DIAGRAM]",
        ["It enabled overlapping CPU operations with slow card reader I/O", "It eliminated the requirement for physical CPU scheduling timers   ", "It mapped virtual address pages directly to CPU cache memory blocks", "It allowed user applications to run privileged instructions directly"],
        "A",
        "In early batch systems, spooling allowed reading the next card deck to disk while the CPU ran the current job. This concurrent overlap of CPU and I/O laid the foundation for running multiple jobs in parallel.",
        "Think about concurrent operations: how spooling allows the CPU to stay busy while cards are read.",
        "flowchart LR\n  Card[\"Card Reader\"] -->|Read Job N+1| Disk[\"Disk Spooler\"]\n  CPU[\"CPU Core\"] -->|Execute Job N| RAM[\"Memory RAM\"]\n  Disk -.->|Overlap| CPU"
    ))
    raw_questions.append((
        "spooling", "Easy", "TrueFalse",
        "True or False: Buffering and Spooling are identical techniques and can be used interchangeably in system architecture discussions.",
        ["True", "False"],
        "B",
        "They are distinct. Buffering handles single I/O streams in volatile RAM. Spooling manages concurrent queue pipelines for peripherals using non-volatile disk storage.",
        "Are temporary stream memory slots in RAM the same as a structured job directory queue on a hard disk?",
        None
    ))
    raw_questions.append((
        "spooling", "Medium", "MCQ",
        "What is the role of a spooler daemon in Unix-like systems?<br>[EXAMINE DIAGRAM]",
        ["A background process executing queued tasks from the spool disk", "A kernel routine handling virtual memory page table directories ", "A hardware scheduler multiplexing process stack registers on timers", "A compiler utility verifying structure definitions for C programs  "],
        "A",
        "A spooler daemon is a persistent background service that monitors the spool queue directory and coordinates sending files to the target peripheral when it is ready.",
        "What process is responsible for fetching files from the spooler queue and sending them to the hardware?",
        "graph LR\n  Queue[\"Spool Queue (Disk)\"] -->|Monitors| Daemon[\"Spooler Daemon (Background)\"]\n  Daemon -->|Controls| HW[\"Peripheral Device Driver\"]"
    ))
    raw_questions.append((
        "spooling", "Hard", "MCQ",
        "An essay question asks: 'If a printer has no spooling system and two users print documents concurrently, what is the result?'",
        ["Pages from both documents will interleave, ruining the print output", "The printer will automatically select the higher-priority user     ", "The printer will replicate its physical components to print both    ", "The operating system kernel will crash with a monitor fault trap    "],
        "A",
        "Without a spooler to serialize access, data streams from both applications would reach the printer concurrently, resulting in pages containing mixed, corrupted text from both documents.",
        "Think about what happens to two parallel streams of characters arriving at a single character-printing device.",
        None
    ))

    # 10. user-kernel-threads (10 questions)
    raw_questions.append((
        "user-kernel-threads", "Medium", "MCQ",
        "An essay exam asks you to compare ULT and KLT. If a thread executing in a User-Level Thread library performs a blocking system call, what happens to the parent process?<br>[EXAMINE DIAGRAM]",
        ["The entire process blocks because the kernel is unaware of ULTs", "The kernel context-switches only the blocking thread to another core", "The ULT library immediately spawns a new process to resume work   ", "The CPU scheduler switches the process to ready-suspend on disk   "],
        "A",
        "Because the OS kernel only schedules the process and is unaware of individual ULTs, if one ULT invokes a blocking system call (e.g. read), the kernel blocks the entire process, suspending all other ULTs.",
        "Does the kernel scheduling table have individual entries for user-level threads in a many-to-one model?",
        "flowchart TD\n  subgraph User Space\n    Process[\"Process (ULT Library)\"]\n    T1[\"Thread 1 (Calls Read)\"]\n    T2[\"Thread 2 (Ready)\"]\n  end\n  subgraph Kernel Space\n    K[\"Kernel Thread / Process Entry\"]\n  end\n  T1 -->|Blocks| K\n  K -->|Blocks entire process| CPU[\"CPU Core\"]"
    ))
    raw_questions.append((
        "user-kernel-threads", "Hard", "MCQ",
        "In a Socratic essay analyzing thread mapping models, what is the principal benefit of a One-to-One (KLT) model over a Many-to-One (ULT) model?",
        ["It allows other threads to run when one thread blocks on I/O ", "It avoids the overhead of kernel-mode transition interrupts  ", "It does not require allocating thread stacks in process memory", "It guarantees that thread execution bypasses CPU cache levels  "],
        "A",
        "In the One-to-One model, each thread is a separate kernel schedulable entity. If one thread blocks on I/O, the kernel can schedule another thread of the same process to run, achieving true concurrency.",
        "Consider what the kernel schedules: does it schedule processes or individual threads in a KLT model?",
        None
    ))
    raw_questions.append((
        "user-kernel-threads", "Easy", "TrueFalse",
        "True or False: User-Level Threads (ULT) require system call traps to perform thread context switches within a process.",
        ["True", "False"],
        "B",
        "ULT context switches are handled entirely in user space by the library scheduler (saving/restoring registers to library structures), requiring zero system call or mode switch overhead.",
        "Does a user-space thread library need to invoke the operating system to switch registers between two of its own threads?",
        None
    ))
    raw_questions.append((
        "user-kernel-threads", "Medium", "MCQ",
        "Illustrate the Many-to-Many thread mapping model. What is its structural purpose?<br>[EXAMINE DIAGRAM]",
        ["Maps N user threads to M kernel threads, balancing cost and blocking", "Maps a single user thread to multiple physical processors in parallel", "Shares a single execution stack across multiple processes on disk    ", "Allows processes to run privileged instructions without kernel mode   "],
        "A",
        "The Many-to-Many model multiplexes many user-level threads to a smaller or equal number of kernel-level threads. It allows developers to create many threads while avoiding blocking issues and KLT count limits.",
        "Think about combining the lightweight nature of ULTs with the non-blocking execution of KLTs.",
        "flowchart TD\n  subgraph User Space\n    U1[\"User Thread 1\"]\n    U2[\"User Thread 2\"]\n    U3[\"User Thread 3\"]\n  end\n  subgraph Kernel Space\n    K1[\"Kernel Thread 1\"]\n    K2[\"Kernel Thread 2\"]\n  end\n  U1 & U2 & U3 --> K1 & K2"
    ))
    raw_questions.append((
        "user-kernel-threads", "Easy", "MCQ",
        "Which of the following is a primary disadvantage of Kernel-Level Threads (KLT)?",
        ["Thread creation and context switching require kernel mode overhead", "If a KLT blocks, the entire process is suspended by the kernel", "KLTs cannot execute concurrently on multiprocessor architectures ", "KLTs cannot access shared memory segments within the process   "],
        "A",
        "Because KLTs are managed by the kernel, any thread operation (creation, termination, synchronization, scheduling) requires a mode switch and kernel execution, which is relatively slow.",
        "Think about where the thread control structures live and who performs the context switch.",
        None
    ))
    raw_questions.append((
        "user-kernel-threads", "Hard", "MCQ",
        "In thread design, explain 'scheduler activations' and what problem they resolve.",
        ["They provide upcalls from kernel to user space to notify thread state", "They force the CPU scheduler to disable time-slicing for process queues", "They execute all user-level threads directly in kernel register sets   ", "They map virtual page tables directly to secondary storage sectors    "],
        "A",
        "Scheduler activations are a cooperation mechanism between the kernel and a ULT library. The kernel sends upcalls to notify the library when a thread blocks or uncalls, allowing the library to schedule other threads.",
        "How can the kernel tell a user-space thread library that one of its threads has finished waiting for disk I/O?",
        None
    ))
    raw_questions.append((
        "user-kernel-threads", "Medium", "MCQ",
        "An essay question asks: 'Why can a ULT library not exploit a 16-core CPU?' What is the correct response?<br>[EXAMINE DIAGRAM]",
        ["The kernel only schedules the parent process on a single core ", "ULT libraries are written in C which does not support multicore", "User space memory segments are restricted to a single CPU cache", "The CPU scheduler disables instruction prefetching for ULT code  "],
        "A",
        "Because the kernel is unaware of ULTs, it only sees the single parent process. The kernel schedules this process as a single thread on one CPU core. The ULT library cannot distribute its threads to other cores.",
        "Does the OS scheduler know there are multiple threads inside the process in a Many-to-One model?",
        "flowchart TD\n  subgraph User Space (ULT Library)\n    Process[\"Process (16 Threads)\"]\n  end\n  subgraph Kernel Space\n    K[\"1 Schedulable Entity\"]\n  end\n  Process --> K\n  K -->|Scheduled on| Core[\"CPU Core 1 (15 cores wasted)\"]"
    ))
    raw_questions.append((
        "user-kernel-threads", "Easy", "TrueFalse",
        "True or False: A hybrid thread model combines User-Level Threads and Kernel-Level Threads to achieve both low-overhead creation and high concurrency.",
        ["True", "False"],
        "A",
        "Yes, hybrid models (like Many-to-Many or scheduler activations) map lightweight user threads to kernel threads, combining the benefits of both.",
        "Can a system design allow creating thousands of user threads that run on a pool of kernel threads?",
        None
    ))
    raw_questions.append((
        "user-kernel-threads", "Medium", "MCQ",
        "In a KLT model, what happens to thread execution when a thread is preempted by a timer interrupt?<br>[EXAMINE DIAGRAM]",
        ["The kernel saves the thread's state and schedules another KLT  ", "The entire parent process is suspended and swapped out to disk", "The ULT library scheduler selects a sister thread to run in user", "The CPU registers are reset to the initial main function values"],
        "A",
        "Since KLTs are scheduled by the kernel, a timer interrupt preempts the active thread directly. The kernel saves its state in the TCB/PCB and schedules another ready thread (from the same or a different process).",
        "Who is in charge of preemption in a Kernel-Level Threading model?",
        "graph TD\n  T1[\"Running Thread 1\"]\n  T1 -->|Timer Interrupt| K[\"Kernel Scheduler\"]\n  K -->|Save TCB 1, Load TCB 2| T2[\"Resume Thread 2\"]"
    ))
    raw_questions.append((
        "user-kernel-threads", "Hard", "MCQ",
        "An essay exam asks you to define 'thread-safety'. What does this term imply for C libraries like glibc?",
        ["Multiple threads can execute library functions concurrently safely   ", "The library disables all hardware interrupts during function execution", "The library functions are compiled to execute only in kernel mode  ", "The library allocations are restricted to stack memory segments only"],
        "A",
        "A library is thread-safe if its functions can be called concurrently by multiple threads without causing race conditions or corrupted states (typically achieved by avoiding global static state or using locks).",
        "What happens if two threads call printf() or strtok() at the same time in an unsynchronized library?",
        None
    ))

    # 11. process-synchronization (10 questions)
    raw_questions.append((
        "process-synchronization", "Medium", "MCQ",
        "An essay question asks you to define the Critical Section Problem. What are the three requirements that any solution must satisfy?<br>[EXAMINE DIAGRAM]",
        ["Mutual Exclusion, Progress, and Bounded Waiting", "Mutual Exclusion, Speedup, and Deadlock Avoidance", "Mutual Exclusion, Starvation, and Register Saving", "Mutual Exclusion, Priority, and Memory Allocations"],
        "A",
        "Any critical section solution must satisfy: 1. Mutual Exclusion (at most one thread inside). 2. Progress (selection of next thread cannot be postponed indefinitely). 3. Bounded Waiting (no thread waits forever).",
        "Look for the classic three requirements established by Dijkstra for critical section synchronization.",
        "stateDiagram-v2\n  [*] --> EntryProtocol\n  EntryProtocol --> CriticalSection : Mutual Exclusion\n  CriticalSection --> ExitProtocol\n  ExitProtocol --> NonCriticalSection\n  NonCriticalSection --> [*]"
    ))
    raw_questions.append((
        "process-synchronization", "Hard", "MCQ",
        "Trace Peterson's Algorithm. Processes 0 and 1 share: `bool flag[2]; int turn;`. Process 0 executes: `flag[0] = true; turn = 1; while (flag[1] && turn == 1);`. Why is `turn = 1` set to the other process?",
        ["To yield execution priority, preventing deadlock if both set flags", "To request the kernel to assign a higher priority queue index      ", "To lock the variable turn and prevent Process 1 from reading it    ", "To notify the CPU scheduler to disable timeslice preemption interrupts"],
        "A",
        "By setting `turn = 1`, Process 0 politely yields. If both processes attempt to enter, the last one to assign `turn` will be blocked in its `while` loop, guaranteeing mutual exclusion without deadlocks.",
        "Consider what happens when both processes set their flags to true at the same time.",
        None
    ))
    raw_questions.append((
        "process-synchronization", "Easy", "TrueFalse",
        "True or False: On a single-processor system, disabling interrupts is a safe and efficient way for user-space programs to achieve mutual exclusion.",
        ["True", "False"],
        "B",
        "Disabling interrupts is a privileged instruction. User-space programs cannot disable interrupts, as they could hog the CPU forever. This is only safe for kernel-mode execution.",
        "Can the operating system allow arbitrary user programs to execute the CLI/SEI instructions?",
        None
    ))
    raw_questions.append((
        "process-synchronization", "Medium", "MCQ",
        "How do atomic hardware instructions like Test-and-Set achieve synchronization?<br>[EXAMINE DIAGRAM]",
        ["By executing read-modify-write as a single, indivisible CPU cycle", "By disabling all virtual memory page table translations in the MMU  ", "By swapping the instruction pointer register to kernel mode space  ", "By executing process stack frame allocations in secondary storage   "],
        "A",
        "Test-and-Set is an atomic hardware instruction. It reads a memory location and writes a new value (e.g. 1) as a single, indivisible bus cycle, preventing other CPUs from interleaving memory operations.",
        "Think about what 'atomic' means at the hardware bus level.",
        "flowchart TD\n  CPU[\"CPU executes TestAndSet\"]\n  CPU -->|Lock Memory Bus| RAM[\"Read & Write Lock Location (Indivisible)\"]\n  RAM -->|Unlock Bus| CPU"
    ))
    raw_questions.append((
        "process-synchronization", "Easy", "MCQ",
        "What is 'busy waiting' in thread synchronization?",
        ["A thread continuously checks a condition loop, wasting CPU cycles", "A process is suspended in the blocked queue waiting for I/O events", "A thread is executing long numerical calculations inside registers   ", "A scheduler is sorting process priorities in the ready queue   "],
        "A",
        "Busy waiting (or spinning) occurs when a thread repeatedly executes a loop check (e.g. `while(lock == 1);`) waiting for a condition, consuming 100% CPU time without doing useful work.",
        "Identify the term that describes a thread checking a lock variable in a tight loop.",
        None
    ))
    raw_questions.append((
        "process-synchronization", "Hard", "MCQ",
        "An essay question asks: 'Why is busy waiting acceptable on multiprocessor systems but unacceptable on single-processor systems?'",
        ["On single-proc, spinning prevents the lock holder from running to free it", "On multiproc, CPU cores cannot access the same memory bus lines       ", "On single-proc, the hardware does not support atomic CPU instructions   ", "On multiproc, all processes are allocated to the same stack register   "],
        "A",
        "On a single-processor system, if a thread spins, it prevents the thread holding the lock from executing and releasing it (unless preempted). On multiprocessor systems, the holder can run on another core and release the lock quickly.",
        "Think about what the CPU is doing: if it is busy spinning on a single core, can any other thread make progress on that core?",
        None
    ))
    raw_questions.append((
        "process-synchronization", "Medium", "MCQ",
        "Illustrate the execution of a critical section entry protocol.<br>[EXAMINE DIAGRAM]",
        ["It acts as a gatekeeper: blocks entry until the section is vacant", "It copies the shared variable to the thread's stack segment space  ", "It copies the shared variable to the thread's stack segment space  ", "It terminates other processes in the ready queue to ensure safety   "],
        "A",
        "The entry protocol checks the lock. If locked, it blocks the thread (or spins). If unlocked, it sets the lock and allows entry, ensuring at most one thread is in the critical section.",
        "What is the function of the code block preceding the critical section?",
        "flowchart TD\n  Req[\"Thread Requests Entry\"] --> Entry[\"Entry Protocol\"]\n  Entry -->|Vacant| CS[\"Critical Section (Locked)\"]\n  Entry -->|Busy| Block[\"Wait / Sleep Queue\"]\n  CS --> Exit[\"Exit Protocol (Unlock)\"]\n  Exit --> Notify[\"Wake waiting threads\"]"
    ))
    raw_questions.append((
        "process-synchronization", "Easy", "TrueFalse",
        "True or False: The exit protocol in process synchronization is responsible for releasing the lock and waking up waiting processes.",
        ["True", "False"],
        "A",
        "Yes, the exit protocol resets the lock state and signals waiting processes (or semaphores) to allow them to compete for entry.",
        "What must a thread do when it leaves the critical section so other threads can enter?",
        None
    ))
    raw_questions.append((
        "process-synchronization", "Medium", "MCQ",
        "Explain 'starvation' in process synchronization.<br>[EXAMINE DIAGRAM]",
        ["A process is indefinitely delayed because other processes get priority", "A process consumes all heap memory, causing memory allocator faults   ", "The CPU scheduler crashes because of a hardware timer failure interrupt", "A program is terminated by the kernel due to a segment write violation"],
        "A",
        "Starvation (or indefinite blocking) is a synchronization flaw where a runnable process is perpetually bypassed by the scheduler or lock manager in favor of other processes.",
        "Does starvation mean the system is deadlocked, or just that a particular process never gets its turn?",
        "flowchart TD\n  Lock[\"Shared Lock\"]\n  Lock -->|High Priority| P1[\"Process 1 (Enters)\"]\n  Lock -->|High Priority| P2[\"Process 2 (Enters)\"]\n  Lock -.->|Bypassed| P3[\"Process 3 (Starves)\"]"
    ))
    raw_questions.append((
        "process-synchronization", "Hard", "MCQ",
        "In a Socratic essay, a student asks: 'How does Dekker's algorithm differ from Peterson's?' Which statement is correct?",
        ["Dekker's uses a turn variable but does not yield turn on conflict ", "Peterson's algorithm requires hardware support for disabling interrupts", "Dekker's algorithm is designed for three or more concurrent processes   ", "Peterson's algorithm requires mapping pages to secondary swap disk   "],
        "A",
        "Dekker's algorithm is more complex because it uses a turn variable to resolve conflicts but does not immediately yield turn; Peterson's simplifies this by setting the turn variable to the other process directly.",
        "Recall the historically first software-based mutual exclusion algorithm and its simplified successor.",
        None
    ))

    # 12. shared-memory (9 questions)
    raw_questions.append((
        "shared-memory", "Medium", "MCQ",
        "An essay exam asks you to explain the physical memory mapping of Shared Memory IPC. How do two processes access the same data?<br>[EXAMINE DIAGRAM]",
        ["Their virtual page tables map different pages to the same RAM frame", "They copy data back and forth through OS kernel file descriptor buffers", "They share a single stack pointer register during thread context swaps", "They execute instructions in the same code segment of user space mode"],
        "A",
        "Shared memory maps a segment of physical RAM into the virtual address spaces of multiple processes. Each process has its own virtual page table entry pointing to the same physical frame.",
        "Think about page tables: how can two different virtual addresses point to the exact same physical byte in RAM?",
        "flowchart TD\n  subgraph Process A Virtual Memory\n    VA[\"Virtual Page 0x5000\"]\n  end\n  subgraph Process B Virtual Memory\n    VB[\"Virtual Page 0x9000\"]\n  end\n  subgraph Physical RAM\n    Frame[\"Physical Frame 0x1A2B\"]\n  end\n  VA --> Frame\n  VB --> Frame"
    ))
    raw_questions.append((
        "shared-memory", "Hard", "MCQ",
        "Trace execution: Process A writes `*shared_var = 100;` and Process B immediately reads `val = *shared_var;`. If no synchronization is used, what is the risk?",
        ["B may read a stale or partially written value (race condition)", "The CPU will raise a page fault and terminate both processes    ", "The virtual page table entries will be deleted automatically   ", "The OS will trigger a context switch and restart main functions"],
        "A",
        "Without synchronization, Process B could execute its read before Process A finishes writing (or compiler optimizations cache the read), yielding stale, corrupted, or inconsistent data.",
        "Consider what guarantees the order of read and write operations in shared memory.",
        None
    ))
    raw_questions.append((
        "shared-memory", "Easy", "TrueFalse",
        "True or False: Shared Memory IPC is faster than Message Passing IPC because it avoids the overhead of copying data to and from the kernel buffer.",
        ["True", "False"],
        "A",
        "Yes, shared memory operates at memory speed without system call overhead once mapped. Message passing requires copying data from sender stack -> kernel buffer -> receiver stack.",
        "Does shared memory require the CPU to execute read/write system calls to transfer every single byte?",
        None
    ))
    raw_questions.append((
        "shared-memory", "Medium", "MCQ",
        "When allocating shared memory in C on Unix systems, what is the correct sequence of system calls?<br>[EXAMINE DIAGRAM]",
        ["shmget() to allocate segment -> shmat() to attach to address space", "malloc() to allocate heap -> fork() to duplicate stack pointer registers", "open() to create file -> read() to load buffer -> close() to free descriptor", "pthread_create() to spawn thread -> sem_init() to initialize semaphore "],
        "A",
        "First, `shmget` allocates the shared segment and returns an ID. Then, `shmat` maps (attaches) the segment into the calling process's virtual address space, returning a memory pointer.",
        "Identify the system calls specifically prefixed with 'shm' for shared memory.",
        "flowchart LR\n  alloc[\"shmget() (Allocate Segment ID)\"] --> attach[\"shmat() (Attach to Process Virtual Memory)\"]\n  attach --> access[\"Access via pointer\"]\n  access --> detach[\"shmdt() (Detach Segment)\"]"
    ))
    raw_questions.append((
        "shared-memory", "Easy", "MCQ",
        "What system call is used to perform control operations (like deallocation) on a shared memory segment in Unix?",
        ["shmctl()                            ", "shmdt()                             ", "shmat()                             ", "shmget()                            "],
        "A",
        "`shmctl` performs control operations on the shared memory segment, including querying status, changing ownership, and destroying/deallocating the segment using command `IPC_RMID`.",
        "Look for the shared memory control function suffix.",
        None
    ))
    raw_questions.append((
        "shared-memory", "Hard", "MCQ",
        "In a Socratic essay, a student asks: 'Why does shared memory not provide automatic synchronization like pipes?' What is the correct response?",
        ["Pipes go through kernel buffers; shared memory bypasses the kernel", "Shared memory is allocated on stack segments which do not lock     ", "Shared memory page table entries are restricted to read-only mode   ", "The CPU scheduler automatically disables interrupts for shared memory"],
        "A",
        "Pipes are managed by the kernel: write/read calls block automatically if the pipe is full/empty. Shared memory bypasses the kernel entirely after mapping; the kernel cannot intercept memory reads/writes to block them.",
        "Think about where the data transfer happens: does the kernel execute any code when you write to a memory pointer?",
        None
    ))
    raw_questions.append((
        "shared-memory", "Medium", "MCQ",
        "How is shared memory represented in a process memory map?<br>[EXAMINE DIAGRAM]",
        ["Mapped into the shared library / memory-mapped file region", "Allocated directly at the very top of the process stack ", "Placed inside the read-only program text (code) segment  ", "Stored outside physical RAM in the CPU register file     "],
        "A",
        "Shared memory segments are mapped into the dynamic memory segment (between heap and stack) alongside shared libraries and file mappings (`mmap` region).",
        "Recall where dynamically loaded libraries and memory-mapped files reside in the virtual address space.",
        "flowchart TD\n  subgraph Process Address Space\n    Stack[\"Stack (Grows Down)\"]\n    MMap[\"Memory-Mapped Segment (Shared Memory)\"]\n    Heap[\"Heap (Grows Up)\"]\n    Data[\"Data (Globals)\"]\n    Text[\"Text (Code)\"]\n  end"
    ))
    raw_questions.append((
        "shared-memory", "Easy", "TrueFalse",
        "True or False: When a process detaches shared memory using `shmdt()`, the shared memory segment is deleted from physical RAM automatically.",
        ["True", "False"],
        "B",
        "`shmdt` only detaches the segment from the process's page table. The segment remains in physical RAM until explicitly destroyed via `shmctl` (IPC_RMID) or system reboot.",
        "Does detaching a memory segment from one process destroy it for other processes?",
        None
    ))
    raw_questions.append((
        "shared-memory", "Medium", "MCQ",
        "Explain the role of the `IPC_PRIVATE` key in `shmget()`. What does it guarantee?<br>[EXAMINE DIAGRAM]",
        ["It creates a unique shared memory segment visible only to related processes", "It encrypts the shared memory segment using the process's private keys", "It locks the shared memory page to prevent swapping to secondary disk  ", "It restricts access to the shared memory segment to kernel mode execution "],
        "A",
        "Specifying `IPC_PRIVATE` as the key guarantees that `shmget` will create a new, unique shared memory segment. It is typically used by parent and child processes created via fork.",
        "Think about how related parent/child processes share resources without needing a public string key.",
        "graph TD\n  Parent[\"Parent: shmget(IPC_PRIVATE)\"] -->|Fork| Child[\"Child inherits segment ID\"]\n  Parent & Child -->|shmat| RAM[\"Shared RAM Frame\"]"
    ))

    # 13. race-conditions (9 questions)
    raw_questions.append((
        "race-conditions", "Medium", "MCQ",
        "An essay question asks you to explain the Producer-Consumer race condition on a shared variable `count`. Which timeline shows a lost update?<br>[EXAMINE DIAGRAM]",
        ["Interleaved execution of count++ and count-- yielding incorrect count", "Producer writing to count while consumer is blocked waiting for I/O    ", "Both threads reading count and writing the exact same updated value   ", "The CPU scheduler swapping the register values of count to disk stack  "],
        "A",
        "A race condition occurs when `count++` (read, increment, write) and `count--` (read, decrement, write) interleave. For example, both read 5, producer increments to 6, consumer decrements to 4. Whoever writes last discards the other's update.",
        "Think about how assembly operations (load, add, store) can be interleaved by the CPU scheduler.",
        "sequenceDiagram\n  Thread 1 (Producer)->>Register 1: Load count (5)\n  Thread 2 (Consumer)->>Register 2: Load count (5)\n  Thread 1 (Producer)->>Register 1: Increment (6)\n  Thread 2 (Consumer)->>Register 2: Decrement (4)\n  Thread 1 (Producer)->>count: Store 6\n  Thread 2 (Consumer)->>count: Store 4 (Lost Update!)"
    ))
    raw_questions.append((
        "race-conditions", "Hard", "MCQ",
        "Trace execution: Two threads execute concurrently. Thread A: `x = x + 1;` Thread B: `x = x * 2;`. If initial `x = 5`, what are all possible final values of `x`?",
        ["10, 11, or 12                          ", "10 or 12                                ", "11 or 12                                ", "5, 10, or 11                            "],
        "A",
        "If A runs fully then B: $$(5+1)*2 = 12$$. If B runs fully then A: $$(5*2)+1 = 11$$. If A loads 5, B loads 5, B writes 10, A writes 6: Final 6. If A writes 6, B writes 10: Final 10. The set of interleaved outputs is 10, 11, or 12.",
        "List the interleavings of the load and store instructions of both threads.",
        None
    ))
    raw_questions.append((
        "race-conditions", "Easy", "TrueFalse",
        "True or False: Race conditions can only occur on multiprocessor systems with multiple physical CPU cores.",
        ["True", "False"],
        "B",
        "No, race conditions can occur on single-processor systems through preemptive scheduling (interrupts occurring mid-operation in read-modify-write sequences).",
        "Can a context switch happen between a load instruction and a store instruction on a single CPU core?",
        None
    ))
    raw_questions.append((
        "race-conditions", "Medium", "MCQ",
        "Identify the C code snippet that contains a race condition hazard.<br>[EXAMINE DIAGRAM]",
        ["void deposit(int amt) { balance = balance + amt; }", "void deposit(int amt) { pthread_mutex_lock(&l); balance = balance + amt; pthread_mutex_unlock(&l); }", "void get_balance() { return balance; }             ", "void deposit(int amt) { int temp = amt; }           "],
        "A",
        "The first snippet executes `balance = balance + amt;` without synchronization. This is a read-modify-write operation on a shared variable `balance`, vulnerable to race conditions.",
        "Look for shared global variables accessed concurrently without locking or atomic synchronization.",
        "flowchart TD\n  subgraph Unsynchronized Thread A\n    A1[\"Load balance (100)\"]\n    A2[\"Add 10 (110)\"]\n    A3[\"Store balance (110)\"]\n  end\n  subgraph Unsynchronized Thread B\n    B1[\"Load balance (100)\"]\n    B2[\"Add 20 (120)\"]\n    B3[\"Store balance (120)\"]\n  end\n  A1 -.->|Interleave| B1"
    ))
    raw_questions.append((
        "race-conditions", "Easy", "MCQ",
        "Which of the following is the best way to prevent race conditions on shared mutable data?",
        ["Enforcing mutual exclusion using locks, mutexes, or semaphores", "Increasing the physical size of the virtual memory page tables   ", "Setting the CPU scheduler timeslice quantum to be extremely short", "Declaring all variables on the program's local stack frame only   "],
        "A",
        "Mutual exclusion ensures that only one thread can access and modify the shared data at a time, serialization prevents concurrent read-modify-write conflicts.",
        "What mechanism prevents two threads from executing a critical section concurrently?",
        None
    ))
    raw_questions.append((
        "race-conditions", "Hard", "MCQ",
        "In a Socratic essay analyzing compiler optimization, how can the keyword `volatile` in C prevent synchronization bugs?",
        ["It forces the compiler to read/write the variable from RAM directly ", "It automatically wraps the variable reads in pthread mutex locks  ", "It schedules the thread on a dedicated CPU core to prevent switches ", "It allocates the variable in read-only program text memory segment"],
        "A",
        "The `volatile` keyword tells the compiler that the variable's value can change at any time. It prevents the compiler from optimizing reads/writes by caching the value in CPU registers, forcing direct RAM access.",
        "Think about what compiler optimizations do to variable accesses inside loops.",
        None
    ))
    raw_questions.append((
        "race-conditions", "Medium", "MCQ",
        "How does a race condition differ from a deadlock?<br>[EXAMINE DIAGRAM]",
        ["Races cause wrong data; deadlocks cause permanent blocking", "Races block threads; deadlocks delete variables from heap", "Races require timers; deadlocks require virtual swap disks ", "Races run in user space; deadlocks run in kernel space    "],
        "A",
        "A race condition causes incorrect data states because operations execute out of order. A deadlock causes threads to be permanently blocked because they are waiting for each other's resources.",
        "Compare data inconsistency outcomes vs permanent execution stalls.",
        "flowchart LR\n  Race[\"Race Condition: Thread A and B overwrite shared variable -> Corrupt Data\"]\n  Deadlock[\"Deadlock: Thread A waits for B, Thread B waits for A -> Freeze\"]"
    ))
    raw_questions.append((
        "race-conditions", "Easy", "TrueFalse",
        "True or False: Declaring variables as `const` completely eliminates race conditions on those variables.",
        ["True", "False"],
        "A",
        "Yes, `const` variables are read-only and cannot be modified. Since race conditions require mutable shared state (at least one write operation), read-only data is immune.",
        "Can a race condition occur when multiple threads only read a shared variable without writing to it?",
        None
    ))
    raw_questions.append((
        "race-conditions", "Medium", "MCQ",
        "What tool can developers use to detect race conditions in C programs?<br>[EXAMINE DIAGRAM]",
        ["Valgrind ThreadSanitizer (Tsan)  ", "GNU Debugger (GDB) stack frame log", "Cppcheck static syntax parser code", "System call tracer strace utility   "],
        "A",
        "ThreadSanitizer (Tsan) is a tool (integrated into Valgrind and GCC/Clang via `-fsanitize=thread`) that monitors memory access traces at runtime to detect unsynchronized accesses.",
        "Look for the analyzer specifically designed to detect data races in multithreaded code.",
        "graph LR\n  Code[\"Compile with -fsanitize=thread\"] --> Run[\"Execute Tests\"]\n  Run -->|Detect Unlocked Access| Tsan[\"ThreadSanitizer Warning Report\"]"
    ))

    # 14. deadlocks (9 questions)
    raw_questions.append((
        "deadlocks", "Medium", "MCQ",
        "An essay question asks you to list the Coffman conditions for Deadlock. What are they?<br>[EXAMINE DIAGRAM]",
        ["Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait", "Mutual Exclusion, Progress, Bounded Waiting, Priority Inversion  ", "Mutual Exclusion, Cache Coherence, Swapping, Page Faults        ", "Mutual Exclusion, Timer Interrupts, Context Switches, Spooling  "],
        "A",
        "The four Coffman conditions are: 1. Mutual Exclusion. 2. Hold and Wait. 3. No Preemption. 4. Circular Wait. All four must hold simultaneously for a deadlock to occur.",
        "Recall the four conditions defined by Coffman in 1971.",
        "stateDiagram-v2\n  [*] --> CoffmanConditions\n  CoffmanConditions --> MutualExclusion\n  CoffmanConditions --> HoldAndWait\n  CoffmanConditions --> NoPreemption\n  CoffmanConditions --> CircularWait"
    ))
    raw_questions.append((
        "deadlocks", "Hard", "MCQ",
        "Trace this Resource Allocation Graph. Process 1 holds Lock A, requests Lock B. Process 2 holds Lock B, requests Lock A. What does this indicate?<br>[EXAMINE DIAGRAM]",
        ["A deadlock cycle exists because a circular dependency is formed ", "Process 1 will successfully preempt Process 2 and get Lock B    ", "The OS scheduler will automatically release Lock A to resolve it", "Process 2 will enter a blocked suspend state on secondary disk  "],
        "A",
        "The graph contains a directed cycle: $$P_1 \\to R_B \\to P_2 \\to R_A \\to P_1$$. Since resources are single-unit and non-preemptive, this closed loop indicates a deadlock.",
        "Follow the arrows from processes to requested resources, and from allocated resources to processes.",
        "flowchart TD\n  P1[\"Process 1\"] -->|Requests| RB[\"Resource B\"]\n  RB -->|Held By| P2[\"Process 2\"]\n  P2 -->|Requests| RA[\"Resource A\"]\n  RA -->|Held By| P1"
    ))
    raw_questions.append((
        "deadlocks", "Easy", "TrueFalse",
        "True or False: If a Resource Allocation Graph contains a cycle, a deadlock must exist, regardless of the number of resource units available.",
        ["True", "False"],
        "B",
        "False. A cycle is a necessary and sufficient condition for deadlock only if resources have single units. If resources have multiple units, a cycle indicates a potential deadlock but not a guaranteed one.",
        "If a resource has 3 units and only one is held in the cycle while the others are held by processes outside the cycle, can those external processes release them?",
        None
    ))
    raw_questions.append((
        "deadlocks", "Medium", "MCQ",
        "How does Deadlock Prevention differ from Deadlock Avoidance?<br>[EXAMINE DIAGRAM]",
        ["Prevention breaks conditions; avoidance checks safe states dynamically", "Prevention terminates processes; avoidance disables hardware interrupts ", "Prevention reloads page tables; avoidance runs compile optimization passes", "Prevention maps virtual page frames; avoidance allocates stack segments"],
        "A",
        "Deadlock Prevention design rules eliminate at least one of the four Coffman conditions (e.g., locking all resources at once). Deadlock Avoidance dynamically checks resource requests (e.g., Bankers Algorithm) to ensure the system remains in a safe state.",
        "Compare static design-time constraints vs dynamic runtime safety checks.",
        "flowchart TD\n  subgraph Prevention\n    PR[\"Static: Break 1 of 4 Coffman conditions (e.g., hold-and-wait)\"]\n  end\n  subgraph Avoidance\n    AV[\"Dynamic: Run Banker's Algorithm to check Safe State on request\"]\n  end"
    ))
    raw_questions.append((
        "deadlocks", "Easy", "MCQ",
        "Which of the following is a classic algorithm used for deadlock avoidance in multi-resource systems?",
        ["Banker's Algorithm                  ", "Peterson's Algorithm                 ", "Dijkstra's Shortest Path Algorithm   ", "Round Robin Scheduling Algorithm     "],
        "A",
        "The Banker's Algorithm (designed by Dijkstra) is used for deadlock avoidance by simulating allocation requests and denying them if they transition the system into an unsafe state.",
        "Look for the algorithm named after financial credit systems.",
        None
    ))
    raw_questions.append((
        "deadlocks", "Hard", "MCQ",
        "In a Socratic essay analyzing deadlock recovery, what is the cost of recovering via process termination?",
        ["All computed work of the terminated processes is lost entirely  ", "The virtual memory page table directory is corrupted permanently ", "The CPU scheduler disables multitasking timers for all processes   ", "The hardware registers are reset to the initial startup values   "],
        "A",
        "Process termination is simple but expensive. Aborting deadlocked processes discards all progress and intermediate computations performed by those processes.",
        "Think about what happens to a rendering or simulation process when it is killed by the OS.",
        None
    ))
    raw_questions.append((
        "deadlocks", "Medium", "MCQ",
        "What is the 'Ostrich Algorithm' in deadlock handling?<br>[EXAMINE DIAGRAM]",
        ["Ignore the deadlock problem, assuming it happens very rarely", "Terminate the oldest process in the ready queue automatically   ", "Rollback the process state to the last saved stack check frame  ", "Lock all resources at system startup to prevent circular wait  "],
        "A",
        "The Ostrich Algorithm is to ignore deadlocks. It is used when deadlocks are extremely rare and the cost of prevention, avoidance, or detection/recovery is too high (e.g. standard desktop operating systems).",
        "Think about the behavior of an ostrich sticking its head in the sand.",
        "flowchart TD\n  Deadlock[\"Deadlock Occurs\"]\n  Deadlock -->|Ostrich Strategy| Ignore[\"Do nothing. Let user restart app if frozen\"]"
    ))
    raw_questions.append((
        "deadlocks", "Easy", "TrueFalse",
        "True or False: An unsafe state in deadlock avoidance is equivalent to a deadlocked state.",
        ["True", "False"],
        "B",
        "An unsafe state is not a deadlock. It just means the system cannot guarantee that it can avoid a deadlock if processes request their maximum declared resources. Deadlock is still avoidable.",
        "Does entering an unsafe state mean all processes are currently blocked?",
        None
    ))
    raw_questions.append((
        "deadlocks", "Medium", "MCQ",
        "How can the Hold and Wait condition be broken to prevent deadlocks?<br>[EXAMINE DIAGRAM]",
        ["Require processes to request all resources at system startup", "Allow processes to hold resources indefinitely without execution", "Force processes to yield held resources when a new one is denied ", "Disable preemption interrupts during resource request calls    "],
        "A",
        "The Hold and Wait condition is broken by requiring a process to request (and be allocated) all resources it will ever need at once before starting execution, or only allow resource requests when it holds none.",
        "What rules can prevent a process from holding resource A while requesting resource B?",
        "flowchart LR\n  Req[\"Start Process\"] -->|Request All| R1[\"Get A, B, C\"]\n  R1 --> Exec[\"Run Process\"]\n  R1 -->|If any unavailable| Block[\"Wait (Hold None)\"]"
    ))

    # 15. semaphores (9 questions)
    raw_questions.append((
        "semaphores", "Medium", "MCQ",
        "An essay question asks you to define Semaphore Wait (P) and Signal (V) operations. What is their internal logic?<br>[EXAMINE DIAGRAM]",
        ["Wait decrements; blocks if < 0. Signal increments; wakes if <= 0", "Wait increments; blocks if > 0. Signal decrements; wakes if >= 0", "Wait locks the CPU; Signal disables the hardware timer interrupt ", "Wait swaps memory to disk; Signal reloads virtual page tables  "],
        "A",
        "Wait (P): `sem--; if (sem < 0) { block_calling_thread(); }`. Signal (V): `sem++; if (sem <= 0) { wakeup_waiting_thread(); }`.",
        "Recall Dijkstra's integer semaphore operations and how the value tracks waiting threads when negative.",
        "stateDiagram-v2\n  [*] --> Wait_P\n  Wait_P --> DecSem : Decrement sem\n  DecSem --> CheckVal\n  CheckVal -->|sem < 0| Block : Add thread to queue & block\n  CheckVal -->|sem >= 0| EnterCS : Proceed\n  [*] --> Signal_V\n  Signal_V --> IncSem : Increment sem\n  IncSem --> CheckSig\n  CheckSig -->|sem <= 0| Wakeup : Remove & wake thread from queue\n  CheckSig -->|sem > 0| Exit : Proceed"
    ))
    raw_questions.append((
        "semaphores", "Hard", "MCQ",
        "Trace a producer-consumer synchronization implementation using semaphores. The shared state has: `sem_t mutex = 1, empty = 5, full = 0;`. Trace the semaphore values after the producer adds one item.",
        ["mutex = 1, empty = 4, full = 1             ", "mutex = 0, empty = 5, full = 0             ", "mutex = 1, empty = 5, full = 1             ", "mutex = 0, empty = 4, full = 0             "],
        "A",
        "Producer executes: `sem_wait(&empty)` (5 -> 4), `sem_wait(&mutex)` (1 -> 0), writes item, `sem_post(&mutex)` (0 -> 1), `sem_post(&full)` (0 -> 1). Final: mutex=1, empty=4, full=1.",
        "Follow the producer's wait and post calls in sequence.",
        None
    ))
    raw_questions.append((
        "semaphores", "Easy", "TrueFalse",
        "True or False: A binary semaphore can be initialized to any positive integer value.",
        ["True", "False"],
        "B",
        "A binary semaphore's value is strictly restricted to 0 and 1, acting as a mutual exclusion lock. If initialized to a larger value, it acts as a counting semaphore.",
        "What values can a binary semaphore hold during its lifecycle?",
        None
    ))
    raw_questions.append((
        "semaphores", "Medium", "MCQ",
        "Explain the risk of executing `sem_wait` in the incorrect order, such as: `sem_wait(&mutex); sem_wait(&empty);` in a producer.<br>[EXAMINE DIAGRAM]",
        ["It will cause a deadlock if the buffer is completely full", "It will corrupt the shared memory heap space variables      ", "It will cause the CPU scheduler to disable timeslices      ", "It will trigger a format string bug exception in printf    "],
        "A",
        "If the buffer is full (`empty = 0`), the producer calls `sem_wait(&mutex)` (locking the buffer), then blocks on `sem_wait(&empty)`. The consumer cannot run because the buffer is locked, causing a deadlock.",
        "What happens if a process holds the mutual exclusion lock while sleeping, waiting for another process to free up space?",
        "flowchart TD\n  P[\"Producer Locks Mutex\"] -->|Hold Lock| P2[\"Producer Waits on Empty (Sleeps)\"]\n  C[\"Consumer wants to enter\"] -->|Blocked by Mutex| Lock[\"Locked Mutex\"]\n  P2 -.->|Deadlock| C"
    ))
    raw_questions.append((
        "semaphores", "Easy", "MCQ",
        "Which of the following system calls is used to perform operations on semaphores in Unix System V?",
        ["semop()                             ", "semget()                            ", "semctl()                            ", "sem_init()                          "],
        "A",
        "In Unix System V, `semop` is the system call used to perform atomic operations (wait, signal) on semaphore sets allocated via `semget`.",
        "Identify the system call that operates on Unix System V semaphore identifiers.",
        None
    ))
    raw_questions.append((
        "semaphores", "Hard", "MCQ",
        "In a Socratic essay, a student asks: 'Why are semaphores implemented with sleep queues rather than busy-waiting loops in the kernel?'",
        ["Sleeping frees the CPU to perform productive work for other threads", "Disabling busy-waiting avoids virtual page table translations in RAM ", "Sleep queues do not require saving CPU registers during context switches", "Spinning on locks is forbidden by standard C compiler optimization   "],
        "A",
        "If a thread blocks on a semaphore, it might wait a long time (e.g. waiting for I/O). Busy-waiting would waste CPU cycles. Putting the thread to sleep frees the CPU for other processes.",
        "Compare the CPU cost of spinning for 5 milliseconds vs context-switching to another thread.",
        None
    ))
    raw_questions.append((
        "semaphores", "Medium", "MCQ",
        "How does a counting semaphore manage a pool of resources?<br>[EXAMINE DIAGRAM]",
        ["Value tracks available units; blocks when value falls below 0", "Locks the system bus to prevent physical multiprocessor writes  ", "Requires swapping process stack frames to secondary swap disks ", "Directs the CPU dispatcher to change modes to privilege level 0 "],
        "A",
        "The semaphore value is initialized to the number of resource units. Each request (wait) decrements it. If a request occurs when value <= 0, the process blocks until a release (signal) increments it.",
        "Consider how the semaphore value tracks the number of free resource slots.",
        "flowchart TD\n  Sem[\"Semaphore Value (Initial: 2)\"]\n  Sem -->|wait| S1[\"Value: 1 (OK)\"]\n  S1 -->|wait| S2[\"Value: 0 (OK)\"]\n  S2 -->|wait| S3[\"Value: -1 (Blocked)\"]"
    ))
    raw_questions.append((
        "semaphores", "Easy", "TrueFalse",
        "True or False: Semaphores can be used to coordinate the execution order of processes, not just mutual exclusion.",
        ["True", "False"],
        "A",
        "Yes, by initializing a semaphore to 0, Process B can call `sem_wait()`, blocking until Process A finishes its task and calls `sem_post()`, enforcing ordering (serialization).",
        "If you want thread B to execute statement 2 only after thread A executes statement 1, how can you initialize the semaphore?",
        None
    ))
    raw_questions.append((
        "semaphores", "Medium", "MCQ",
        "What is the difference between a semaphore and a condition variable?<br>[EXAMINE DIAGRAM]",
        ["Semaphores have state memory; condition variables have no state memory", "Semaphores run in user space; condition variables run in kernel mode ", "Semaphores require timers; condition variables require virtual disks   ", "Semaphores block processes; condition variables do not block threads    "],
        "A",
        "Semaphores maintain an internal counter; a signal is remembered even if no thread is waiting. Condition variables have no state; a signal is lost if no thread is currently waiting (stateless).",
        "Think about what happens to a post/signal when there are no waiting threads.",
        "flowchart LR\n  Sem[\"Semaphore: remembers signal (value increases)\"]\n  CV[\"Condition Variable: signal is lost if no threads waiting\"]"
    ))

    # 16. monitors (9 questions)
    raw_questions.append((
        "monitors", "Medium", "MCQ",
        "An essay question asks you to explain the monitor construct. How does a monitor guarantee mutual exclusion?<br>[EXAMINE DIAGRAM]",
        ["Implicitly: compiler/runtime allows only one active thread inside", "Explicitly: programmer must call mutex lock/unlock on entry/exit  ", "Implicitly: by disabling all interrupts on CPU cores dynamically   ", "Explicitly: by swapping process heap variables to secondary storage"],
        "A",
        "A monitor is a high-level language construct. The compiler/runtime automatically adds locking mechanisms, ensuring that at most one thread can execute any monitor procedure concurrently.",
        "Compare manual locking using mutexes vs automatic locking provided by the programming language.",
        "flowchart TD\n  subgraph Monitor Container\n    Queue[\"Entry Queue (Blocked)\"] -->|Only 1 allowed| Active[\"Active Thread in Monitor\"]\n  end"
    ))
    raw_questions.append((
        "monitors", "Hard", "MCQ",
        "Trace monitor condition synchronization. Thread A calls `c.wait()`. Thread B calls `c.signal()`. Compare Hoare (Signal-and-Wait) vs Mesa (Signal-and-Continue) semantics.",
        ["Hoare yields CPU to A immediately; Mesa continues executing B", "Hoare continues executing B; Mesa yields CPU to A immediately", "Hoare deletes thread A; Mesa allocates a new process stack  ", "Hoare disables interrupts; Mesa context-switches to the kernel"],
        "A",
        "Under Hoare semantics, the signaler (B) blocks and yields the CPU to the woken thread (A) immediately. Under Mesa semantics, the signaler (B) continues execution; the woken thread (A) is moved to the ready queue.",
        "Consider who has priority to run inside the monitor immediately after a signal is sent.",
        None
    ))
    raw_questions.append((
        "monitors", "Easy", "TrueFalse",
        "True or False: Condition variables inside a monitor maintain an internal integer counter similar to semaphores.",
        ["True", "False"],
        "B",
        "Condition variables have no history counter. If `signal()` is called with no threads waiting, the signal is discarded. Semaphores increment their counter.",
        "If a thread calls wait() after a signal was called on an empty condition variable queue, does it block?",
        None
    ))
    raw_questions.append((
        "monitors", "Medium", "MCQ",
        "In a Mesa-style monitor, why must thread wait calls be placed inside a `while` loop (e.g. `while(condition) wait(c);`)?<br>[EXAMINE DIAGRAM]",
        ["Because other threads can modify the state before the woken thread runs", "Because condition variables are stored on virtual secondary swap disks  ", "Because the CPU dispatcher does not support thread context scheduling    ", "Because Mesa semantics require re-evaluating compiler optimization code"],
        "A",
        "Under Mesa semantics, a woken thread is moved to the ready queue, not executed immediately. Before it runs, another thread could enter the monitor and change the condition, demanding a re-check.",
        "Think about what can happen to a resource in the time between a thread being woken and actually running on the CPU.",
        "flowchart TD\n  Wake[\"Thread is Woken\"] --> Ready[\"Ready Queue\"]\n  Ready --> Run[\"Acquire Lock\"]\n  Run --> Check{Is resource free?}\n  Check -->|Yes| Exec[\"Use Resource\"]\n  Check -->|No (Stale)| Loop[\"Loop back and sleep again\"]"
    ))
    raw_questions.append((
        "monitors", "Easy", "MCQ",
        "Which programming language natively supports monitor synchronization constructs directly in its syntax?",
        ["Java (using synchronized keyword)    ", "C (using standard library arrays)   ", "Assembly (using hardware instruction)", "Python (using bare global variables)"],
        "A",
        "Java supports monitors. Marking a method as `synchronized` guarantees mutual exclusion, and threads coordinate using `wait()` and `notify()` on the object monitor.",
        "Identify the object-oriented language that provides monitor wrappers for class methods.",
        None
    ))
    raw_questions.append((
        "monitors", "Hard", "MCQ",
        "An essay question asks: 'If a monitor procedure calls a function outside the monitor that blocks, what is the impact on concurrency?'",
        ["No other thread can enter the monitor, causing a deadlock hazard  ", "The compiler will automatically replicate the monitor in memory space", "The CPU scheduler will immediately swap the monitor stack to disk   ", "The OS will release the monitor lock automatically to prevent block  "],
        "A",
        "If a thread blocks inside a monitor while calling external code, it retains ownership of the monitor lock. No other thread can enter, potentially stalling the entire synchronization subsystem.",
        "Does a thread release the monitor lock automatically when it executes a blocking call to a foreign module?",
        None
    ))
    raw_questions.append((
        "monitors", "Medium", "MCQ",
        "What is the role of the entry queue in a monitor structure?<br>[EXAMINE DIAGRAM]",
        ["Holds threads waiting to enter the monitor's mutually exclusive scope", "Caches translated virtual memory addresses for monitor stack lookups ", "Stores process control blocks during context switching timer interrupts", "Saves output stream characters before sending them to spooling disks  "],
        "A",
        "The entry queue holds threads that called a monitor procedure but were blocked because another thread was already executing inside the monitor.",
        "Where do threads wait before they are allowed to enter the monitor's exclusive environment?",
        "graph LR\n  Threads[\"Threads Calling Monitor\"] --> Queue[\"Entry Queue (Blocked)\"]\n  Queue -->|Active finishes| Monitor[\"Enter Monitor (Active)\"]"
    ))
    raw_questions.append((
        "monitors", "Easy", "TrueFalse",
        "True or False: Monitors are more prone to programmer errors (like forgetting to release locks) than raw semaphores.",
        ["True", "False"],
        "B",
        "Monitors are less error-prone because locking and unlocking are handled automatically by the compiler, eliminating the risk of a programmer forgetting to release a lock.",
        "Compare writing sem_wait/sem_post manually at every exit point vs letting the compiler handle lock release.",
        None
    ))
    raw_questions.append((
        "monitors", "Medium", "MCQ",
        "Explain the function of `signal_all` (or broadcast) in monitor condition variables.<br>[EXAMINE DIAGRAM]",
        ["Wakes up all threads currently waiting on the condition queue", "Deallocates all monitor variables from the process heap space", "Reboots the CPU to clear register context switches and deadlocks", "Triggers a hardware interrupt to reload all page tables in memory"],
        "A",
        "`signal_all` wakes up all threads currently suspended in the condition variable's wait queue. Each thread will sequentially re-acquire the monitor lock and evaluate the condition.",
        "What happens when multiple threads are waiting for a resource to change state (like a buffer size update)?",
        "flowchart TD\n  CV[\"Condition Queue: T1, T2, T3\"]\n  CV -->|signal_all| Ready[\"Ready Queue: T1, T2, T3 (Acquire monitor sequentially)\"]"
    ))

    # 17. mutexes-locks (9 questions)
    raw_questions.append((
        "mutexes-locks", "Medium", "MCQ",
        "An essay question asks you to distinguish a Mutex from a Binary Semaphore. What is the fundamental difference?<br>[EXAMINE DIAGRAM]",
        ["Mutexes enforce ownership; semaphores can be signaled by any thread", "Mutexes support counting values; semaphores are restricted to 0 and 1 ", "Mutexes require hardware timers; semaphores require virtual disk space", "Mutexes run in user space; semaphores run in kernel mode space only   "],
        "A",
        "A mutex has an ownership requirement: only the thread that locked the mutex can unlock it. Semaphores have no ownership; any thread can call `sem_post` to signal a semaphore.",
        "Consider who has permission to unlock a resource: does the locking primitive track who locked it?",
        "flowchart LR\n  Mutex[\"Mutex Lock (Owner: Thread 1)\"]\n  Mutex -->|Unlock by Thread 2| Error[\"Ownership Violation Error\"]\n  Sem[\"Semaphore (Value: 0)\"]\n  Sem -->|Post by Thread 2| Ok[\"Value: 1 (Allowed)\"]"
    ))
    raw_questions.append((
        "mutexes-locks", "Hard", "MCQ",
        "In a C trace, a thread calls `pthread_mutex_lock(&m)` twice on a non-recursive mutex. What is the result?",
        ["The thread deadlocks with itself, waiting for the lock to free", "The second call returns immediately and execution continues normal", "The program raises a page fault exception and halts the process   ", "The OS terminates the thread and releases the lock automatically  "],
        "A",
        "If a thread attempts to lock a standard (non-recursive) mutex that it already holds, it will block waiting for the lock to be released, causing a self-deadlock.",
        "Recall what happens when you block waiting for yourself to release a resource.",
        None
    ))
    raw_questions.append((
        "mutexes-locks", "Easy", "TrueFalse",
        "True or False: Spinlocks are highly efficient on single-processor systems running preemptive operating systems.",
        ["True", "False"],
        "B",
        "Spinlocks are highly inefficient on single-processor systems. The spinning thread consumes 100% of the CPU, preventing the thread holding the lock from running and releasing it.",
        "If there is only one CPU core and the active thread is spinning in a loop, how can the lock holder get CPU time?",
        None
    ))
    raw_questions.append((
        "mutexes-locks", "Medium", "MCQ",
        "What is a 'recursive mutex' (reentrant lock) and when is it used?<br>[EXAMINE DIAGRAM]",
        ["A lock that allows the owner thread to acquire it multiple times", "A lock that automatically resolves circular wait deadlock conditions ", "A lock that requires physical virtual memory swapping to disk space  ", "A lock that alternates execution priority queues based on timers   "],
        "A",
        "A recursive mutex allows the holding thread to acquire it multiple times without deadlocking. It maintains an acquisition count and must be unlocked an equal number of times.",
        "Think about a thread executing a recursive function that accesses the same critical section.",
        "flowchart TD\n  Lock[\"Recursive Mutex (Held by T1, Count: 0)\"] -->|T1 Locks| L1[\"Held by T1, Count: 1 (OK)\"]\n  L1 -->|T1 Locks again| L2[\"Held by T1, Count: 2 (OK)\"]"
    ))
    raw_questions.append((
        "mutexes-locks", "Easy", "MCQ",
        "Which of the following functions is used to release a mutex lock in the POSIX pthreads library?",
        ["pthread_mutex_unlock()              ", "pthread_mutex_lock()                ", "pthread_mutex_destroy()             ", "pthread_mutex_init()                "],
        "A",
        "`pthread_mutex_unlock` releases the mutex object referenced by the pointer, making it available to other threads.",
        "Look for the pthread function suffix designed to unlock a mutex.",
        None
    ))
    raw_questions.append((
        "mutexes-locks", "Hard", "MCQ",
        "In a Socratic essay, a student asks: 'Why does lock contention degrade multithreaded application scaling?'",
        ["Contention serializes execution, converting parallel paths to serial ", "Contention deletes virtual page table mappings from physical RAM   ", "Contention forces the compiler to reinitialize instruction caches    ", "Contention disables hardware interrupts on multiprocessor machines  "],
        "A",
        "When locks are contended, threads must block and wait. This serializes execution (Amdahl's Law), causing processor cores to sit idle or spend time context-switching instead of doing parallel work.",
        "Think about what happens to thread parallelism when all threads want to access the same single-lane bridge at the same time.",
        None
    ))
    raw_questions.append((
        "mutexes-locks", "Medium", "MCQ",
        "Compare a spinlock with a mutex lock.<br>[EXAMINE DIAGRAM]",
        ["Spinlocks busy-wait; mutexes put the blocked thread to sleep", "Spinlocks run in user space; mutexes run in kernel space only ", "Spinlocks require page table translations; mutexes bypass MMUs ", "Spinlocks block interrupts; mutexes allocate stack memory    "],
        "A",
        "A spinlock busy-waits (spins in a loop), consuming CPU. A mutex puts the blocked thread to sleep (blocks it) in a queue, releasing the CPU to run other processes.",
        "Compare CPU usage patterns of a thread waiting in a loop vs a thread suspended in a queue.",
        "flowchart TD\n  Spin[\"Spinlock: CPU busy loop (checks lock constantly)\"]\n  Mutex[\"Mutex: Thread sleeps (blocks), CPU runs other tasks\"]"
    ))
    raw_questions.append((
        "mutexes-locks", "Easy", "TrueFalse",
        "True or False: Lock-free programming techniques completely eliminate the overhead of mutual exclusion locks by using atomic hardware instructions directly.",
        ["True", "False"],
        "A",
        "Yes, lock-free programming uses atomic instructions (like Compare-And-Swap) to update variables directly without locking, avoiding blocking and context switches.",
        "Can a data structure be updated safely without wrapping the code block in mutex lock and unlock calls?",
        None
    ))
    raw_questions.append((
        "mutexes-locks", "Medium", "MCQ",
        "Explain 'deadlock detection' using lock dependency tracking.<br>[EXAMINE DIAGRAM]",
        ["OS tracks who holds and wants locks to detect cycles dynamically", "OS deletes locks when they are held for more than 5 seconds     ", "OS reboots the CPU when thread registers indicate busy spinning  ", "OS disables page table translations during mutex acquisition calls"],
        "A",
        "The OS (or lock library) maintains a wait-for graph of locks. If a cycle is detected, the system knows a deadlock exists and can take recovery action (e.g. aborting a thread).",
        "How can the system identify that process A is waiting for B and B is waiting for A?",
        "graph LR\n  T1[\"Thread 1\"] -->|Waits for Lock B| T2[\"Thread 2\"]\n  T2 -->|Waits for Lock A| T1\n  Cycle[\"Cycle Detected\"] -.->|Report| Deadlock[\"Deadlock State\"]"
    ))

    # 18. buffer-overflows (9 questions)
    raw_questions.append((
        "buffer-overflows", "Medium", "MCQ",
        "An essay exam asks you to explain the mechanics of a stack buffer overflow. What critical value in the stack frame is overwritten to hijack execution?<br>[EXAMINE DIAGRAM]",
        ["The return address stored in the stack frame pointer", "The program counter register in the CPU control file ", "The base register address in the virtual memory table", "The global variable pointer allocated on the heap space"],
        "A",
        "A stack buffer overflow occurs when writing past bounds of a stack-allocated array. The excess data overwrites adjacent stack contents, replacing the saved return address with the address of attacker code.",
        "Think about where a function jumps to when it finishes execution and returns.",
        "flowchart TD\n  subgraph Stack Frame Memory\n    Buffer[\"Local Buffer Array (buffer[64])\"]\n    SFP[\"Saved Frame Pointer (SFP)\"]\n    RET[\"Saved Return Address (RET)\"]\n  end\n  Overflow[\"Overflow Input data\"] -->|Overwrites| Buffer\n  Overflow -->|Overwrites| SFP\n  Overflow -->|Hijacks| RET"
    ))
    raw_questions.append((
        "buffer-overflows", "Hard", "MCQ",
        "Trace execution: A vulnerable C function contains `char buf[8]; strcpy(buf, input);`. If the input string is 12 bytes long (plus null terminator), what memory corruption occurs?",
        ["SFP and part of the return address are overwritten      ", "The heap memory allocator raises an out-of-memory exception", "The compiler detects the overflow and inserts a NULL byte   ", "The CPU scheduler halts multitasking timer interrupts       "],
        "A",
        "The input is 13 bytes total. `buf` holds 8. The extra 5 bytes overwrite the adjacent saved frame pointer (4 bytes on 32-bit) and the first byte of the saved return address.",
        "Calculate the stack layout offset: local array (8 bytes) -> saved frame pointer (4 bytes) -> return address.",
        None
    ))
    raw_questions.append((
        "buffer-overflows", "Easy", "TrueFalse",
        "True or False: The C standard library function `strcpy()` checks the size of the destination buffer before copying characters.",
        ["True", "False"],
        "B",
        "`strcpy()` is unsafe. It copies characters from source to destination until it encounters a null terminator `\0`, regardless of destination buffer size, causing overflows.",
        "Does strcpy() accept a buffer size parameter to restrict character writes?",
        None
    ))
    raw_questions.append((
        "buffer-overflows", "Medium", "MCQ",
        "Which C standard library function should be used to prevent buffer overflows by restricting the maximum characters copied?<br>[EXAMINE DIAGRAM]",
        ["strncpy() (or snprintf())            ", "strcpy() (or sprintf())             ", "gets() (or scanf())                 ", "strcat() (or wcscpy())              "],
        "A",
        "`strncpy` takes a size parameter `n` restricting characters copied, protecting against overflows. `gets` and `strcpy` are unsafe because they lack length checks.",
        "Look for the copy function that requires specifying the maximum buffer capacity as an argument.",
        "flowchart LR\n  Unsafe[\"strcpy(dest, src) (No limit)\"] --> Overflow[\"Buffer Overflow Risk\"]\n  Safe[\"strncpy(dest, src, sizeof(dest)) (Limited)\"] --> Secure[\"Secure Copy\"]"
    ))
    raw_questions.append((
        "buffer-overflows", "Easy", "MCQ",
        "What is a 'stack canary' in buffer overflow defense?",
        ["A random value placed before the return address to check for changes", "A system process that monitors network socket connection queues       ", "A hardware register that stores virtual memory limit addresses       ", "A compiler utility that parses struct allocations in heap memory     "],
        "A",
        "A stack canary is a security mechanism. It writes a random value before the return address. Before returning, the function checks if the canary has changed; if so, it aborts, preventing hijack.",
        "Think of a warning indicator in a coal mine used to detect toxic gases before they cause harm.",
        None
    ))
    raw_questions.append((
        "buffer-overflows", "Hard", "MCQ",
        "In a Socratic essay analyzing security mitigation, how does ASLR (Address Space Layout Randomization) prevent stack hijack exploits?",
        ["It randomizes memory locations of stack, heap, and libraries  ", "It encrypts all program instructions inside the instruction cache", "It disables the execution of code stored on stack page frames  ", "It forces the compiler to declare all variables as constants    "],
        "A",
        "ASLR randomizes memory positions (stack, heap, libraries) on every run. Attackers cannot hardcode target jump addresses (like libc helper functions) because addresses change dynamically.",
        "Think about what happens to jump addresses when the starting point of the stack and libraries changes on every execution.",
        None
    ))
    raw_questions.append((
        "buffer-overflows", "Medium", "MCQ",
        "What is the DEP / NX bit defense in CPU memory management?<br>[EXAMINE DIAGRAM]",
        ["Marks memory pages (like stack) as non-executable to block shellcode", "Checks if virtual memory pages are dirty before swapping to disk    ", "Limits the maximum stack allocation size of executing processes      ", "Prevents user applications from switching CPU modes to kernel level  "],
        "A",
        "Data Execution Prevention (DEP) or the No-Execute (NX) bit marks stack and heap pages as non-executable. If an attacker overflows the stack and attempts to jump to shellcode in the buffer, the CPU raises an exception.",
        "Consider how the hardware can prevent executing instructions located in data segments.",
        "graph TD\n  Stack[\"Stack Page (Data Region)\"] -->|Set NX Bit| MMU[\"MMU raises execution fault on jump\"]\n  Text[\"Text Page (Code Region)\"] -->|Execute| CPU[\"CPU Core runs code\"]"
    ))
    raw_questions.append((
        "buffer-overflows", "Easy", "TrueFalse",
        "True or False: Declaring variables in Java or Python is safe from buffer overflow memory corruption vulnerabilities.",
        ["True", "False"],
        "A",
        "Yes, Java and Python are memory-safe languages. They manage memory references and perform array bounds checks in their runtimes, raising exceptions rather than writing past memory bounds.",
        "Do managed runtimes like the JVM or Python interpreter allow direct pointer manipulation and stack overwriting?",
        None
    ))
    raw_questions.append((
        "buffer-overflows", "Medium", "MCQ",
        "Explain the term 'heap overflow' compared to 'stack overflow'.<br>[EXAMINE DIAGRAM]",
        ["Overwriting dynamic memory allocated via malloc; stack is local arrays", "Overwriting local variables; heap is register files in CPU control   ", "Heap is non-volatile disk swap space; stack is RAM frames page tables ", "Heap runs in kernel mode space; stack runs in user mode privilege level"],
        "A",
        "A heap overflow occurs when writing past bounds of memory allocated dynamically on the heap (via `malloc` or `new`). A stack overflow occurs in function local frames on the stack.",
        "Compare dynamic memory allocations on the heap vs local variables on the stack.",
        "graph TD\n  Stack[\"Stack Overflow: Corrupts stack frames and return addresses\"]\n  Heap[\"Heap Overflow: Corrupts dynamic malloc chunks and function pointers\"]"
    ))

    # 19. format-string-bugs (9 questions)
    raw_questions.append((
        "format-string-bugs", "Medium", "MCQ",
        "An essay question asks you to identify a format string bug hazard. Which C statement is vulnerable?<br>[EXAMINE DIAGRAM]",
        ["printf(user_input);                  ", "printf(\"%s\", user_input);          ", "printf(\"Hello %s\", user_input);    ", "sprintf(buf, \"%s\", user_input);    "],
        "A",
        "`printf(user_input);` is vulnerable. If `user_input` contains format specifiers (like `%x` or `%s`), `printf` interprets them as arguments, parsing memory values from the stack.",
        "Look for the print function call that lacks a hardcoded format string literal as its first argument.",
        "flowchart TD\n  Vun[\"printf(user_input) (Vulnerable)\"] -->|Input: %x %x| Stack[\"Dumps Stack Values\"]\n  Safe[\"printf(\\\"%s\\\", user_input) (Secure)\"] -->|Input: %x %x| Print[\"Prints String Literal '%x %x'\"]"
    ))
    raw_questions.append((
        "format-string-bugs", "Hard", "MCQ",
        "Trace execution: An attacker passes the string `\"%x %x %x\"` to a program executing `printf(user_input);`. What is the result?",
        ["The program prints the hex values of adjacent stack contents", "The program raises a page fault exception and terminates immediately", "The CPU scheduler disables the hardware timer preemption interrupts", "The compiler intercepts execution and sets the registers to 0     "],
        "A",
        "Since `printf` expects arguments matching the three `%x` specifiers, it reads the next three values from the stack (which are local variables or return addresses) and prints them in hex.",
        "Think about how printf retrieves arguments from the stack when they are not explicitly passed in the call.",
        None
    ))
    raw_questions.append((
        "format-string-bugs", "Easy", "TrueFalse",
        "True or False: The format specifier `%n` in C allows writing data to a memory location, not just printing it.",
        ["True", "False"],
        "A",
        "`%n` is unique. It expects a pointer address as an argument and writes the number of characters formatted so far to that address, enabling memory corruption exploits.",
        "Does any printf specifier have write permissions to memory locations?",
        None
    ))
    raw_questions.append((
        "format-string-bugs", "Medium", "MCQ",
        "How do you fix the vulnerable C statement: `printf(input);` to eliminate format string bugs completely?<br>[EXAMINE DIAGRAM]",
        ["Replace it with: printf(\"%s\", input);", "Replace it with: sprintf(input, \"%s\");", "Replace it with: printf(input, \"%d\"); ", "Replace it with: fprintf(stdout, input);"],
        "A",
        "Replacing it with `printf(\"%s\", input);` forces `printf` to treat `input` strictly as string data, ignoring any format specifiers it contains, eliminating the vulnerability.",
        "Specify a static format string literal as the first argument, passing the user variable as the second parameter.",
        "flowchart LR\n  Vun[\"printf(input) (Exploitable)\"] --> Fix[\"printf(\\\"%s\\\", input) (Secure)\"]"
    ))
    raw_questions.append((
        "format-string-bugs", "Easy", "MCQ",
        "Which of the following specifiers in a format string bug allows an attacker to print string content at an arbitrary memory address?",
        ["%s                                  ", "%x                                  ", "%d                                  ", "%p                                  "],
        "A",
        "`%s` treats the stack value as a pointer address and attempts to print the null-terminated string at that address. If the attacker controls the stack pointer value, they can read arbitrary memory.",
        "Identify the specifier designed to format null-terminated character arrays.",
        None
    ))
    raw_questions.append((
        "format-string-bugs", "Hard", "MCQ",
        "In a Socratic essay analyzing security, why can modern compilers flag format string vulnerabilities as compile-time warnings?",
        ["They check if the format string argument is a constant literal", "They inspect if the program uses virtual memory page tables     ", "They verify if the variable was allocated in kernel mode stack     ", "They check if the printf function returns a negative integer index "],
        "A",
        "Modern compilers (like GCC with `-Wformat` and `-Wformat-security`) analyze `printf` calls. If the format argument is not a string literal and lacks additional arguments, they raise warnings.",
        "How can the compiler statically verify that the format specifiers match the types of the passed arguments?",
        None
    ))
    raw_questions.append((
        "format-string-bugs", "Medium", "MCQ",
        "What is the danger of format string vulnerabilities in setuid root binaries?<br>[EXAMINE DIAGRAM]",
        ["They allow local users to write to root memory and get shell access", "They corrupt the virtual memory page tables of the root process      ", "They disable the CPU scheduler and freeze multitasking operations    ", "They force the CPU dispatcher to change mode bit to 1 permanently    "],
        "A",
        "If a program has setuid root privileges, it runs with root authorization. A format string bug allows the attacker to corrupt memory and hijack execution, running arbitrary commands as root.",
        "Consider what happens when memory corruption allows hijacking the execution control of a privileged binary.",
        "flowchart TD\n  SUID[\"Vulnerable SUID Root Binary\"] -->|Format String Exploit| Hijack[\"Overwrite return address\"]\n  Hijack -->|Spawn Shell| Root[\"Root privilege shell access (Exploited)\"]"
    ))
    raw_questions.append((
        "format-string-bugs", "Easy", "TrueFalse",
        "True or False: Format string bugs are caused by hardware architecture flaws in the CPU register design.",
        ["True", "False"],
        "B",
        "Format string bugs are purely software software bugs. They are caused by unsafe API design and improper validation of user inputs in application code.",
        "Are format string bugs caused by transistor failures or bad C coding habits?",
        None
    ))
    raw_questions.append((
        "format-string-bugs", "Medium", "MCQ",
        "Compare format string bugs with buffer overflows.<br>[EXAMINE DIAGRAM]",
        ["Format bugs read/write stack via specifiers; overflows write past array", "Format bugs overwrite heap; overflows overwrite CPU register files    ", "Format bugs require swap disk space; overflows require page tables      ", "Format bugs execute in kernel mode; overflows execute in user space      "],
        "A",
        "Format string bugs exploit `printf` parameters to read/write stack memory. Buffer overflows write excess data directly past array bounds, physically overwriting adjacent stack memory.",
        "Compare parameter-driven stack parsing vs data buffer overflow memory overwrite.",
        "flowchart LR\n  Format[\"Format Bug: Exploit printf specifiers to parse/write stack memory\"]\n  Overflow[\"Buffer Overflow: Direct memory write past array bounds\"]"
    ))

    # 20. command-injections (9 questions)
    raw_questions.append((
        "command-injections", "Medium", "MCQ",
        "An essay question asks you to trace a command injection vulnerability. Which C code block is unsafe?<br>[EXAMINE DIAGRAM]",
        ["char cmd[100]; sprintf(cmd, \"cat %s\", input); system(cmd);", "char cmd[100]; snprintf(cmd, 100, \"cat %s\", input); execve(...);", "char *args[] = {\"/bin/cat\", input, NULL}; execve(args[0], args, env);", "char cmd[100]; strncpy(cmd, \"cat \", 100);                    "],
        "A",
        "The first block constructs a command string `cat [input]` and runs it via `system()`. If `input` contains shell metacharacters (e.g. `; rm -rf /`), the shell executes them sequentially.",
        "Look for the snippet that passes a dynamically concatenated command string directly to the shell executor `system()`.",
        "flowchart TD\n  In[\"Input: file.txt; id\"]\n  In -->|sprintf| Cmd[\"Command: cat file.txt; id\"]\n  Cmd -->|system()| Shell[\"Shell executes: 1. cat file.txt 2. id\"]\n  Shell --> Inject[\"Command Injection Success\"]"
    ))
    raw_questions.append((
        "command-injections", "Hard", "MCQ",
        "Trace execution: A program executes `system(\"ping -c 1 [input]\")`. The input string is `\"127.0.0.1; whoami\"`. What is the result?",
        ["The program pings localhost, then prints the active user name", "The program crashes with a segment write validation exception ", "The CPU scheduler switches the process to the blocked queue  ", "The ping command returns an error and execution terminates    "],
        "A",
        "The shell parses the semicolon `;` as a command separator. It executes `ping -c 1 127.0.0.1`, completes it, and then executes the injected command `whoami`, printing the active user.",
        "Think about how shell interpreters execute strings containing metacharacters like semicolons.",
        None
    ))
    raw_questions.append((
        "command-injections", "Easy", "TrueFalse",
        "True or False: The exec-family system calls (like `execve()`) are safe from shell command injection because they execute binaries directly without a shell interpreter.",
        ["True", "False"],
        "A",
        "Yes, `execve` executes the binary directly. Parameters are passed as an array of independent strings, not parsed by a shell, preventing command injection.",
        "Does execve invoke a shell parser (like /bin/sh) to execute the command argument list?",
        None
    ))
    raw_questions.append((
        "command-injections", "Medium", "MCQ",
        "How should developers rewrite a program to execute a system command securely?<br>[EXAMINE DIAGRAM]",
        ["Avoid system() and use execve() with argument arrays directly", "Use sprintf() with snprintf() to validate command lengths     ", "Disable preemption interrupts during the system() execution call", "Map the command input buffer directly to the virtual page table "],
        "A",
        "Avoid `system()`. Use `fork()` and `execve()` (or helper APIs like `execvp`) to pass arguments as separate strings directly to the loader, bypassing the shell.",
        "Identify the safe alternative to system() that separates the executable path from arguments.",
        "flowchart LR\n  Unsafe[\"system(\\\"cat \\\" + input)\"] -->|Shell Parser| Vulnerable[\"Vulnerable to Injection\"]\n  Safe[\"execve(\\\"/bin/cat\\\", args)\"] -->|No Shell| Secure[\"Secure execution\"]"
    ))
    raw_questions.append((
        "command-injections", "Easy", "MCQ",
        "Which of the following shell metacharacters is commonly used in command injection attacks to execute a second command after the first?",
        ["Semicolon (;), Pipe (|), or Ampersand (&)   ", "Asterisk (*), Question mark (?), or Hash (#)", "Backslash (\\), Slash (/), or Period (.)     ", "Dollar symbol, Percent (%), or At (@)       "],
        "A",
        "Semicolons, pipes, and ampersands are command delimiters or control operators in shell syntax, allowing execution of sequential or parallel commands.",
        "Select the shell characters used to chain multiple commands on a single terminal line.",
        None
    ))
    raw_questions.append((
        "command-injections", "Hard", "MCQ",
        "In a Socratic essay analyzing input validation, why is blocklisting (removing bad characters) less secure than allowlisting (accepting good characters)?",
        ["It is easy to miss obscure characters or bypass rules via encoding", "It requires more physical virtual memory frames page table space", "It forces the compiler to disable instruction cache optimizations  ", "It runs in kernel mode space which is vulnerable to memory faults "],
        "A",
        "Blocklisting is fragile. Attackers can bypass filters using alternative metacharacters (e.g. backticks, command substitution shell syntax, newlines, IFS spacing) or hex/unicode encoding that the filter fails to catch.",
        "Consider which method is more thorough: filtering out infinite possible bad inputs vs explicitly permitting a known safe set.",
        None
    ))
    raw_questions.append((
        "command-injections", "Medium", "MCQ",
        "What is the role of input sanitization in command injection defense?<br>[EXAMINE DIAGRAM]",
        ["Validates and strips metacharacters before processing the string", "Encrypts input buffers using process stack frame registers    ", "Swaps the input page memory frames to secondary storage disks  ", "Directs the CPU dispatcher to run the process in user mode 1  "],
        "A",
        "Sanitization verifies that the input matches expected formats (like alphanumeric only) and removes or escapes metacharacters before they can reach shell executors.",
        "What must the program do to user inputs before placing them in dynamic execution strings?",
        "flowchart TD\n  In[\"User Input: file.txt; id\"] --> San[\"Input Validator Allowlist (alphanumeric/dot)\"]\n  San -->|Invalid characters| Reject[\"Reject Input (Secure)\"]\n  San -->|Valid| Execute[\"Proceed (Secure)\"]"
    ))
    raw_questions.append((
        "command-injections", "Easy", "TrueFalse",
        "True or False: Command injection vulnerabilities are only dangerous if the application is running with root or administrative privileges.",
        ["True", "False"],
        "B",
        "Command injection is dangerous at any privilege level. An attacker can run commands with the authorization of the application user (e.g. reading database files, editing files, connecting to networks).",
        "Can an attacker steal user data or delete application files if the program runs with standard user privileges?",
        None
    ))
    raw_questions.append((
        "command-injections", "Medium", "MCQ",
        "Compare command injection with SQL injection.<br>[EXAMINE DIAGRAM]",
        ["Command injection targets shells; SQL targets database engines ", "Command injection targets heap; SQL targets CPU register files  ", "Command injection requires swap space; SQL requires page tables ", "Command injection runs in kernel space; SQL runs in user space  "],
        "A",
        "Command injection exploits shell parsers to execute system commands. SQL injection exploits database queries to run unauthorized database operations.",
        "Compare the target interpreters: a command line shell vs a database query engine.",
        "flowchart LR\n  Cmd[\"Command Injection: Target OS Shell (system)\"]\n  SQL[\"SQL Injection: Target Database Query (SQL Server)\"]"
    ))

    # 21. modular-design-abstraction (9 questions)
    raw_questions.append((
        "modular-design-abstraction", "Medium", "MCQ",
        "An essay exam asks you to define high cohesion and low coupling. Which of the following describes this ideal design?<br>[EXAMINE DIAGRAM]",
        ["Modules have a single focus; dependencies between modules are low", "Modules perform many tasks; dependencies between modules are high", "Modules share stack memory frames; coupling is managed by timers", "Modules run in kernel mode; coupling is managed by page tables  "],
        "A",
        "High cohesion means a module does one thing well (focused responsibilities). Low coupling means modules are independent with minimal interconnectivity, making the system modular and maintainable.",
        "Think about what makes a code module easy to test, reuse, and modify without affecting other files.",
        "flowchart TD\n  subgraph Highly Cohesive Modules (Low Coupling)\n    M1[\"Module 1 (File I/O Only)\"]\n    M2[\"Module 2 (Math Only)\"]\n    M1 -.->|Few Dependencies| M2\n  end"
    ))
    raw_questions.append((
        "modular-design-abstraction", "Hard", "MCQ",
        "Trace driver abstraction in C: A driver struct contains: `struct dev { void (*init)(void); int (*write)(char*, int); };`. What is the benefit of using this struct of function pointers?",
        ["It allows swapping physical hardware without changing caller code  ", "It automatically executes the driver functions in parallel CPU cores", "It stores driver execution stacks directly in the CPU register file", "It bypasses the virtual memory translation page table checks in RAM"],
        "A",
        "This is a Hardware Abstraction Layer (HAL). The application calls `dev->write()`. Swapping the driver struct (e.g. from UART to USB) changes the function pointer targets without modifying the application code.",
        "Think about how operating systems manage diverse hardware (like different network cards) using uniform APIs.",
        None
    ))
    raw_questions.append((
        "modular-design-abstraction", "Easy", "TrueFalse",
        "True or False: Low coupling makes software easier to maintain because changes to one module have minimal impact on other modules.",
        ["True", "False"],
        "A",
        "Yes, low coupling isolates changes. Modifying the internal logic of module A does not break module B if they interact through a clean, decoupled interface.",
        "If class A accesses the private fields of class B directly, is coupling high or low?",
        None
    ))
    raw_questions.append((
        "modular-design-abstraction", "Medium", "MCQ",
        "What is the purpose of a Hardware Abstraction Layer (HAL) in operating system design?<br>[EXAMINE DIAGRAM]",
        ["Hides physical hardware differences behind a consistent kernel API", "Translates virtual page numbers directly to physical frame offsets ", "Saves process stack registers to the CPU control file on timers   ", "Buffers print characters on secondary disk swap space allocations   "],
        "A",
        "A HAL is a layer of software that abstracts hardware board layouts, bus registers, and controllers, providing a uniform API to the upper layers of the kernel.",
        "Think about how a single OS kernel binary can run on different motherboards with different chipsets.",
        "flowchart TD\n  Kernel[\"Kernel Subsystems (Process, File, Network)\"]\n  Kernel --> HAL[\"Hardware Abstraction Layer (HAL)\"]\n  HAL --> HW1[\"Motherboard A Chipset\"]\n  HAL --> HW2[\"Motherboard B Chipset\"]"
    ))
    raw_questions.append((
        "modular-design-abstraction", "Easy", "MCQ",
        "Which of the following describes 'information hiding' in software engineering?",
        ["Restricting access to internal module details via public interfaces", "Hiding program source code files from the operating system kernel  ", "Encrypting memory variables to protect them from format string bugs", "Storing process control blocks on swapped secondary storage disks   "],
        "A",
        "Information hiding isolates design decisions by making module internals private (inaccessible to callers) and exposing only what is necessary through a public interface.",
        "What concept is supported by declaring class variables private and exposing them via public properties?",
        None
    ))
    raw_questions.append((
        "modular-design-abstraction", "Hard", "MCQ",
        "In system programming, how do modular design principles support software safety and testing?",
        ["They allow isolating modules to test them under simulated environments", "They completely eliminate memory stack overflow bugs at compile time  ", "They force all processes to execute in CPU privilege mode level 0   ", "They store all data variables inside local register files in the CPU "],
        "A",
        "Modular design enables unit testing. By isolating a module (like a file system parser) behind an interface, developers can mock dependencies and test it in isolation, finding bugs faster.",
        "Think about the benefit of being able to test a module without running the entire operating system.",
        None
    ))
    raw_questions.append((
        "modular-design-abstraction", "Medium", "MCQ",
        "How is abstraction represented in layered operating system designs?<br>[EXAMINE DIAGRAM]",
        ["Each layer uses services of the lower layer and hides implementation", "Each layer executes in parallel on separate physical processor cores ", "Each layer has its own virtual memory page table directory in RAM  ", "Each layer disables hardware interrupts during stack frame changes   "],
        "A",
        "In a layered OS, layer N provides services to layer N+1 using interfaces, while hiding its internal implementation details and the details of all layers below it.",
        "Consider the hierarchy: how do higher layers view lower layers in a layered system?",
        "flowchart TD\n  L3[\"Layer 3 (AUI)\"] -->|Calls| L2[\"Layer 2 (API)\"]\n  L2 -->|Calls| L1[\"Layer 1 (Drivers)\"]\n  L1 -->|Calls| L0[\"Layer 0 (Hardware)\"]"
    ))
    raw_questions.append((
        "modular-design-abstraction", "Easy", "TrueFalse",
        "True or False: High coupling is a desirable property in software architecture because it indicates that components are tightly connected.",
        ["True", "False"],
        "B",
        "High coupling is undesirable. It means components are highly dependent on each other, which means changes to one component will ripple through and break other components.",
        "If you change a function signature in module A, and you have to modify 50 other files, is coupling high or low?",
        None
    ))
    raw_questions.append((
        "modular-design-abstraction", "Medium", "MCQ",
        "Explain the benefit of abstracting I/O devices as files in Unix-like operating systems.<br>[EXAMINE DIAGRAM]",
        ["Allows using uniform system calls (read, write) for all devices", "Permits user applications to bypass kernel privilege mode checks  ", "Stores all peripheral data in local register files inside the CPU", "Automatically encrypts I/O data to prevent buffer overflow attacks"],
        "A",
        "By treating devices (keyboards, terminals, disks, network sockets) as files, Unix allows applications to use the same uniform system calls (`open`, `read`, `write`, `close`) to interact with any device.",
        "Think about the 'everything is a file' philosophy in Unix.",
        "flowchart TD\n  App[\"Application Code\"] -->|write()| VFS[\"Virtual File System (VFS) API\"]\n  VFS -->|Redirects| D1[\"Regular File on Disk\"]\n  VFS -->|Redirects| D2[\"UART Terminal Device\"]\n  VFS -->|Redirects| D3[\"TCP Network Socket\"]"
    ))

    # Let's count how many questions we have generated
    print(f"[i] Raw questions defined: {len(raw_questions)}")
    # We must ensure we have EXACTLY 200 questions.
    # Total defined above: 11 * 10 + 10 * 9 = 200 questions!
    # That is exactly 200 questions! Perfect!

    # Let's write them into the subject structure
    for idx, (cat, diff, qtype, qtext, opts, ans, expl, hint, diag) in enumerate(raw_questions, 1):
        q_id = f"q-sp-{idx}"
        
        # Build options with same-length padding (only for MCQ)
        if qtype == "MCQ":
            formatted_opts = make_same_length_options(opts)
        else:
            # For True/False, use standard exact "True" and "False" values (not padded)
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
            
        subject["questions"].append(q_obj)

    # Let's output to JSON file
    output_dir = os.path.join("public", "examples")
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, "system-programming.json")
    
    # Save as minified, single-line JSON as requested
    with open(output_path, 'w', encoding='utf-8') as f:
        # No extra whitespace or indentation
        json.dump(subject, f, separators=(',', ':'), ensure_ascii=False)
        
    print(f"[+] Successfully generated System Programming subject at: {output_path}")
    print(f"    Total Questions: {len(subject['questions'])}")
    print(f"    Total Flashcards: {len(subject['flashcards'])}")
    print(f"    Total Terminology Categories: {len(subject['terminology'])}")
    print(f"    Total Achievements: {len(subject['achievements'])}")

if __name__ == '__main__':
    generate_subject()
