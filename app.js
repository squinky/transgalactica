function rotateKnob(v)
{
	$("#knob").rotate(v);
}

$(document).ready(function()
{
	$("#dial").knob(
	{
        'release' : rotateKnob,
        'change' : rotateKnob
    });
});