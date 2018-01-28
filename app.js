var currentStation = 99.9;
var progression = 0;
var staticAudio;
var currentStoryAudio, currentStoryLoop;
var currentTranscriptSection;
var currentFillerLoop;

function startGame()
{
	$("#ship-interior").show();
	$("#ship-exterior").hide();

	transcript(null);

	staticAudio = new Howl(
	{
		src: ["sounds/static.ogg"],
		loop: true,
		autoplay: true
	});

	$("#dial").knob(
	{
        'release' : rotateKnob,
        'change' : rotateKnob
    });
    $("#dial").val(currentStation*100)
    rotateKnob(currentStation*100);
}

function endGame()
{
	currentStoryAudio.stop();
	staticAudio.stop();

	$("#ship-interior").hide();
	$("#endcredits").show();
	$("#ship-exterior").show();

	$("#birb").off("click");
	$("#birb").css('cursor', 'auto');
}

function rotateKnob(v)
{
	var angle = (v - 8800)/2000 * 360;
	$("#knob").rotate(angle);

	currentStation = (v/100).toFixed(1);
	$("#station").text(currentStation);

	if (progression < story.length-1)
	{
		if (Math.abs(story[progression+1].station - currentStation) < 0.3)
		{
			currentStoryAudio = null;
			progression++;
		}
	}
	if (Math.abs(story[progression].station - currentStation) < 0.3)
	{
		if (!currentStoryAudio) initStoryAudio();
		if (!currentStoryAudio.playing()) currentStoryAudio.play();
	}
	else
	{
		if (currentStoryAudio) currentStoryAudio.stop();
		staticAudio.volume(1);
	}

	for (var f of filler)
	{
		if (Math.abs(f.station - currentStation) < 0.3)
		{
			if (!f.audio.playing()) f.audio.play();
			var vol = 1 - 4*Math.abs(f.station - currentStation);
			f.audio.volume(vol);
			staticAudio.volume(1 - vol);
		}
		else if (f.audio.playing())
		{
			f.audio.pause();
		}
	}
}

function initStoryAudio()
{
	currentStoryAudio = new Howl(
	{
		src: [story[progression].audioFile],
		loop: true,
		onplay: function()
		{
			currentTranscriptSection = 0;
			currentStoryLoop = requestAnimationFrame(playingStoryAudio);
        },
		onstop: function()
		{
			cancelAnimationFrame(currentStoryLoop);
			transcript(null);
		},
		onend: function()
		{
			cancelAnimationFrame(currentStoryLoop);
			transcript(null);
			if (progression == story.length-1) endGame();
		}
	});
}

function playingStoryAudio()
{
	var time = currentStoryAudio.seek();

	if (currentTranscriptSection < story[progression].transcript.length)
	{
		if (time >= story[progression].transcript[currentTranscriptSection].time)
		{
			transcript(story[progression].transcript[currentTranscriptSection].text);
			currentTranscriptSection++;
		}
	}

	var vol = 1 - 4*Math.abs(story[progression].station - currentStation);
	currentStoryAudio.volume(vol);
	staticAudio.volume(1 - vol);
	$("#transcript").css('opacity', vol);

	currentStoryLoop = requestAnimationFrame(playingStoryAudio);
}

function transcript(txt)
{
	if (!txt)
	{
		$("#transcript").hide();
	}
	else
	{
		$("#transcript").html("<p>"+txt+"</p>");
		$("#transcript").show();
	}
}

$(document).ready(function()
{
	$("#ship-interior").hide();
	$("#endcredits").hide();
	$("#ship-exterior").show();

	$("#birb").click(startGame);

	var ambient = new Howl(
	{
		src: ["sounds/ambient.ogg"],
		loop: true,
		autoplay: true
	});
});