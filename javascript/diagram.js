import {arrow} from "./arrow.js";
import { main } from "./myslider.js";

// Class
class GroupDict {
    // 30色までに限定
    // property
    groupDict = {}; // private変数にすべきか？
    static #sigletonInstance = null;
    #colorPool = [];
    #isInitialState = true;
    // methods
    static getInstance() {
        if (this.#sigletonInstance == null) {
            this.#sigletonInstance = new GroupDict();
        }
        return this.#sigletonInstance;
    }

    makeColorPool() {
        for (var i = 0; i < 6; i++) {
            for (var j = 0; j < 4; j++) {
                if (j % 4 == 0) {
                    this.#colorPool.push("hsl(" + (i*10 + 190).toString() + ", 100%, 50%)");
                } else if (j % 4 == 1) {
                    this.#colorPool.push("hsl(" + (i*10).toString() + ", 100%, 50%)");
                } else if (j % 4 == 2) {
                    this.#colorPool.push("hsl(" + (i*10 + 250).toString() + ", 100%, 50%)");
                } else {
                    this.#colorPool.push("hsl(" + (i*10 + 60).toString() + ", 100%, 50%)");
                }
            }
        }
    }

    popColorPool() {
        if (this.#isInitialState) {
            this.makeColorPool();
            this.#isInitialState = false;
        }

        if (this.#colorPool == []) {
            console.log("ColorPool is empty!");
            return "black";
        } else {
            var color = this.#colorPool.pop();
            console.log(this.#colorPool);
            return color;
        }
    }

    addGroup(group) {
        var groupName = group.name;
        this.groupDict[groupName] = group;
    }

    searchGroup(groupName) {
        if (groupName in this.groupDict) {
            return this.groupDict[groupName];
        } else {
            return null;
        }
    }
}

class Group {
    name = "";
    size = 0;
    color = "#808080";
    constructor(name) {
        var groupDict = GroupDict.getInstance();
        this.name = name;
        this.color = groupDict.popColorPool();
    }
}

class Node {
    // properties
    name = "";
    group = [];
    rank = 1;
    x = 0;
    y = 0;
    r = 50;
    #cvs;
    isDragged = false;
    // methods
    constructor(name, group=[], rank=1) {
        this.name = name;
        this.setGroup(group);
        this.rank = rank;
        this.x = 500*Math.random() + 150;
        this.y = 500*Math.random() + 150;
        this.r = 40+(5*this.rank);
    }

    setGroup(groupNameList) {
        if (groupNameList.length == 0) {
            groupNameList.push("");
        }

        for (var i = 0; i < groupNameList.length; i++) {
            var groupName = groupNameList[i];
            var groupDict =  GroupDict.getInstance();
            var group = groupDict.searchGroup(groupName);
            if (group == null) {
                group = new Group(groupName);
                groupDict.addGroup(group);
            }
            group.size += 1;
            this.group.push(group);
        }
    }

    draw(ctx) {
        for (var i = 0; i < this.group.length; i++) {
            var theta1 = 3*Math.PI/2 + 2 * Math.PI * i / this.group.length;
            var theta2 = 3*Math.PI/2 + 2 * Math.PI * (i+1) / this.group.length;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, theta1, theta2, false);
            ctx.lineTo(this.x , this.y);
            ctx.fillStyle = this.group[i].color;
            ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI, false);
        ctx.strokeStyle = "black";
        ctx.stroke();

        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.textBaseline = "middle";
        ctx.font = "bold 10pt Arial";
        ctx.fillRect(this.x-ctx.measureText(this.name).width/2, this.y-9, ctx.measureText(this.name).width+2, 15);
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.fillText(this.name, this.x-ctx.measureText(this.name).width/2, this.y);
        ctx.fill();
    };

    highlight(ctx) {
        // Highlight
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r + 5, 0, 2*Math.PI, false);
        ctx.fillStyle = "black";
        ctx.fill();
        // Draw
        this.draw(ctx);
    };

    draw_deleted(ctx){
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = "gray";
        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, true);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.textBaseline = "middle";
        ctx.fillText(this.name, this.x-ctx.measureText(this.name).width/2, this.y);
        ctx.fill();
        ctx.globalAlpha = 1.0;
    };

}

class Link {
    #arrow = new arrow(0, 0, 0, 0, [0, 0, 0, 0, 0, 0]);
    #label = "";
    #cvs;
    isBidirectional = false;
    constructor(from_node, to_node) {
        this.from_node = from_node;
        this.to_node = to_node;
    }

