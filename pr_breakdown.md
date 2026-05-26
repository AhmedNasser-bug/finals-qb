# Structural Breakdown

## `lib/subject-persistence.ts`
- `validateQuestionsArray`: Flattened the deep loop iterations and nested `if`s checking for option label matching by replacing the inner loop with a `some` functional call, reducing indentation.

## `lib/game-engine.tsx`
- `ACTION_HANDLERS.TICK`: Refactored to eliminate the nested `if-else` tree for `globalTimeLimit > 0` by using early returns.

## `lib/achievement-logic.ts`
- `all_categories` in `CONDITION_EVALUATORS`: Flattened the inner `if` statements inside the loop by using an early `continue` instead of nesting.

## `lib/logger.ts`
- `maskData`: Flattened the `if (data instanceof Error)` block by extracting the `Object.getOwnPropertyNames` filtering into a variable instead of nesting `if` statements within the `for` loop.
