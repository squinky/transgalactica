function rotateKnob(v)
{
	$("#knob").rotate(v);
	if (v == 360)
	{
		$("#dial").val(0);
	}
	else if (v == 0)
	{
		$("#dial").val(360);
	}
}

$(document).ready(function()
{
	$("#dial").knob(
	{
        'release' : rotateKnob,
        'change' : rotateKnob
    });
});