import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import prisma from "../src/lib/prisma";
import { AuthService } from "../src/service/auth/authService";
import { CreateAuthService } from "../src/service/auth/createAuthService";
import { DetailsService } from "../src/service/auth/detailsService";
import { CategoryService } from "../src/service/category/categoryService";
import { CreateCategoryService } from "../src/service/category/createCategoryService";
import { DeleteCategoryService } from "../src/service/category/deleteCategoryService";
import { ListCategoryService } from "../src/service/category/listCategoryService";
import { UpdateCategoryService } from "../src/service/category/updateCategoryService";
import { CreateExerciseService } from "../src/service/exercise/createExerciseService";
import { DeleteExerciseService } from "../src/service/exercise/deleteExerciseService";
import { UpdateExerciseService } from "../src/service/exercise/updateExerciseService";
import { CreateSubscriptionService } from "../src/service/subscription/createSubscriptionService";
import { DeleteSubscriptionService } from "../src/service/subscription/deleteSubscriptionService";
import { GetSubscriptionService } from "../src/service/subscription/getSubscriptionService";
import { UpdateSubscriptionService } from "../src/service/subscription/updateSubscriptionService";

type ModelMethod = "findFirst" | "findMany" | "create" | "update" | "delete";
const original = new Map<string, unknown>();

function stub(model: "user" | "category" | "exercise" | "subscription", method: ModelMethod, implementation: (...args: any[]) => unknown) {
    const target = prisma[model] as unknown as Record<string, unknown>;
    const key = `${model}.${method}`;
    if (!original.has(key)) original.set(key, target[method]);
    target[method] = implementation;
}

afterEach(() => {
    for (const [key, value] of original) {
        const [model, method] = key.split(".") as ["user" | "category" | "exercise" | "subscription", ModelMethod];
        (prisma[model] as unknown as Record<string, unknown>)[method] = value;
    }
    original.clear();
});

const rejectedWith = async (action: () => Promise<unknown>, message: string) => {
    await assert.rejects(action, { message });
};

describe("serviÃ§os de assinatura", () => {
    const data = { status: "active", plan: "MONTHLY" as any, priceId: "price1", userId: "u1" };
    const subscription = { id: "s1", ...data };

    it("cria assinatura e valida todos os campos necessÃ¡rios", async () => {
        stub("subscription", "create", async () => subscription);
        assert.deepEqual(await new CreateSubscriptionService().execute(data), subscription);
        for (const field of ["status", "plan", "priceId", "userId"] as const) {
            await rejectedWith(() => new CreateSubscriptionService().execute({ ...data, [field]: "" } as any), "Status, plan, priceId, and userId are required");
        }
        stub("subscription", "create", async () => { throw new Error("db"); });
        await rejectedWith(() => new CreateSubscriptionService().execute(data), "Error creating subscription");
    });

    it("consulta assinatura e trata user ID ausente/falha", async () => {
        stub("subscription", "findFirst", async () => subscription);
        assert.deepEqual(await new GetSubscriptionService().execute("u1"), subscription);
        await rejectedWith(() => new GetSubscriptionService().execute(""), "User ID is required");
        stub("subscription", "findFirst", async () => null);
        assert.equal(await new GetSubscriptionService().execute("u1"), null);
        stub("subscription", "findFirst", async () => { throw new Error("db"); });
        await rejectedWith(() => new GetSubscriptionService().execute("u1"), "Error fetching subscription");
    });

    it("atualiza e exclui assinatura existente, tratando ausÃªncia e erros", async () => {
        stub("subscription", "findFirst", async () => subscription);
        stub("subscription", "update", async () => subscription);
        stub("subscription", "delete", async () => subscription);
        assert.deepEqual(await new UpdateSubscriptionService().execute({ id: "s1", userId: "u1", status: "paused" }), subscription);
        assert.deepEqual(await new DeleteSubscriptionService().execute({ id: "s1", userId: "u1" }), subscription);
        await rejectedWith(() => new UpdateSubscriptionService().execute({ id: "", userId: "u1" }), "Subscription ID and user ID are required");
        await rejectedWith(() => new DeleteSubscriptionService().execute({ id: "s1", userId: "" }), "Subscription ID and user ID are required");
        stub("subscription", "findFirst", async () => null);
        await rejectedWith(() => new UpdateSubscriptionService().execute({ id: "s1", userId: "u1" }), "Error updating subscription");
        await rejectedWith(() => new DeleteSubscriptionService().execute({ id: "s1", userId: "u1" }), "Error deleting subscription");
        stub("subscription", "findFirst", async () => subscription);
        stub("subscription", "update", async () => { throw new Error("db"); });
        stub("subscription", "delete", async () => { throw new Error("db"); });
        await rejectedWith(() => new UpdateSubscriptionService().execute({ id: "s1", userId: "u1" }), "Error updating subscription");
        await rejectedWith(() => new DeleteSubscriptionService().execute({ id: "s1", userId: "u1" }), "Error deleting subscription");
    });
});


