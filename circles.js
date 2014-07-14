(function($, window, document, undefined){
    'use strict';

    // Basic Stage Dimensions
    var stageWidth = $(window).width(),
        stageHeight = $(window).height();

    // Cache this texture so that we don't reload it each time.
    var circleTexture = PIXI.Texture.fromImage("circle.png");

    // Keep track of all of the circles on the screen in an array
    var circles = [];

    // Basic state
    var stage,
        renderer,
        score,
        difficulty,
        gameState,
        spawnTimeout,
        checkInterval;

    var utils = {
        math: {
            randomInt: function(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }
        }
    };

    var INTERACTIVE = true;
    var STAGE_BUFFER = 50;

    function resizeRenderer() {
        stageWidth = $(window).width();
        stageHeight = $(window).height();
        renderer.resize(stageWidth, stageHeight);
    }
    
    function drawCircle() {
        var circle = new PIXI.Sprite(circleTexture); 
        circle.position.x = utils.math.randomInt(STAGE_BUFFER, stageWidth - STAGE_BUFFER);
        circle.position.y = utils.math.randomInt(STAGE_BUFFER, stageHeight - STAGE_BUFFER);
        circle.rotation = utils.math.randomInt(0, 360);
        circle.interactive = INTERACTIVE;

        circle.width = 20;
        circle.height = 20;


        circle.click = function() {
            increaseScore();
            removeCircle(circle);
        };

        stage.addChild(circle);

        circles.push(circle);
    }

    function increaseScore() {
        score += 1;
    }

    function increaseDifficulty() {
        difficulty += 1;
    }

    function setGameState(state, reason) {
        gameState = state;
    }

    function removeCircle(circle) {
        stage.removeChild(circle);
        circles.splice(circles.indexOf(circle), 1);
    }

    function initStage() {
        renderer = new PIXI.CanvasRenderer(stageWidth, stageHeight);
        document.body.appendChild(renderer.view);
        stage = new PIXI.Stage(0x000000, INTERACTIVE);
    }

    function startGame() {
        $.each(circles, function(i, circle) {
            stage.removeChild(circle);
        });
        circles = [];
        score = 0;
        difficulty = 1;
        setGameState('playing');
        requestAnimationFrame(animate);
        checkInterval = setInterval(function() {
            var ctx = document.getElementsByTagName('canvas')[0].getContext('2d');
            var imgData = ctx.getImageData(STAGE_BUFFER,STAGE_BUFFER,stageWidth - STAGE_BUFFER,stageHeight - STAGE_BUFFER);
            var countBlack = 0, countTotal = 0;
            for (var i = 1; i < imgData.data.length; i +=4) {
                countTotal += 1
                if (imgData.data[i] === 0) {
                    countBlack += 1;
                }
            } 
            if (countBlack === countTotal) {
                // The screen is all black
                $.each(circles, function(i, circle) {
                    stage.removeChild(circle);
                });
                circles = [];
            }
            if (countBlack <= 0) {
                setGameState('gameover', 'no black');
            }
            if (circles.length < difficulty) {
                increaseDifficulty();
            }
            if (circles.length > 100) {
                setGameState('gameover', 'too many circles');
            }
        }, 2000);
    }

    function initSpawn(num) {
        for (var i = 0; i < num; i++) {
            drawCircle();
        }
        spawnTimeout = setTimeout(function() {
            initSpawn(Math.ceil(difficulty / 2));
        }, utils.math.randomInt(2000, Math.max(2000, 10000 - (difficulty * 1000))));
    }

    function animate() {
        var i, len = circles.length, circle;
        for (i = 0; i < len; i++) {
            circle = circles[i];
            circle.width += 1;
            circle.height += 1;
        }

        renderer.render(stage);
        if (gameState === 'playing') {
            requestAnimationFrame(animate);
        } else {
            $('.score').text('Score: ' + score).removeClass('hidden');
            clearTimeout(spawnTimeout);
            clearInterval(checkInterval);
        }
    }

    $(window).on('resize', resizeRenderer);

    $(function() {
        initStage();

        $('.start, .score').on('click', function() {
            $('.start, .score').addClass('hidden');
            startGame();
            initSpawn(1);            
        })
    });

})(jQuery, window, document);