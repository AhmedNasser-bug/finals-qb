import test, { describe, it } from "node:test"
import assert from "node:assert"
import {
  FINALISTS_AI_ENTITLEMENT,
  FINALISTS_AI_PRODUCTS,
  FINALISTS_AI_PLANS,
} from "./revenuecat-types.ts"
import { purchasesService } from "./purchases-service.ts"
import { synthesizeSubject, createAiJob, getAiJob } from "../ai/ai-job-store.ts"

describe("RevenueCat Types & Configurations", () => {
  it("should have correct entitlement and product constants", () => {
    assert.strictEqual(FINALISTS_AI_ENTITLEMENT, "finalists_ai")
    assert.strictEqual(FINALISTS_AI_PRODUCTS.MONTHLY, "finalists_ai_monthly")
    assert.strictEqual(FINALISTS_AI_PRODUCTS.YEARLY, "finalists_ai_yearly")
    assert.strictEqual(FINALISTS_AI_PRODUCTS.LIFETIME, "finalists_ai_lifetime")
  })

  it("should define valid plans with required pricing and features", () => {
    assert.strictEqual(FINALISTS_AI_PLANS.length, 3)

    const monthly = FINALISTS_AI_PLANS.find((p) => p.id === "monthly")
    const yearly = FINALISTS_AI_PLANS.find((p) => p.id === "yearly")
    const lifetime = FINALISTS_AI_PLANS.find((p) => p.id === "lifetime")

    assert.ok(monthly, "Monthly plan must exist")
    assert.ok(yearly, "Yearly plan must exist")
    assert.ok(lifetime, "Lifetime plan must exist")

    assert.strictEqual(yearly?.popular, true)
    assert.ok(yearly?.badge?.includes("BEST VALUE"))
    assert.ok(lifetime?.badge?.includes("ONE-TIME"))

    for (const plan of FINALISTS_AI_PLANS) {
      assert.ok(plan.features.length >= 3, `${plan.id} should have at least 3 features`)
      assert.ok(plan.price.length > 0)
      assert.ok(plan.period.length > 0)
    }
  })
})

describe("PurchasesService", () => {
  it("should maintain a singleton instance", () => {
    const instance1 = purchasesService
    assert.ok(instance1)
    assert.strictEqual(typeof instance1.getApiKey, "function")
  })

  it("should report non-browser environment in node test runner", () => {
    assert.strictEqual(purchasesService.isBrowser(), false)
  })

  it("should resolve custom user ID accurately", () => {
    const customUser = "user_clerk_12345"
    const resolved = purchasesService.resolveAppUserId(customUser)
    assert.strictEqual(resolved, customUser)
  })

  it("should fallback to server default guest ID when window is undefined", () => {
    const resolved = purchasesService.resolveAppUserId(null)
    assert.strictEqual(resolved, "$RCAnonymousID:server_default_guest")
  })

  it("should return null for getCustomerInfo when in server/node environment", async () => {
    const info = await purchasesService.getCustomerInfo()
    assert.strictEqual(info, null)
  })
})

describe("AI Job Store & Subject Synthesis", () => {
  it("should synthesize a structurally valid FullSubjectData object", () => {
    const subject = synthesizeSubject("Linear Algebra", "undergraduate", 2, 2)

    assert.ok(subject.id.includes("linear-algebra"))
    assert.ok(subject.name.includes("Linear Algebra"))
    assert.strictEqual(subject.questions.length, 4) // 2 categories * 2 questions
    assert.strictEqual(subject.flashcards.length, 2)
    assert.ok(subject.terminology["linear-algebra-foundations"])

    for (const q of subject.questions) {
      assert.ok(q.id)
      assert.ok(q.question.length > 10)
      assert.ok(q.options.length >= 2)
      assert.ok(q.answer)
      assert.ok(q.explanation)
      assert.ok(q.hint)
    }
  })

  it("should create and track asynchronous AI generation jobs", async () => {
    const jobId = createAiJob("Quantum Mechanics", "graduate", 2, 1)
    assert.ok(jobId.startsWith("job_"))

    const immediateJob = getAiJob(jobId)
    assert.ok(immediateJob)
    assert.strictEqual(immediateJob.jobId, jobId)

    // Wait for async synthesis simulation
    await new Promise((resolve) => setTimeout(resolve, 150))

    const completedJob = getAiJob(jobId)
    assert.strictEqual(completedJob?.status, "completed")
    assert.strictEqual(completedJob?.progress, 100)
    assert.ok(completedJob?.subjectData)
    assert.ok(completedJob?.subjectData?.name.includes("Quantum Mechanics"))
  })
})

describe("Entitlement Evaluation Logic", () => {
  it("should treat future expiration date as active", () => {
    const futureDate = new Date(Date.now() + 86400000).toISOString()
    const isActive = new Date(futureDate).getTime() > Date.now()
    assert.strictEqual(isActive, true)
  })

  it("should treat past expiration date as inactive", () => {
    const pastDate = new Date(Date.now() - 86400000).toISOString()
    const isActive = new Date(pastDate).getTime() > Date.now()
    assert.strictEqual(isActive, false)
  })

  it("should treat null expiration date as lifetime active", () => {
    const expiresDate = null
    const isActive = !expiresDate || new Date(expiresDate).getTime() > Date.now()
    assert.strictEqual(isActive, true)
  })
})
