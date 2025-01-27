import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    try {
        const assets = await prisma.asset.findMany({
            where: { userId: session.user.id },
            orderBy: { timestamp: 'desc' },
            select: {
                id: true,
                name: true,
                quantity: true,
                timestamp: true
            }
        });

        return new Response(JSON.stringify(assets));
    } catch (error) {
        console.error('Error fetching assets:', error);
        return new Response(
            JSON.stringify({ error: "Failed to fetch assets" }),
            { status: 500 }
        );
    }
}

export async function POST(request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const { assets } = await request.json();

    const savedAssets = await Promise.all(
        assets.map(asset =>
            prisma.asset.create({
                data: {
                    name: asset.asset,
                    quantity: asset.quantity,
                    userId: session.user.id
                }
            })
        )
    );

    return new Response(JSON.stringify(savedAssets));
}

