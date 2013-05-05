var main = (function() {
    //private
    var c = undefined, 
        ctx = undefined,
        crossHairArea = undefined,
        asteroids = [];
    
    //support func
    var getCursorPosition = function(e) {
        var x,y;
        if (e.pageX || e.pageY) {
            x = e.pageX;
            y = e.pageY;
        }
        else {
            x = e.clientX + document.body.scrollLeft +
            document.documentElement.scrollLeft;
            y = e.clientY + document.body.scrollTop +
            document.documentElement.scrollTop;
        }

        var offset = c.offset();
        x -= offset.left;
        y -= offset.top;

        return {
            x: x,
            y: y,
        }
    };

    var drawAst = function() {
        var img = new Image();   // Create new img element
        img.onload = function(){
            for (var i=0;i<7;i++){
                for (var j=0;j<7;j++){
                    ctx.drawImage(img,j*30,i*37,20,27);
                }
            }
        };
        img.src = "http://1000bpm.net/Asteroid%20Belt_files/rock3.png";
    };
    
    //setting up game
    var init = function() {
        c = $('#testX');

        if (!c) {
            return;
        }

        c.click(function(e) {
            var pos = getCursorPosition(e);
            console.log(pos);
            fire(pos.x, pos.y);
        });
    
        //testing cross hair area
        ctx = c[0].getContext('2d'); 
        crossHairArea = 120;
        ctx.fillStyle="rgb(200,0,0)";
        ctx.fillRect (260,120, 120,120);

        drawAst();
    };

    //game interaction func
    var fire = function(x,y) {
        if (!ctx) {
            console.log('Not Init');
        }
        /*
        if (x > 260 && y > 120 &&
            x < 380 && y < 260) {
            console.log("HIT");
        }
        */
        for (var i = 0; i < asteroids; i++) {
            var ast = asteroids[i];
            if (ast) {
                if (x > 260 && y > 120 &&
                    x < 380 && y < 260) {
                    console.log("HIT");
                    //do graphic update here...
                }
            }
        }
    };

    //public
    return {
        fire: fire,
        init: init,
    };
})();

$(function() {
    //Testing. Draw red square, listen for click event, react
    //main.init();
});