    get theta() {
        return Math.atan2((this.to_node.y - this.from_node.y), (this.to_node.x - this.from_node.x));
    }
    
    get label() {
        return this.#label;
    }

    set label(label) {
        this.#label = label;
        this.#arrow.label = label;
    }

    set cvs(cvs) {
        this.#cvs = cvs;
    }

    draw(ctx) {
        var theta = Math.atan2((this.to_node.y - this.from_node.y), (this.to_node.x - this.from_node.x));
        var controlPoints = [];
        if (this.isBidirectional) {
            controlPoints = [0, 1, -1, 1, -1, 1];
        } else {
            controlPoints = [0, 1, -20, 1, -20, 15];
        }

        this.#arrow.update(
                this.from_node.x + this.from_node.r * Math.cos(theta), 
                this.from_node.y + this.from_node.r * Math.sin(theta), 
                this.to_node.x - this.to_node.r * Math.cos(theta), 
                this.to_node.y - this.to_node.r * Math.sin(theta), 
                controlPoints
        );
        this.#arrow.draw(ctx);
    }

    highlight(ctx) {
        var theta = Math.atan2((this.to_node.y - this.from_node.y), (this.to_node.x - this.from_node.x));
        var controlPoints = [];
        if (this.isBidirectional) {
            controlPoints = [0, 3, -1, 3, -1, 3];
        } else {
            controlPoints = [0, 3, -20, 3, -20, 15];
        }

        this.#arrow.update(
                this.from_node.x + this.from_node.r * Math.cos(theta), 
                this.from_node.y + this.from_node.r * Math.sin(theta), 
                this.to_node.x - this.to_node.r * Math.cos(theta), 
                this.to_node.y - this.to_node.r * Math.sin(theta), 
                controlPoints
        );
        this.#arrow.draw(ctx, "red");
    }

    draw_deleted(ctx) {
        ctx.globalAlpha = 0.3;
        var theta = Math.atan2((this.to_node.y - this.from_node.y), (this.to_node.x - this.from_node.x));
        var controlPoints = [];
        if (this.isBidirectional) {
            controlPoints = [0, 1, -1, 1, -1, 1];
        } else {
            controlPoints = [0, 1, -20, 1, -20, 15];
        }

        this.#arrow.update(
                this.from_node.x + this.from_node.r * Math.cos(theta), 
                this.from_node.y + this.from_node.r * Math.sin(theta), 
                this.to_node.x - this.to_node.r * Math.cos(theta), 
                this.to_node.y - this.to_node.r * Math.sin(theta), 
                controlPoints
        );
        this.#arrow.draw(ctx);
        ctx.globalAlpha = 1.0;
    }
}

class Graph {
    // property
    links = {};
    nodes = {};
    #cvs;
    isCulculatingForce = true;
    #iteration = 0;
    #iterations = 100;

    // methods
    constructor(cvs) {
        this.#cvs = cvs;
    }

    get cvs() {
        return this.#cvs;
    }

    initPos() {
        var nodeList = Object.values(this.nodes);
        var numOfNodes = nodeList.length;
        for (var i = 0;  i < numOfNodes; i++) {
            var node = nodeList[i];
            var theta = 2 * Math.PI * i / numOfNodes;
            node.x = 0.5 + 0.5*Math.cos(theta);
            node.y = 0.5 + 0.5*Math.sin(theta);
        }
    }

    addNode(node_name, group, rank) {
        var node = new Node(node_name, group, rank);
        node.cvs = this.#cvs;
        this.nodes[node_name] = node;
        this.links[node_name] = {};
    }

    addLink(link_name, from_node_name, to_node_name, isBidirectional=false) {
        var link = new Link(this.nodes[from_node_name], this.nodes[to_node_name]);
        link.label = link_name;
        link.isBidirectional = isBidirectional;
        link.cvs = this.#cvs;
        this.links[from_node_name][to_node_name] = link;
        if (isBidirectional) {
            this.links[to_node_name][from_node_name] = link;
        }
    }

    //Nodeが外に出そうか判定する(条件で用いている数字はいい感じになるように設定)
    wallJudge(node, isout) {
        if(node.x > 900){
            node.x -= node.x-900 + 25;
            isout = true;
        }
        else if(node.x < 100){
            node.x += 100-node.x + 25;
            isout = true;
        }

        if(node.y > 520){
            node.y -= node.y-520 + 25;
            isout = true;
        }
        else if(node.y < 50){
            node.y += 50-node.y + 25;
            isout = true;
        }
        return isout;
    }

