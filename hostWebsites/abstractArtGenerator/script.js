var canvas = document.getElementById("urmom");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext("2d");

function drawRect(x,y,w,h, cl, f = false){
    c.beginPath();
    c.rect(parseInt(x), parseInt(y), parseInt(w), parseInt(h));
    c.strokeStyle = cl;
    c.fillStyle = cl;
    c.stroke();
    if (f) { c.fill(); }
}

//ddd

var mx= 50;
var my = 50;

alert("click to create amazing abstract art! (press right clck to change modes)");

function drawCircle(x,y,r,cl, f=false){
    c.beginPath();
    c.strokeStyle = cl;
    c.fillStyle = cl;
    c.arc(x,y,r, Math.PI*2,  false);
    c.stroke();
    c.fill();
}


var square = false;


document.onmousedown = function(e){
    var x = e.clientX;
    var y = e.clientY;

    if (e.button == 2){
        square = !square;
    }
    else {
    for (var i = 0; i < 500; i++){
        var color = "rgba(" + parseInt(Math.random() * 255) + "," + parseInt(Math.random() * 255) + "," + parseInt(Math.random() * 255) + ",0.5)";
        if (square){
        drawRect((Math.random() * 50) + x, (Math.random() * 50) + y, Math.random() * 200, Math.random() * 200, color, true);
        }
        else {
            drawCircle((Math.random() * 50) + x, (Math.random() * 50) + y, Math.random() * 100, color, true)
        }
        console.log(color);
        x += (Math.random() * 100) - 50;
        y += (Math.random() * 100) - 50;
    }
    }
};