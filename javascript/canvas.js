export function makecanvas(cvsid){
    console.log(document.getElementById(cvsid).children);
    if(document.getElementById(cvsid).children.length == 0){
        var cvs = document.createElement("canvas");
        cvs.width = 1000;
        cvs.height = 700;
        document.getElementById(cvsid).appendChild(cvs);
        var ctx = cvs.getContext("2d");
        return [cvs,ctx];   
    }else{
        var cvs = document.getElementById(cvsid).appendChild(cvs);
        cvs.width = 1000;
        cvs.height = 700;
        var ctx = cvs.getContext("2d");
        return [cvs,ctx]; 
    }
}