    calcForce() {
        if (this.isCulculatingForce) {
            var nodeList = Object.values(this.nodes); // Nodeオブジェクトの配列
            var nnodes = nodeList.length;
            var width = 1;
            var height = 1;
            var area = width*height;
            var k = Math.sqrt(area / nnodes);
            var t = Math.pow(0.9, this.#iteration)*width*0.1;

            if (this.#iteration == 0) {
                this.initPos();
            } else {
                var maxDist = -1;
                for (var i = 0; i < nnodes; i++) {
                    var node1 = nodeList[i];
                    var x = node1.x;
                    var y = node1.y;
                    var dist = Math.sqrt((x-500)*(x-500) + (5/3)*(5/3)*(y-300)*(y-300));
                    maxDist = Math.max(maxDist, dist);
                }

                for (var i = 0; i < nnodes; i++) {
                    var node1 = nodeList[i];
                    var x = node1.x;
                    var y = node1.y;
                    node1.x = width/2 + (width/2-0.1) / maxDist * (node1.x - 500);
                    node1.y = height/2 + (height/2-0.1) / maxDist * (5/3) *(node1.y - 300);
                }
            }
            function attractiveForce(x) {return x*x / k;}
            function repulsiveForce(x) {return k*k / x;}
            if (this.#iteration < this.#iterations) {
                for (var i = 0; i < nnodes; i++) {
                    var node1 = nodeList[i];
                    node1.dx = 0;
                    node1.dy = 0;
                    for (var j = 0; j < nnodes; j++) {
                        var node2 = nodeList[j];
                        if (i != j) {
                            var dx = node1.x - node2.x;
                            var dy = node1.y - node2.y;
                            var delta = Math.sqrt(dx*dx + dy*dy);
                            if (delta != 0) {
                                var d = repulsiveForce(delta) / delta;
                                node1.dx += dx * d;
                                node1.dy += dy * d;
                            }
                        }
                    }
                }

                for (var i = 0; i < nnodes; i++) {
                    var node1 = nodeList[i];
                    for (var j = 0; j < nnodes; j++) {
                        var node2 = nodeList[j];
                        if (node1.name in this.links[node2.name] && node2.name in this.links[node1.name]) {
                            var dx = node1.x - node2.x;
                            var dy = node1.y - node2.y;
                            var delta = Math.sqrt(dx*dx + dy*dy);
                            if (delta != 0) {
                                var d = 0.5*attractiveForce(delta) / delta;
                                var ddx = dx*d;
                                var ddy = dy*d;
                                node1.dx -= ddx;
                                node1.dy -= ddy;
                                node2.dx += ddx;
                                node2.dy += ddy;
                            } 
                        } else if (node1.name in this.links[node2.name] || node2.name in this.links[node1.name]) {
                            var dx = node1.x - node2.x;
                            var dy = node1.y - node2.y;
                            var delta = Math.sqrt(dx*dx + dy*dy);
                            if (delta != 0) {
                                var d = attractiveForce(delta) / delta;
                                var ddx = dx*d;
                                var ddy = dy*d;
                                node1.dx -= ddx;
                                node1.dy -= ddy;
                                node2.dx += ddx;
                                node2.dy += ddy;
                            } 
                        }
                    }
                }

                for (var i = 0; i < nnodes; i++) {
                    var vnode = nodeList[i];
                    var dx = vnode.dx;
                    var dy = vnode.dy;
                    var disp = Math.sqrt(dx*dx + dy*dy);
                    if (disp != 0) {
                        var d = Math.min(disp, t) / disp;
                        var x = vnode.x + dx*d;
                        var y = vnode.y + dy*d;
                        vnode.x = x;
                        vnode.y = y;
                    }

                }
                this.#iteration += 1;
            } else {
                this.isCulculatingForce = false;
            }

            var maxDist = -1;
            for (var i = 0; i < nnodes; i++) {
                var node1 = nodeList[i];
                var x = node1.x;
                var y = node1.y;
                var dist = Math.sqrt((x-width/2)*(x-width/2) + (y-height/2)*(y-height/2));
                maxDist = Math.max(maxDist, dist);
            }

            for (var i = 0; i < nnodes; i++) {
                var node1 = nodeList[i];
                var x = node1.x;
                var y = node1.y;
                node1.x = 500 + 425 / maxDist * (node1.x - width/2);
                node1.y = 0.6*(500 + 425 / maxDist * (node1.y - height/2));
                this.wallJudge(node1, false);
                GraphList.update(node1);
            }
        }
    }

    drawNodes(ctx) {
        for (var name in this.nodes) {
            this.nodes[name].draw(ctx);
        }
    }

    drawLinks(ctx) {
        var nodeList = Object.values(this.nodes); // Nodeオブジェクトの配列
        for (var i = 0; i < nodeList.length; i++) {
            var node1 = nodeList[i];
            for (var j = i+1; j < nodeList.length; j++) {
                var node2 = nodeList[j];
                if( (node2.name in this.links[node1.name] && this.links[node1.name][node2.name].isBidirectional == false) 
                    && (node1.name in this.links[node2.name] && this.links[node2.name][node1.name].isBidirectional == false) ) {
                    ctx.save();
                    ctx.translate(15*Math.cos(this.links[node1.name][node2.name].theta + Math.PI/2), 
                                15*Math.sin(this.links[node1.name][node2.name].theta + Math.PI/2));
                    this.links[node1.name][node2.name].draw(ctx);
                    ctx.restore();
                    ctx.save();
                    ctx.translate(15*Math.cos(this.links[node2.name][node1.name].theta + Math.PI/2), 
                                15*Math.sin(this.links[node2.name][node1.name].theta + Math.PI/2));
                    this.links[node2.name][node1.name].draw(ctx);
                    ctx.restore();
                } else if ( (node2.name in this.links[node1.name] && this.links[node1.name][node2.name].isBidirectional) 
                    && (node1.name in this.links[node2.name] && this.links[node2.name][node1.name].isBidirectional) ) {
                    this.links[node1.name][node2.name].draw(ctx);
                } else if (node2.name in this.links[node1.name]){
                    this.links[node1.name][node2.name].draw(ctx);
                } else if (node1.name in this.links[node2.name]){
                    this.links[node2.name][node1.name].draw(ctx);
                }
            }
        }
    }

    setEvents() {
        // addEventListenerに追加する関数内でthisを使うとfunctionのほうを参照するのでsetter関数内で使えるselfを用意
        var self = this; 
        var cvs = this.#cvs;
        var vlist = Object.values(self.nodes);
        cvs.addEventListener("mousedown", function(e) {
            for(var i = vlist.length-1; i >= 0; i--){
                var n = vlist[i];
                var dx = n.x - (e.clientX - cvs.getBoundingClientRect().left);
                var dy = n.y - (e.clientY - cvs.getBoundingClientRect().top);
                n.isDragged = Math.sqrt(dx * dx + dy * dy) < n.r;
                if(n.isDragged == true) break;
            }
        });

        cvs.addEventListener("mousemove", function(e) {
            for(var i = vlist.length-1; i >= 0; i--){
                var n = vlist[i];
                if (n.isDragged) {
                    n.x = e.clientX - cvs.getBoundingClientRect().left;
                    n.y = e.clientY - cvs.getBoundingClientRect().top;
                    GraphList.update(n); // 変更を他のグラフの同一ノードに同期する
                }
            }
        });

        cvs.addEventListener("mouseup", function() {
            for(var i = vlist.length-1; i >= 0; i--){
                var n = vlist[i];
                n.isDragged = false;
            }
        });
    }
}

export class GraphList {
    // graphと描画されるキャンバスを管理するクラス
    // graphはキャンバスのIDを使ってキャンバスにアクセスする
    static #graphList = [];
    static #cvsList = [];

