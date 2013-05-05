var main = (function() {
    //private
    var canvas = undefined,
        ch = undefined, 
        asteroids = {
            r1: {
                destroyed: false,
                el: undefined,
            },
            r2: {
                destroyed: false,
                el: undefined,
            },
            r3: {
                destroyed: false,
                el: undefined,
            }
        },
        asteroidsPos = {
            r1: undefined,
            r2: undefined,
            r3: undefined
        },
        soundDOM = {
        },
        loopInterval = undefined; 
        fired = true,
        score = 0,
        time = 0,
        canvasSizeX = 640,
        canvasSizeY = 360;
    
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
    updateAstPos = function() {
        for (var id in asteroidsPos) {
            var astPos = asteroidsPos[id];

            if (!astPos) {
                asteroidsPos[id] = {};
            }
            asteroidsPos[id].x = Math.random()*canvasSizeX;
            asteroidsPos[id].y = Math.random()*canvasSizeY;
        }
    },
    drawAst = function() {
        var gameFinished = true;

        for (var id in asteroids) {
            var ast = asteroids[id],
                astPos = asteroidsPos[id];
             
            if (!ast.destroyed) { //defined so has x & y
                gameFinished = false;

                if (!ast.el && !ast.destroyed) {
                    console.log('recreating...');
                    var rockId = Math.ceil(Math.random()*5);
                    ast.el = $('<img>', {'class': 'asteroid', 'src': 'rock'+rockId+'.png'});
                    canvas.prepend(ast.el);
                }

                if (ast.hit) {
                    ast.el.remove();
                    ast.destroyed = true;

                    $("#blast").show();

                    setTimeout(function() {
                        $('#blast').fadeOut();
                    }, 1000);
                }
                else {
                    ast.el.animate({
                        top: astPos.y, 
                        left: astPos.x, 
                    }, 1500);
                }
            }
        }
        
        if (gameFinished) {
            endGame();
        }
    },
    fire = function(e) {
        //draw laser
        console.log('...');
        $('#laser').show();
        $('#laser').fadeOut('slow');
        soundDOM.laser.play();

        for (var id in asteroids) {
            var ast = asteroids[id];

            if (!ast.el) {
                continue;
            }

            var topCoord = parseInt(ast.el.css('top')),
                leftCoord = parseInt(ast.el.css('left'));

            if (topCoord > 120 && leftCoord > 260 &&
                topCoord < 180 && leftCoord < 320) {
                console.log('Woohoo~');
                ast.hit = true;
                score += 100; //change 
            }
        }
    };

    //setting up game
    var mainLoop = function() {
        console.log("loop");
        time += 0.032;
        drawAst();
    },
    init = function() {
        canvas = $('#canvas');

        KeyboardJS.on('space', function() {
            fire();
        });

        ch = $('#crossHair');
        $('#blast').hide();
        
        soundDOM.laser = $('#laserSound');

        loopInterval = setInterval(mainLoop,32); //30fps
        setInterval(updateAstPos,50); //30fps
    },
    endGame = function() { //returns final game score
        clearInterval(loopInterval); 
        $.trigger('gameOver');
        return score/time;
    },
    getStats = function () {
        return {
        };
    };

    //public
    return {
        fire: fire,
        init: init,
        finish: endGame,
        getStats: getStats
    };
})();

$(function() {
    //Testing. Draw red square, listen for click event, react
    main.init();
    var t = $('<img>', {'class': 'asteroid', 'src': 'rock3.png'});
    $('#canvas').prepend(t);
    t.css('top',170);
    t.css('left', 310);
});
