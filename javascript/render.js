export function render(ctx, graph) {
    ctx.clearRect(0, 0, 1000, 1000);
    ctx.strokeStyle = "gray";

    // Calculate force
    graph.calcForce();

    // Draw links
    graph.drawLinks(ctx);

    // Draw nodes
    graph.drawNodes(ctx);
}

/*
for (var i = 0; i < 6; i++){
    setInterval(render, 30, ctxlist[i], GraphList.graphAt(i));
}
*/