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

describe("serviÃ§os de categoria", () => {
    it("lista categorias do usuÃ¡rio e trata validaÃ§Ã£o/falha", async () => {
        const rows = [{ id: "c1" }];
        stub("category", "findMany", async () => rows);
        assert.deepEqual(await new CategoryService().execute("u1"), rows);
        await rejectedWith(() => new CategoryService().execute(""), "Missing required fields");
        stub("category", "findMany", async () => { throw new Error("db"); });
        await rejectedWith(() => new CategoryService().execute("u1"), "Error fetching categories");
    });

    it("busca categoria com exercÃ­cios, inclusive quando nÃ£o existe", async () => {
        stub("category", "findFirst", async () => null);
        await rejectedWith(() => new ListCategoryService().execute(""), "Missing required fields");
        assert.equal(await new ListCategoryService().execute("c1"), null);
        stub("category", "findFirst", async () => { throw new Error("db"); });
        await rejectedWith(() => new ListCategoryService().execute("c1"), "Error fetching categories");
    });

    it("cria, atualiza e exclui com campos obrigatÃ³rios", async () => {
        const category = { id: "c1", name: "Peito", userId: "u1" };
        stub("category", "create", async () => category);
        stub("category", "update", async () => category);
        stub("category", "delete", async () => category);
        await rejectedWith(() => new CreateCategoryService().execute({ name: "", userId: "u1" }), "Name and userId are required");
        assert.deepEqual(await new CreateCategoryService().execute({ name: "Peito", userId: "u1" }), category);
        await rejectedWith(() => new UpdateCategoryService().execute({ name: "", id: "c1", userId: "u1" }), "Name, id, and userId are required");
        assert.deepEqual(await new UpdateCategoryService().execute({ name: "Peito", id: "c1", userId: "u1" }), category);
        await rejectedWith(() => new DeleteCategoryService().execute({ id: "", userId: "u1" }), "Missing required fields");
        assert.deepEqual(await new DeleteCategoryService().execute({ id: "c1", userId: "u1" }), category);
    });

    it("normaliza falhas do banco em criaÃ§Ã£o, atualizaÃ§Ã£o e exclusÃ£o", async () => {
        stub("category", "create", async () => { throw new Error("db"); });
        stub("category", "update", async () => { throw new Error("db"); });
        stub("category", "delete", async () => { throw new Error("db"); });
        await rejectedWith(() => new CreateCategoryService().execute({ name: "A", userId: "u1" }), "Error creating category");
        await rejectedWith(() => new UpdateCategoryService().execute({ name: "A", id: "c1", userId: "u1" }), "Error updating category");
        await rejectedWith(() => new DeleteCategoryService().execute({ id: "c1", userId: "u1" }), "Error deleting category ");
    });
});


