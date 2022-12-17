import {arrow} from "./arrow.js";

// Class
class GroupDict {
    // porperty
    groupDict = {}; // private変数にすべきか？
    static #sigletonInstance = null;
    // methods
    static getInstance() {
        if (this.#sigletonInstance == null) {
            this.#sigletonInstance = new GroupDict();
        }
        return this.#sigletonInstance;
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
        this.name = name;
        this.color = "hsl(" + Math.round(360 * Math.random()).toString() + ", 100%, 50%)";
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
    #isDragged = false;
    // methods
    constructor(name, group=[], rank=1) {
        this.name = name;
        this.#setGroup(group);
        this.rank = rank;
        this.x = 500*Math.random() + 150;
        this.y = 500*Math.random() + 150;
        this.r = 50+(5*this.rank);
    }

    #setGroup(groupNameList) {
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

    get cvs() {
        return this.#cvs;
    }

    set cvs(cvs) {
        // addEventListenerに追加する関数内でthisを使うとfunctionのほうを参照するのでsetter関数内で使えるselfを用意
        var self = this; 
        self.#cvs = cvs;
        cvs.addEventListener("mousedown", function(e) {
            var dx = self.x - (e.clientX - cvs.getBoundingClientRect().left);
            var dy = self.y - (e.clientY - cvs.getBoundingClientRect().top);
            self.#isDragged = Math.sqrt(dx * dx + dy * dy) < self.r;
        });

        cvs.addEventListener("mousemove", function(e) {
            if (self.#isDragged) {
                self.x = e.clientX - cvs.getBoundingClientRect().left;
                self.y = e.clientY - cvs.getBoundingClientRect().top;
            }
        });

        cvs.addEventListener("mouseup", function() {
            self.#isDragged = false;
        });
    }

    draw(ctx) {
        ctx.strokeStyle = "black";
        for (var i = 0; i < this.group.length; i++) {
            ctx.beginPath();
            ctx.fillStyle = this.group[i].color;
            ctx.arc(this.x, this.y, this.r, 2 * Math.PI * i / this.group.length, 2 * Math.PI * (i+1) / this.group.length, true);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
        }
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.textBaseline = "middle";
        ctx.fillText(this.name, this.x-ctx.measureText(this.name).width/2, this.y);
        ctx.fill();
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

export class Graph{
    // property
    links = {};
    nodes = {};
    #cvs = null;

    // methods
    constructor(cvs) {
        this.#cvs = cvs;
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
        this.links[from_node_name][to_node_name] = link;
        if (isBidirectional) {
            this.links[to_node_name][from_node_name] = link;
        }
    }


    //Nodeにかかるばねの力を計算する
    calcSpringForce(node1, node2) {   
        var k = 0.001; // ばね定数
        var stableDistance = 220; // 自然長
        var dx = node1.x - node2.x;
        var dy = node1.y - node2.y;
        var distance = Math.sqrt(dx * dx + dy * dy); 
        node1.x += k * dx * (stableDistance - distance);
        node1.y += k * dy * (stableDistance - distance);
    }

    //Nodeの引力を計算する
    calcAttractiveForce(node1, node2) {
        var dx = (node1.x - node2.x);
        var dy = (node1.y - node2.y);
        var distance = Math.sqrt(dx * dx + dy * dy) / 10000;
        node2.x += dx * distance;
        node2.y += dy * distance;
    }
        
    //Node同士の斥力分だけ移動させる
    calcRepulsiveForce(node1, node2) {   
        var dx = node1.x - node2.x;
        var dy = node1.y - node2.y;
        var distance = Math.sqrt(dx * dx + dy * dy)/2; 
        if (distance < node1.r + node2.r){
            node1.x += dx / distance;
            node1.y += dy / distance;
        }
    }

    calcForce() {
        var nodeList = Object.values(this.nodes); // Nodeオブジェクトの配列
        for (var i = 0; i < nodeList.length; i++) {
            var node1 = nodeList[i];
            for (var j = i+1; j < nodeList.length; j++) {
                var node2 = nodeList[j];
                if(node1.name in this.links[node2.name] || node2.name in this.links[node1.name]) {
                    // ばねの計算
                    this.calcSpringForce(node1, node2);
                    this.calcSpringForce(node2, node1);
                }else {
                    // 斥力・引力の計算
                    this.calcRepulsiveForce(node1, node2);
                    this.calcRepulsiveForce(node2, node1);
                }
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

}