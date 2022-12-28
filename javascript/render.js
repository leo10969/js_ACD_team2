export function render(ctx, graph) {
    ctx.clearRect(0, 0, 1000, 600);
    ctx.strokeStyle = "gray";

    // Calculate force
    graph.calcForce();

    // Draw links
    graph.drawLinks(ctx);

    // Draw nodes
    graph.drawNodes(ctx);

    Object.keys(graph.nodes).forEach(function(key){
        if(graph.nodes[key].x > 900 && graph.nodes[key].y > 500){
            graph.nodes[key].x -= graph.nodes[key].r; graph.nodes[key].y -= graph.nodes[key].r;
        }
        if(graph.nodes[key].x < 100 && graph.nodes[key].y < 100){
            graph.nodes[key].x += graph.nodes[key].r; graph.nodes[key].y += graph.nodes[key].r;
        }
        if(graph.nodes[key].x > 900 && graph.nodes[key].y < 100){
            graph.nodes[key].x -= graph.nodes[key].r; graph.nodes[key].y += graph.nodes[key].r;
        }
        if(graph.nodes[key].x < 100 && graph.nodes[key].y > 500){
            graph.nodes[key].x += graph.nodes[key].r; graph.nodes[key].y -= graph.nodes[key].r;
        }
    })
}

/*
for (var i = 0; i < 6; i++){
    setInterval(render, 30, ctxlist[i], GraphList.graphAt(i));
}
*/