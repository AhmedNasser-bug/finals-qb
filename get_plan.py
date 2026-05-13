plan = """1. Find where STREAK_TIERS is defined in lib/mold-types.ts.
2. Update the colorClass, glowClass, etc. of MASTERY, OVERCLOCK, PRECISION, LOCKED IN, FOCUSED, and DORMANT in STREAK_TIERS to use design tokens as requested.
3. Update `lib/mold-types.test.ts` to add test cases for `getStreakTierProgress` with correct boundary and calculation tests.
4. Run tests to ensure they pass.
5. Get pre-commit instructions and run them.
6. Submit.
"""
print(plan)
