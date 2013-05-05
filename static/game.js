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
        shotsFired = 0,
        shotsHit = 0,
        score = 0,
        time = 0,
        canvasSizeX = 500,
        canvasSizeY = 300;
    
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
                    soundDOM.blast.play();

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
        soundDOM.laser.currentTime = 0;
        soundDOM.laser.play();

        $('#laserR').show().stop().css("opacity", 1);
        $('#laserL').show().stop().css("opacity", 1);
        $('#laserR').animate({ opacity: 0 }, 1000);
        $('#laserL').animate({ opacity: 0 }, 1000);
        shotsFired += 1;

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
                shotsHit++;
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
        $('#laserR').hide();
        $('#laserL').hide();
        ch = $('#crossHair');
        $('#blast').hide();
        
        soundDOM.laser = $('#laserSound')[0];
        soundDOM.blast = $('#blastSound')[0];

        loopInterval = setInterval(mainLoop,32); //30fps
        setInterval(updateAstPos,50); //30fps
    },
    endGame = function() { //returns final game score
        clearInterval(loopInterval); 
        canvas.trigger('gameOver');
    },
    getStats = function () {
        return {
            score: score,
            time: time,
            shotsHit: shotsHit,
            shotsFired: shotsFired,
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
    $('body').bind('gameOver', function() {
       console.log('GAMEOVER'); 
    });
});