    static createGraph(cvs) {
        var graph = new Graph(cvs);
        this.#graphList.push(graph);
        this.#cvsList.push(cvs);
        return graph;
    }

    static pushGraph(graph) {
        this.#graphList.push(graph);
        this.#cvsList.push(graph.cvs);
    }

    static graphAt(i) {
        return this.#graphList[i];
    }

    static canvasAt(i) {
        return this.#cvsList[i];
    }

    static update(node) {
        for (var i = 0; i < this.#graphList.length; i++) {
            var graph = this.graphAt(i);
            if (node.name in graph.nodes) {
                var target = graph.nodes[node.name];
                target.y = node.y;
                target.x = node.x;
            }
        }
    }
    static getGraphList(){
        return this.#graphList;
    }
}

export class Changes{
    static newNodes = [];
    static newLinks = {};
    static gList = GraphList.getGraphList();
    static pre_id = 0;
    static id = 0;
    static preNodes;
    static curNodes;
    static preLinks;
    static curLinks;

    // グラフの遷移が起こったかどうかと, 遷移先のグラフのIDがidかどうかをチェックする
    static occursAtIndex(id) {
        return this.id != main.index && main.index == id;
    }

    static getNewParts() {
        this.gList = GraphList.getGraphList();
        this.pre_id = this.id;
        this.id = main.index;
        this.getLinks();
        this.getNodes();
    }

