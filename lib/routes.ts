import type { Prisma } from "@prisma/client";

export async function writeLinearRoute(
  tx: Prisma.TransactionClient,
  routeId: string,
  cityName: string,
  attractionIds: string[],
) {
  await tx.sightseeingRouteEdge.deleteMany({ where: { routeId } });
  await tx.sightseeingRouteNode.deleteMany({ where: { routeId } });

  const nodes = [];
  nodes.push(
    await tx.sightseeingRouteNode.create({
      data: {
        routeId,
        kind: "start",
        label: `Begin in ${cityName}`,
        sortOrder: 0,
      },
    }),
  );

  for (const [index, attractionId] of attractionIds.entries()) {
    nodes.push(
      await tx.sightseeingRouteNode.create({
        data: {
          routeId,
          kind: "attraction",
          attractionId,
          sortOrder: index + 1,
        },
      }),
    );
  }

  nodes.push(
    await tx.sightseeingRouteNode.create({
      data: {
        routeId,
        kind: "end",
        label: "End of sightseeing",
        sortOrder: attractionIds.length + 1,
      },
    }),
  );

  for (let index = 0; index < nodes.length - 1; index += 1) {
    await tx.sightseeingRouteEdge.create({
      data: {
        routeId,
        sourceNodeId: nodes[index].id,
        targetNodeId: nodes[index + 1].id,
      },
    });
  }
}
