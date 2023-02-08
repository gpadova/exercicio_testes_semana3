import prisma from "config/database";
import { faker } from "@faker-js/faker"

export async function insertConsole() {
    const fake = faker
    return prisma.console.create({
        data: {
            name: faker.name.jobTitle()
        }
    })
}