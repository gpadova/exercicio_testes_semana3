import { faker } from "@faker-js/faker";
import app from "app";
import httpStatus from "http-status";
import { beforeEach } from "node:test";
import supertest from "supertest"
import { insertConsole } from "../factories/consoles-factories";
import { cleanDb } from "../helpers";


const server = supertest(app);

beforeEach(async () => {
    await cleanDb();
})

describe("GET /consoles endpoint", () => {
    it("Testing the format of the response", async () => {
        const response = await server.get("/consoles")
        expect(response.status).toBe(200)
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(Number),
                    name: expect.any(String)
                })
            ])
        )        
    });
});

describe("GET /consoles/id route", () => {
    it("Send a invalid id in the req", async () => {
        const response = await server.get("/consoles/1")
        expect(response.status).toBe(200)
    });

    it("Right call with previous creation of an console", async () => {
        const console = await insertConsole();
        const response = await server.get(`/consoles/${console.id}`);
        expect(response.body).toEqual(
            expect.objectContaining({
                id: expect.any(Number),
                name: expect.any(String)
        }))
    });
});

describe("Test POST /consoles route", () => {
    it("Send an invalid body", async () => {
        const obj = {nameOfObject: 3}
        const response = await server.post("/consoles").send(obj);
        expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY)
    });
    it("Create a console with the same name twice", async () => {
        const console = await insertConsole();
        const obj = {name: console.name}

        const response = await server.post("/consoles").send(obj);
        expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY)
    });
    it("Creating a valid console", async () => {
        const obj = {name: faker.commerce.department()}
        const response = await server.post("/consoles").send(obj);

        expect(response.status).toBe(httpStatus.CREATED)
    });
});