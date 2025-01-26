import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const session = await getServerSession(authOptions);
    
    if (!session) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    try {
        const charts = await prisma.chart.findMany({
            where: { userId: session.user.id },
            orderBy: { timestamp: 'desc' }
        });
        
        return new Response(JSON.stringify(charts));
    } catch (error) {
        console.error('Error fetching charts:', error);
        return new Response(
            JSON.stringify({ error: "Failed to fetch charts" }), 
            { status: 500 }
        );
    }
}

export async function POST(request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    try {
        const { name, chartType, data } = await request.json();
        
        const chart = await prisma.chart.create({
            data: {
                userId: session.user.id,
                name,
                chartType,
                data
            }
        });

        return new Response(JSON.stringify(chart));
    } catch (error) {
        console.error('Error saving chart:', error);
        return new Response(
            JSON.stringify({ error: "Failed to save chart" }), 
            { status: 500 }
        );
    }
} 