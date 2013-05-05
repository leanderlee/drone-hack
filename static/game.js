var main = (function() {
    //private
    var canvas = undefined,
        ch = undefined, 
        fired = true,
        asteroids = [],
        score = 0,
        time = 0,
        loopInterval = undefined; 
    
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

        return {
            x: x,
            y: y,
        }
    },
    drawAst = function() {
    },
    fire = function(e) {
        //draw laser
        console.log('...');
        $('#laser').show();
        $('#laser').fadeOut('slow');

        for (var i = 0; i < asteroids; i++) {
            var ast = asteroids[i];
            if (ast.css('top') > 120 && ast.css('left') > 260 &&
                ast.css('top') < 180 && ast.css('left') < 320) {
                ast.hit = true;
                score += 100; //change 
            }
        }
    };

    //setting up game
    var mainLoop = function() {
        console.log("loop");
        drawAst();
        time += 0.032;
    },
    init = function() {
        canvas = $('#canvas');
        canvas.click(fire);
        ch = $('#crossHair');

        loopInterval = setIntervasetInterval(mainLoop,32); //30fps
    },
    finish = function() { //returns final game score
        clearInterval(loopInterval); 
        return score/time;
    },
    getStats = function {
        return {
        };
    };

    //public
    return {
        fire: fire,
        init: init,
        finish: finish,
        getStats: getStats
    };
})();

$(function() {
    //Testing. Draw red square, listen for click event, react
    main.init();
});
