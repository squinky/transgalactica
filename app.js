var currentStation = 99.9;

function rotateKnob(v)
{
	var angle = (v - 8800)/2000 * 360;
	$("#knob").rotate(angle);

	currentStation = (v/100).toFixed(1);
	$("#station").text(currentStation);
}

$(document).ready(function()
{
	$("#dial").knob(
	{
        'release' : rotateKnob,
        'change' : rotateKnob
    });
    $("#dial").val(currentStation*100)
    rotateKnob(currentStation*100);
});