import {GraphList, GraphList_thumbnail} from './diagram.js';
import {makecanvas, makecanvas_thumbnail} from './canvas.js';
import {render, render_thumbnail} from './render.js';

var cvslist = [];
export var ctxlist = [];

var cvslist_thumbnail = [];
export var ctxlist_thumbnail = [];

(function (window, document) {
  window.ExcelJs = {};
  ExcelJs.File = function (_file, _workbook) {
    var that = this;
    var file = _file;
    var workbook = _workbook;

    return {
      getFile: function () {
        return file;
      },
      getWorkbook: function () {
        return workbook;
      },
      toJson: function () {
        var result = {};
        workbook.SheetNames.forEach(function(sheetName) {
          var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
          if(roa.length > 0){
            result[sheetName] = roa;
          }
        });
        return result;
      },
      toCsv: function () {
        var result = [];
        workbook.SheetNames.forEach(function(sheetName) {
          var csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
          if(csv.length > 0){
            result.push('SHEET: ' + sheetName);
            result.push('');
            result.push(csv);
          }
        });
        return result.join("\n");
      },
      toFormulae() {
        var result = [];
        workbook.SheetNames.forEach(function(sheetName) {
          var formulae = XLSX.utils.get_formulae(workbook.Sheets[sheetName]);
          if(formulae.length > 0){
            result.push('SHEET: ' + sheetName);
            result.push('');
            result.push(formulae.join("\n"));
          }
        });
        return result.join("\n");
      }
    };
  };

  ExcelJs.Reader = function (_file, onload) {
    var that = this;

    var file = _file;
    var reader = new FileReader();

    reader.onload = function(e) {
      var data = e.target.result;

      // データが多いとString.fromCharCode()でMaximum call stack size exceededエラーとなるので、
      // 別途関数で処理をする。
      //var arr = String.fromCharCode.apply(null, new Uint8Array(data));
      var arr = handleCodePoints(new Uint8Array(data));

      if (typeof onload == 'function') {
        onload(e, new ExcelJs.File(file, XLSX.read(btoa(arr), {type: 'base64'})));
      }
    };
    reader.readAsArrayBuffer(file);
  };
})(window, window.document);

// see: https://github.com/mathiasbynens/String.fromCodePoint/issues/1
function handleCodePoints(array) {
  var CHUNK_SIZE = 0x8000; // arbitrary number here, not too small, not too big
  var index = 0;
  var length = array.length;
  var result = '';
  var slice;
  while (index < length) {
    slice = array.slice(index, Math.min(index + CHUNK_SIZE, length)); // `Math.min` is not really necessary here I think
    result += String.fromCharCode.apply(null, slice);
    index += CHUNK_SIZE;
  }
  return result;
}

function pushToGraphList(name, content) {
  //FileName
  /* var elem = document.getElementById('file_name');
  var html = elem.innerHTML;
  html = "<h2>" + name.slice(0, name.length-5) +  " is uploaded! </h2>";
  elem.innerHTML = html; */

  // Nodes
  var namelist = [];
  var grouplist = [];
  var ranklist = [];
  for (var i =0; i<content["ノード情報"].length; i++) {
    namelist.push(content["ノード情報"][i]["名前"]);
    if("所属" in content["ノード情報"][i]){
      grouplist.push(content["ノード情報"][i]["所属"].split(","));
    }else{
      grouplist.push([]);
    }
    ranklist.push(Number(content["ノード情報"][i]["重要度"]));
  }

  // Links
  var linknamelists = [];
  var linkfromlists = [];
  var linktolist = [];
  var linkdirectionlists = [];
  for (var j = 0; j<content["リンク情報"].length; j++) {
    linknamelists.push(content["リンク情報"][j]["関係性"]);
    linkfromlists.push(content["リンク情報"][j]["From"]);
    linktolist.push(content["リンク情報"][j]["To"]);
    if(content["リンク情報"][j]["双方向"] == "T"){
      linkdirectionlists.push(true);
    }else{
      linkdirectionlists.push(false);
    }
  }

  var i = cvslist.length;
  var ret = makecanvas(i.toString());
  cvslist.push(ret[0]);
  ctxlist.push(ret[1]);

  var j = i + 11;
  var ret_tumbnail = makecanvas(j.toString());
  cvslist_thumbnail.push(ret_tumbnail[0]);
  ctxlist_thumbnail.push(ret_tumbnail[1]);
  
  var graph = GraphList.createGraph(cvslist[i]);
  var graph_thumbnail = GraphList_thumbnail.createGraph(cvslist_thumbnail[i]);
  for (var k =0; k < namelist.length; k++){
    graph.addNode(namelist[k], grouplist[k], ranklist[k]);
    graph_thumbnail.addNode(namelist[k], grouplist[k], ranklist[k]);
  }

  for (var k = 0; k < linkfromlists.length; k++){
    graph.addLink(linknamelists[k], linkfromlists[k], linktolist[k], linkdirectionlists[k]);
    graph_thumbnail.addLink(linknamelists[k], linkfromlists[k], linktolist[k], linkdirectionlists[k]);
  }

  

  GraphList.graphAt(i).initPos();
  GraphList_thumbnail.graphAt(i).initPos();
  // var timer = setInterval(render, 100, ctxlist[i], GraphList.graphAt(i));
  // timer;
  var timer = setInterval(function(){
    render(ctxlist[i], GraphList.graphAt(i));
    render(ctxlist_thumbnail[i], GraphList_thumbnail.graphAt(i));
  }, 100);
  timer;
  var get = GraphList.getGraphList();
  console.log(get[0].nodes);
  //20秒後にタイマーを止める
  //setTimeout(function(){clearInterval(timer);}, 20000);
}


document.getElementById('import-excel').addEventListener('change', function (evt) {
  var files = evt.target.files;
  var i, f;
  for (i = 0, f = files[i]; i != files.length; ++i) {
    var er = new ExcelJs.Reader(f, function (e, xlsx) {
      pushToGraphList(xlsx.getFile().name, xlsx.toJson());
    });
  }
}, false);