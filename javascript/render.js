import {Changes} from "./diagram.js";

export function render(ctx, graph, isShown=false) {
    ctx.clearRect(0, 0, 1000, 600);
    ctx.strokeStyle = "gray";

    // Calculate force
    graph.calcForce();

    // Draw links
    graph.drawLinks(ctx);

    // Draw nodes
    graph.drawNodes(ctx);

    // HighLights Nodes
    if (isShown) {
        Changes.highlightNewNodes(ctx);
    }
}

// export function renderThumnail(ctx, graph){

// }