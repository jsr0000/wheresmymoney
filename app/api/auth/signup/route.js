// Move the content from app/signup/route.js to this new location
// Reference lines 1-55 from app/signup/route.js 

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request) {
    try {
        const { email, password, name } = await request.json();

        // Validate input
        if (!email || !password || !name) {
            return new Response(
                JSON.stringify({ error: "Missing required fields" }),
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return new Response(
                JSON.stringify({ error: "Email already registered" }),
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
            },
        });

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;

        return new Response(JSON.stringify(userWithoutPassword), {
            status: 201,
        });
    } catch (error) {
        console.error("Signup error:", error);
        return new Response(
            JSON.stringify({ error: "Error creating user" }),
            { status: 500 }
        );
    }
} 