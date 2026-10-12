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

describe("AuthService", () => {
    it("retorna undefined quando email ou senha estÃ£o ausentes", async () => {
        assert.equal(await new AuthService().execute({ email: "", password: "senha" }), undefined);
        assert.equal(await new AuthService().execute({ email: "a@b.com", password: "" }), undefined);
    });

    it("gera token para credenciais vÃ¡lidas", async () => {
        process.env.JWT_SECRET = "test-secret";
        stub("user", "findFirst", async () => ({ id: "u1", name: "Ana", email: "ana@test.com", password: await require("bcrypt").hash("senha", 4) }));
        const result = await new AuthService().execute({ email: "ana@test.com", password: "senha" });
        assert.equal(result?.name, "Ana");
        assert.equal(result?.email, "ana@test.com");
        assert.ok(result?.token);
    });

    it("converte usuÃ¡rio inexistente e senha invÃ¡lida em erro de autenticaÃ§Ã£o", async () => {
        stub("user", "findFirst", async () => null);
        await rejectedWith(() => new AuthService().execute({ email: "x@test.com", password: "senha" }), "Error authenticating user");
        stub("user", "findFirst", async () => ({ id: "u1", name: "Ana", email: "ana@test.com", password: "hash-invalido" }));
        await rejectedWith(() => new AuthService().execute({ email: "ana@test.com", password: "senha" }), "Error authenticating user");
    });
});

describe("CreateAuthService e DetailsService", () => {
    it("cria usuÃ¡rio com senha protegida e recusa email jÃ¡ cadastrado", async () => {
        stub("user", "findFirst", async () => null);
        stub("user", "create", async ({ data }: any) => ({ id: "u1", ...data }));
        const created = await new CreateAuthService().execute({ email: "ana@test.com", name: "Ana", password: "senha" });
        assert.equal(created.name, "Ana");
        assert.notEqual(created.password, "senha");
        assert.equal(await require("bcrypt").compare("senha", created.password), true);

        stub("user", "findFirst", async () => ({ id: "u1" }));
        await rejectedWith(() => new CreateAuthService().execute({ email: "ana@test.com", name: "Ana", password: "senha" }), "User already exists");
    });

    it("mapeia falha de criaÃ§Ã£o e consulta detalhes por ID", async () => {
        stub("user", "findFirst", async () => null);
        stub("user", "create", async () => { throw new Error("db"); });
        await rejectedWith(() => new CreateAuthService().execute({ email: "a@b.com", name: "A", password: "p" }), "Error creating user");
        await rejectedWith(() => new DetailsService().execute(""), "User ID is required");
        stub("user", "findFirst", async () => ({ id: "u1" }));
        assert.deepEqual(await new DetailsService().execute("u1"), { id: "u1" });
        stub("user", "findFirst", async () => { throw new Error("db"); });
        await rejectedWith(() => new DetailsService().execute("u1"), "Error occurred while fetching user details");
    });
});


