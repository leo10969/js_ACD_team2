//入力例
import {makecanvas} from './canvas.js';
import {Graph} from './diagram.js';

var namelist = ["青羽紬", "佐倉想", "戸川湊斗", "桃野奈々", "春尾正輝", "青羽光", "佐倉萌", "佐倉律子"];
var grouplist = [["高校同窓生","青羽家"], ["高校同窓生", "佐倉家"], ["高校同窓生"], [],[],["青羽家"], ["佐倉家"], ["佐倉家"]];
var ranklist = [5,5,3,3,3,1,1,1];
var linknamelists = [["弟", "元恋人", "交際中", "手話の先生"], ["元恋人", "母", "妹","交際中？"],["交際中"],["交際中？"], ["心配"]];
var linkfromlists = ["青羽紬", "佐倉想", "戸川湊斗", "桃野奈々","佐倉律子"];
var linktolists = [["青羽光", "佐倉想","戸川湊斗","春尾正輝"],["青羽紬","佐倉律子","佐倉萌","桃野奈々"],["青羽紬"],["佐倉想"],["佐倉想"]];
var linkdirectionlists = [[false,true,true,false],[true,false,false,true], [true],[true],[false]];

var cvslist = [];
export var ctxlist = [];
export var graphList = [];

for (var i=0; i<3; i++){
    var ret = makecanvas(i.toString());
    cvslist.push(ret[0]);
    ctxlist.push(ret[1]);
}

for (var i = 0; i < 3; i++) {
    var graph = new Graph(cvslist[i]);
    
    for (var j =0; j < namelist.length; j++){
        graph.addNode(namelist[j], grouplist[j], ranklist[j]);
    }

    for (var j = 0; j < linkfromlists.length; j++){
        for (var k = 0; k < linktolists[j].length; k++){
            graph.addLink(linknamelists[j][k],linkfromlists[j],linktolists[j][k],linkdirectionlists[j][k]);
        }
    }

    //作業効率化のため入力例を相関図ぽく配置する
    graph.nodes["青羽紬"].x = 300; graph.nodes["青羽紬"].y = 250;
    graph.nodes["佐倉想"].x = 600; graph.nodes["佐倉想"].y = 250;
    graph.nodes["戸川湊斗"].x = 150; graph.nodes["戸川湊斗"].y = 250;
    graph.nodes["桃野奈々"].x = 600; graph.nodes["桃野奈々"].y = 50;
    graph.nodes["春尾正輝"].x = 300; graph.nodes["春尾正輝"].y = 50;
    graph.nodes["青羽光"].x = 300; graph.nodes["青羽光"].y = 600;
    graph.nodes["佐倉萌"].x = 600; graph.nodes["佐倉萌"].y = 600;
    graph.nodes["佐倉律子"].x = 700; graph.nodes["佐倉律子"].y = 550;

    graphList.push(graph);
}

graphList[1].addNode("春尾A子", ["春尾家"], 1);
graphList[1].addLink("姉", "春尾正輝", "春尾A子", false);
graphList[1].nodes["春尾A子"].x = 150;graphList[1].nodes["春尾A子"].y = 50;

graphList[2].addNode("春尾A子", ["春尾家"], 1);
graphList[2].addLink("姉", "春尾正輝", "春尾A子", false);
graphList[2].nodes["春尾A子"].x = 150;graphList[2].nodes["春尾A子"].y = 50;

graphList[2].addNode("高校同志", ["高校同窓生"], 1);
graphList[2].nodes["高校同志"].x = 700;graphList[2].nodes["高校同志"].y = 250;