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

describe("serviÃ§os de exercÃ­cio", () => {
    const input = { name: "Supino", description: "Reto", load: 30, repetition: 10, categoryId: "c1" };

    it("cria exercÃ­cio somente para categoria existente", async () => {
        stub("category", "findFirst", async () => ({ id: "c1" }));
        stub("exercise", "create", async ({ data }: any) => ({ id: "e1", ...data }));
        assert.deepEqual(await new CreateExerciseService().execute(input), { id: "e1", ...input });
        stub("category", "findFirst", async () => null);
        await rejectedWith(() => new CreateExerciseService().execute(input), "Category does not exist");
        stub("category", "findFirst", async () => ({ id: "c1" }));
        stub("exercise", "create", async () => { throw new Error("db"); });
        await rejectedWith(() => new CreateExerciseService().execute(input), "Error creating exercise");
    });

    it("atualiza campos informados e retorna erro para exercÃ­cio inexistente ou falha", async () => {
        const current = { id: "e1", name: "Supino", description: "Reto", load: 30, repetition: 10 };
        stub("exercise", "findFirst", async () => current);
        stub("exercise", "update", async ({ data }: any) => ({ ...current, ...data }));
        assert.deepEqual(await new UpdateExerciseService().execute({ id: "e1", load: 40 }), { ...current, load: 40 });
        await rejectedWith(() => new UpdateExerciseService().execute({ id: "", name: "" }), "At least one field must be provided for update.");
        stub("exercise", "findFirst", async () => null);
        await rejectedWith(() => new UpdateExerciseService().execute({ id: "missing", name: "Novo" }), "Error occurred while updating exercise.");
        stub("exercise", "findFirst", async () => current);
        stub("exercise", "update", async () => { throw new Error("db"); });
        await rejectedWith(() => new UpdateExerciseService().execute({ id: "e1", name: "Novo" }), "Error occurred while updating exercise.");
    });

    it("remove exercÃ­cio existente e cobre ID ausente, inexistente e falha", async () => {
        stub("exercise", "findFirst", async () => ({ id: "e1" }));
        stub("exercise", "delete", async () => ({ id: "e1" }));
        await rejectedWith(() => new DeleteExerciseService().execute(""), "Exercise ID is required.");
        assert.deepEqual(await new DeleteExerciseService().execute("e1"), { id: "e1" });
        stub("exercise", "findFirst", async () => null);
        await rejectedWith(() => new DeleteExerciseService().execute("missing"), "Error deleting exercise");
        stub("exercise", "findFirst", async () => ({ id: "e1" }));
        stub("exercise", "delete", async () => { throw new Error("db"); });
        await rejectedWith(() => new DeleteExerciseService().execute("e1"), "Error deleting exercise");
    });
});


