var currentStation = 99.9;
var progression = 0;
var currentStoryAudio, currentStoryLoop;
var currentTranscriptSection;

function rotateKnob(v)
{
	var angle = (v - 8800)/2000 * 360;
	$("#knob").rotate(angle);

	currentStation = (v/100).toFixed(1);
	$("#station").text(currentStation);

	if (story[progression].station == currentStation)
	{
		startStoryAudio();
	}
}

function startStoryAudio()
{
	currentStoryAudio = new Howl(
	{
		src: [story[progression].audio],
		onplay: function()
		{
			currentTranscriptSection = 0;
			currentStoryLoop = requestAnimationFrame(playingStoryAudio);
        },
		onend: function()
		{
			cancelAnimationFrame(currentStoryLoop);
			transcript(null);
		}
	});
	currentStoryAudio.play();
}

function playingStoryAudio()
{
	var time = currentStoryAudio.seek();

	if (currentTranscriptSection >= story[progression].transcript.length)
	{
		cancelAnimationFrame(currentStoryLoop);
	}

	if (time >= story[progression].transcript[currentTranscriptSection].time)
	{
		transcript(story[progression].transcript[currentTranscriptSection].text);
		currentTranscriptSection++;
	}

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

	$("#dial").knob(
	{
        'release' : rotateKnob,
        'change' : rotateKnob
    });
    $("#dial").val(currentStation*100)
    rotateKnob(currentStation*100);
});