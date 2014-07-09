$(function(){

    var canvasWidth = $(window).width(),
        canvasHeight = $(window).height();

    function resizeRenderer() {
        canvasWidth = $(window).width();
        canvasHeight = $(window).height();
        renderer.resize(canvasWidth, canvasHeight);
    }
    
    var renderer = new PIXI.CanvasRenderer(canvasWidth, canvasHeight);

    document.body.appendChild(renderer.view);

    var interactive = true;
    var stage = new PIXI.Stage(0x000000, interactive);

    var circleTexture = PIXI.Texture.fromImage("circle.png");
    var circle = new PIXI.Sprite(circleTexture);

    circle.position.x = 400;
    circle.position.y = 300;

    circle.setInteractive(interactive);

    circle.width = 20;
    circle.height = 20;

    stage.addChild(circle);

    circle.click = function() {
        console.log('click!');
    };

    requestAnimationFrame(animate);

    function animate() {
        circle.width += 1;
        circle.height += 1;

        renderer.render(stage);

        requestAnimationFrame(animate);
    }

    $(window).on('resize', resizeRenderer);
});