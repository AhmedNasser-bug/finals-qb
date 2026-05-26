# State Architecture

State is divided into three domains:

1. **Achievement Engine (`AchievementProvider`)**
   - Lives at the app root, survives navigation.
   - Responsible for tracking and evaluating unlocking conditions.
2. **Global UI/Subject State (`HomeScreen`)**
   - Owns `view`, `runs`, `selectedMode`, `config`, and `showGallery`.
   - Passes `runs` to `GameRunner` for accurate achievement history evaluation.
3. **Game Engine (`GameEngineProvider`)**
   - Ephemeral. Only mounted during gameplay.
   - Contains a reducer handling the game cycle, question pooling, score tracking, and time.