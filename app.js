var discs = [];
var gravity;
var screenHeight;
var screenWidth;

var filterStrength = 20;
var frameTime = 0, lastLoop = new Date, thisLoop;
// Report the fps only every half second, to only lightly affect measurements
var fpsOut = document.getElementById('fps');
setInterval(function(){
  fpsOut.innerHTML = (1000/frameTime).toFixed(1) + " fps";
},500);

$(function(){
	screenHeight = $(window).height();
	screenWidth = $(window).width();
	initializeDiscs( parseInt($('input[name=discs]').val()) );
	render();
});

$('form').on('submit', function(e) {
	e.preventDefault();
	initializeDiscs( parseInt($('input[name=discs]').val()) );
});

function initializeDiscs( discNum ) {
	discs = [];
	gravity = parseInt($('input[name=gravity]').val());
	$('#container').html('');
	if ( discNum > 99 ) discNum = 99;
	var radius;
	for ( var i = 0; i < discNum; i++ ) {
		radius = Math.floor(Math.random() * 100) + 10;
		discs.push(new Array(
			radius,									// radius
			Math.floor(Math.random() * (screenWidth - radius - 50)) + 1,	// xpos
			Math.floor(Math.random() * (screenHeight - radius - 50)) + 1,	// ypos
			Math.floor(Math.random() * 15) - 7.5,	// x-velocity
			Math.floor(Math.random() * 15) - 7,		// y-velocity
			0,										// disable x
			0										// disable y
		));
		var color = 'color' + (Math.floor(Math.random() * 9) + 1);
		var htmls = '<div class="disc '+color+'" style="left:'+discs[i][1]+'px;top:'+discs[i][2]+'px;width:'+discs[i][0]+'px;height:'+discs[i][0]+'px;border-radius:'+discs[i][0]+'px;"></div>';
		$('#container').append(htmls);
	}

	$(document).on('click', '.disc', function(e) {
		e.preventDefault();
		var index = $(this).index();
		var radius = discs[index][0];
		discs[index][3] = Math.floor(Math.random() * 15) - 7.5;	// x-velocity;
		discs[index][4] = Math.floor(Math.random() * 7) - 30;	// y-velocity;
	});
}

var QueueNewFrame = function () {
    if (window.requestAnimationFrame)
        window.requestAnimationFrame(render);
    else if (window.msRequestAnimationFrame)
        window.msRequestAnimationFrame(render);
    else if (window.webkitRequestAnimationFrame)
        window.webkitRequestAnimationFrame(render);
    else if (window.mozRequestAnimationFrame)
        window.mozRequestAnimationFrame(render);
    else if (window.oRequestAnimationFrame)
        window.oRequestAnimationFrame(render);
    else {
        QueueNewFrame = function () {};
        homeInterval = window.setInterval(render, 10);
    }
};

function render() {
	var thisFrameTime = (thisLoop=new Date) - lastLoop;
	frameTime+= (thisFrameTime - frameTime) / filterStrength;
	lastLoop = thisLoop;

	for ( var i = 0; i < discs.length; i++ ) {
		discs[i][4] += (gravity/5);		// accel gravity

		if ( discs[i][5] == 0 )
			discs[i][1] += discs[i][3]; // xpos

		if ( discs[i][6] == 0 )
			discs[i][2] += discs[i][4]; // ypos

		// if ( xpos )
		if ( discs[i][2] + discs[i][0] > screenHeight && discs[i][4] > 0 )
			discs[i][4] *= -1;	// bounce the ball up
		else if ( discs[i][2] < 0 && discs[i][4] < 0 )
			discs[i][4] *= -1;	// bounce the ball down
		if ( discs[i][1] < 0 && discs[i][3] < 0 )
			discs[i][3] *= -1;
		else if ( discs[i][1] + discs[i][0] >= screenWidth && discs[i][3] >= 0 )
			discs[i][3] *= -1;

		if ( discs[i][2] + discs[i][0] > screenHeight && discs[i][4] < 0.5 && discs [i][4] > -1.2 ) {
			discs[i][4] = 0;
			discs[i][6] = 0;
			discs[i][2] = screenHeight - discs[i][0] - 1;
			if ( discs[i][3] > 0 ) {
				discs[i][3] -= (gravity/100);
				if ( discs[i][3] <= 0 )
					discs[i][5] = 0;
			}
			else if ( discs[i][3] < 0 ) {
				discs[i][3] += (gravity/100);
				if ( discs[i][3] >= 0 )
					discs[i][5] = 0;
			}
		}
		$('.disc').eq(i).css({'left':discs[i][1],'top':discs[i][2]});
	}

	QueueNewFrame();
}

$(window).resize( function () {
	screenWidth = $(window).width();
	screenHeight = $(window).height();
});
