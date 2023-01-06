export function render(ctx, graph) {
    ctx.clearRect(0, 0, 1000, 600);
    ctx.strokeStyle = "gray";

    // Calculate force
    graph.calcForce();

    // Draw links
    graph.drawLinks(ctx);

    // Draw nodes
    graph.drawNodes(ctx);
}

// export function renderThumnail(ctx, graph){

// }