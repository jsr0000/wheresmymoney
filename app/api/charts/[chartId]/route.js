import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { prisma } from "@/lib/prisma";

export async function DELETE(request, { params }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    try {
        const { chartId } = params;

        // Verify the chart belongs to the user
        const chart = await prisma.chart.findFirst({
            where: {
                id: chartId,
                userId: session.user.id
            }
        });

        if (!chart) {
            return new Response(JSON.stringify({ error: "Chart not found" }), { status: 404 });
        }

        // Delete the chart
        await prisma.chart.delete({
            where: { id: chartId }
        });

        return new Response(JSON.stringify({ message: "Chart deleted successfully" }));
    } catch (error) {
        console.error('Error deleting chart:', error);
        return new Response(
            JSON.stringify({ error: "Failed to delete chart" }),
            { status: 500 }
        );
    }
} 