    static getLinks(){
        this.preLinks = this.gList[this.pre_id].links;
        this.curLinks = this.gList[this.id].links;
        this.searchNewLinks();
        return this.newLinks;
    }

    static getNodes(){
        this.preNodes = this.gList[this.pre_id].nodes;
        this.curNodes = this.gList[this.id].nodes;
        this.searchNewNodes();
        return this.newNodes;
    }

    // 追加ノードを探して，newNodeに入れる
    static searchNewNodes(){
        this.newNodes = [];
        var curNodesObjects = Object.values(this.curNodes);
        for(var i = 0; i < curNodesObjects.length; i++){
            if(!(curNodesObjects[i].name in this.preNodes)){
                this.newNodes.push(curNodesObjects[i]);
            }
        }
    }

    // 追加リンクを探して，newLinkに入れる
    static searchNewLinks(){
        this.newLinks = {};
        var curFromNodeName = Object.keys(this.curLinks);
        for(var i = 0; i < curFromNodeName.length; i++){
            if (!(curFromNodeName[i] in this.newLinks)) {
                this.newLinks[curFromNodeName[i]] = {};
            }
            var curToNodeName = Object.keys(this.curLinks[curFromNodeName[i]]);
            for (var j = 0; j < curToNodeName.length; j++) {
                if (!(curFromNodeName[i] in this.preLinks && curToNodeName[j] in this.preLinks[curFromNodeName[i]])) {
                    this.newLinks[curFromNodeName[i]][curToNodeName[j]] = this.curLinks[curFromNodeName[i]][curToNodeName[j]];
                } else if (this.preLinks[curFromNodeName[i]][curToNodeName[j]].label != this.curLinks[curFromNodeName[i]][curToNodeName[j]].label) {
                    this.newLinks[curFromNodeName[i]][curToNodeName[j]] = this.curLinks[curFromNodeName[i]][curToNodeName[j]];
                }
            }
        }
    }

    static highlightNewNodes(ctx) {
        for (var i = 0; i < this.newNodes.length; i++) {
            this.newNodes[i].highlight(ctx);
        }
    }

    static highlightNewLinks(ctx) {
        var nodeList = Object.values(this.gList[this.id].nodes); // Nodeオブジェクトの配列
        for (var i = 0; i < nodeList.length; i++) {
            var node1 = nodeList[i];
            for (var j = i+1; j < nodeList.length; j++) {
                var node2 = nodeList[j];
                if( (node2.name in this.gList[this.id].links[node1.name] && this.gList[this.id].links[node1.name][node2.name].isBidirectional == false) 
                    && (node1.name in this.gList[this.id].links[node2.name] && this.gList[this.id].links[node2.name][node1.name].isBidirectional == false) ) {
                    ctx.save();
                    if (node1.name in this.newLinks && node2.name in this.newLinks[node1.name]) {
                        ctx.translate(15*Math.cos(this.newLinks[node1.name][node2.name].theta + Math.PI/2), 
                                    15*Math.sin(this.newLinks[node1.name][node2.name].theta + Math.PI/2));
                        this.newLinks[node1.name][node2.name].highlight(ctx);
                    }
                    ctx.restore();
                    ctx.save();
                    if (node2.name in this.newLinks && node1.name in this.newLinks[node2.name]) {
                        ctx.translate(15*Math.cos(this.newLinks[node2.name][node1.name].theta + Math.PI/2), 
                                    15*Math.sin(this.newLinks[node2.name][node1.name].theta + Math.PI/2));
                        this.newLinks[node2.name][node1.name].highlight(ctx);
                    }
                    ctx.restore();
                } else if ( (node2.name in this.gList[this.id].links[node1.name] && this.gList[this.id].links[node1.name][node2.name].isBidirectional) 
                    && (node1.name in this.gList[this.id].links[node2.name] && this.gList[this.id].links[node2.name][node1.name].isBidirectional) ) {
                    if (node1.name in this.newLinks && node2.name in this.newLinks[node1.name]) {
                        this.newLinks[node1.name][node2.name].highlight(ctx);
                    }
                } else if (node2.name in this.gList[this.id].links[node1.name]){
                    if (node1.name in this.newLinks && node2.name in this.newLinks[node1.name]) {
                        this.newLinks[node1.name][node2.name].highlight(ctx);
                    }
                } else if (node1.name in this.gList[this.id].links[node2.name]){
                    if (node1.name in this.newLinks && node2.name in this.newLinks[node1.name]) {
                        this.newLinks[node1.name][node2.name].highlight(ctx);
                    }
                }
            }
        }
    }
}