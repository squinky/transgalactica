var currentStation = 99.9;
var progression = 0;
var staticAudio;
var currentStoryAudio, currentStoryLoop;
var currentTranscriptSection;
var currentFillerLoop;

function rotateKnob(v)
{
	var angle = (v - 8800)/2000 * 360;
	$("#knob").rotate(angle);

	currentStation = (v/100).toFixed(1);
	$("#station").text(currentStation);

	if (Math.abs(story[progression+1].station - currentStation) < 0.3)
	{
		currentStoryAudio = null;
		progression++;
	}
	if (Math.abs(story[progression].station - currentStation) < 0.3)
	{
		if (!currentStoryAudio) initStoryAudio();
		if (!currentStoryAudio.playing()) currentStoryAudio.play();
	}
	else
	{
		if (currentStoryAudio) currentStoryAudio.stop();
		for (var f of filler)
		{
			if (f.station == currentStation)
			{
				f.audio.play();
			}
			else if (f.audio.playing())
			{
				f.audio.pause();
			}
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
});