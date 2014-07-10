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
        score = 0,
        difficulty = 0,
        gameState = 'playing';

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
            increaseDifficulty();
            removeCircle(circle);
        };

        stage.addChild(circle);

        circles.push(circle);
    }

    function increaseScore() {
        score += 1;
        console.log('Score: ' + score);
    }

    function increaseDifficulty() {
        difficulty += 1;
    }

    function removeCircle(circle) {
        stage.removeChild(circle);
        circles.splice(circles.indexOf(circle), 1);
    }

    function initStage() {
        console.log('Initializing Stage');        
        renderer = new PIXI.CanvasRenderer(stageWidth, stageHeight);
        document.body.appendChild(renderer.view);
        stage = new PIXI.Stage(0x000000, INTERACTIVE);
        requestAnimationFrame(animate);
        setInterval(function() {
            var ctx = document.getElementsByTagName('canvas')[0].getContext('2d');
            var imgData = ctx.getImageData(STAGE_BUFFER,STAGE_BUFFER,stageWidth - STAGE_BUFFER,stageHeight - STAGE_BUFFER);
            var count = 0;
            for (var i = 1; i < imgData.data.length; i +=4) {
                if (imgData.data[i] === 0) {
                    count += 1;
                }
            } 
            if (count <= 0) {
                gameState = 'gameover';
            }
        }, 2000);
    }

    function initSpawn(num) {
        for (var i = 0; i < num; i++) {
            drawCircle();
        }
        setTimeout(function() {
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
        }
    }

    $(window).on('resize', resizeRenderer);

    $(function() {
        initStage();
        initSpawn(1);
    });

})(jQuery, window, document);