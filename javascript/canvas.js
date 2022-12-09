export function makecanvas(cvsid){
    var cvs = document.createElement("canvas");
    cvs.width = 1000;
    cvs.height = 1000;
    document.getElementById(cvsid).appendChild(cvs);

    var ctx = cvs.getContext("2d");
    return [cvs,ctx];
}