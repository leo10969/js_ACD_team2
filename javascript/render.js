import {ctxlist} from "./input_example.js";
import {GraphList} from "./diagram.js";

function render(ctx, graph) {
    ctx.clearRect(0, 0, 1000, 1000);
    ctx.strokeStyle = "gray";

    // Calculate force
    graph.calcForce();

    // Draw links
    graph.drawLinks(ctx);

    // Draw nodes
    graph.drawNodes(ctx);
}

function setTimeoutForRendering(funcRender, interval, timeout, ctx, graph) {
    var intervalID = setInterval(funcRender, interval, ctx, graph);
    setTimeout( function() {
        clearInterval(intervalID);
    }, timeout);
}

for (var i = 0; i < 3; i++){
    setInterval(render, 30, ctxlist[i], GraphList.graphAt(i));
}