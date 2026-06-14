# LinkedIn Post: MOLD V2 Technical Challenges & Decisions

> **Copy-Paste Ready Draft**

---

النهاردة عايز اتكلم عن القرارات الهندسية و الـ Over-engineering اللي حصل الساعة 4 الفجر في آخر بروجكت ليا (MOLD V2 / Mastery Protocol) عشان أعمل App مذاكرة مرن وعملي، وميخربش لما أقرر أضيف أي ميزة جديدة أو Subject جديد. 🛠️

الفكرة بدأت لما كنت بتهرب من المذاكرة وقررت أعمل App أحل عليه أسئلة وأكسب سكور وستريك وجوايز تخليني عايز أخلص المادة كلها. بس الموضوع اتطور لإني بنيت **Educational Engine** حقيقي شغال بالكامل Client-Side (Offline-First) من غير أي Server-Side Database تقليدية. 

Here are the 4 main architectural challenges and engineering decisions behind MOLD V2:

### 1. The Pragmatic Scaling Paradox (Consolidation over Sprawl)
كنا مقسمين الـ User Guide لـ 15 فايل منفصلين لتسهيل التطوير. بس ده محذفش الـ Coupling، ده حوّله من Local Coupling واضح لـ **Spatial, Hidden Coupling** (عشان تعدل سطر بتفتح 3 فايلات وتعدي props كتير).
* **The Fix:** رجّعنا تجميعهم في فايل واحد عالي الكفاءة (`guide-overlay.tsx`) باستخدام unexported functions. قللنا الـ Turbopack compile times ووفرنا مجهود التنقل بين الفايلات بدون ما نأثر على الـ UI animations أو الـ Keyboard accessibility.

### 2. The Game Mode Strategy Pattern
الـ App بيدعم 7 طرق مختلفة للمذاكرة (Speedrun, Survival, Hardcore, Practice, Blitz, Full Revision, Flashcards). لو كنا كتبنا شروط كل لعبة جوة الـ React reducer كان زمان الكود بقا Spaghetti ومستحيل تعديله.
* **The Fix:** عزلنا قوانين اللعب باستخدام الـ **Strategy Pattern**. كل Game Mode دلوقتي بيعرف الـ timer بتاعه والـ pool builder وشروط الخسارة لوحده. الـ core reducer مقفول تماماً ضد التعديل، لكنه مفتوح لإضافة أي طور لعب جديد في ثواني.

### 3. Bulletproofing the Client-Side Ingestion Boundary
لإن الـ App شغال Offline-First، واليوزر بيعمل Import لمواد معمولة بـ AI (Gemini أو Claude)، الـ JSON parsing هنا ريسك كبير. غلطة واحدة في الـ formatting من الـ AI ممكن تعمل Storage corruption في المتصفح.
* **The Fix:** بنينا **Zod Schema Adapter** عند البوابة. أي JSON بيحصل له auto-repair للـ backslashes والـ unescaped quotes المكسورة، وبيعدي على `isomorphic-dompurify` ضد الـ XSS قبل ما يتخزن في الـ LocalStorage. الـ App بقا ضد الرصاص. 🛡️

### 4. Stateful Streak Shield (Gamified UX)
مفيش حاجة تضايق الطالب أكتر من إنه يخسر Streak مكون من 20 سؤال صح عشان "غلطة كيبورد" أو typo بسيط في سؤال واحد.
* **The Fix:** بنينا **Streak Shield** جوة الـ state machine. لما بتجاوب 5 أسئلة صح ورا بعض بتكسب درع. لو غلطت في السؤال اللي بعده، الـ reducer بيمتص الصدمة، ويستهلك الدرع، وبيحافظ على الـ Streak بتاعك سليم بدون ما يتصفر!

---

💡 **الخلاصة:** الـ Over-engineering الساعة 4 الفجر ممتع، بس لما تبنيه صح وتتبع الـ Design Patterns والـ WAF principles هو اللي بيخلي الـ Side Project بتاعك سريع، مرن، وقابل للتوسع بسهولة.

🔗 لينك الـ GitHub والـ Architecture Diagrams كاملة في أول تعليق!

#SoftwareArchitecture #NextJS #TypeScript #CleanCode #WebDevelopment #Gamification #EdTech #BuildInPublic #برمجة #هندسة_برمجيات #مذاكرة
