export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    try {
        const charts = await prisma.chart.findMany({
            where: {
                userId: session.user.id
            },
            orderBy: {
                timestamp: 'desc'
            },
            select: {
                id: true,
                name: true,
                chartType: true,
                data: true,
                totalAmount: true,
                timestamp: true
            }
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
        const { name, chartType, data, totalAmount } = await request.json();

        const chart = await prisma.chart.create({
            data: {
                userId: session.user.id,
                name,
                chartType,
                data,
                totalAmount
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