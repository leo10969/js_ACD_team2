export function makecanvas(cvsid){
    if(document.getElementById(cvsid).children.length == 0){
        var cvs = document.createElement("canvas");
        cvs.width = 1000;
        cvs.height = 600;
        document.getElementById(cvsid).appendChild(cvs);
        var ctx = cvs.getContext("2d");
        return [cvs,ctx];   
    }else{
        var cvs = document.getElementById(cvsid).appendChild(cvs);
        cvs.width = 1000;
        cvs.height = 600;
        var ctx = cvs.getContext("2d");
        return [cvs,ctx]; 
    }
}

export function makecanvas_thumbnail(cvsid){
    if(document.getElementById(cvsid).children.length == 0){
        var cvs = document.createElement("canvas");
        cvs.width = 60;
        cvs.height = 60;
        document.getElementById(cvsid).appendChild(cvs);
        var ctx = cvs.getContext("2d");
        return [cvs,ctx];   
    }else{
        var cvs = document.getElementById(cvsid).appendChild(cvs);
        cvs.width = 100;
        cvs.height = 100;
        var ctx = cvs.getContext("2d");
        return [cvs,ctx]; 
    }
}