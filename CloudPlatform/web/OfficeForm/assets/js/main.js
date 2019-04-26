
$('.js-button-campaign').click(function() {

	$('.js-overlay-campaign').fadeIn();
	$('.js-overlay-campaign').addClass('disabled');
});

$('.js-close-campaign').click(function() {
	$('.js-overlay-campaign').fadeOut();

});

$(document).mouseup(function (e) {
	var popup = $('.js-popup-campaign');
	if (e.target!=popup[0]&&popup.has(e.target).length === 0){
		$('.js-overlay-campaign').fadeOut();

	}
});



function addDeviceInHTML(temperature) {
	var element = document.getElementById("devices");

	var div = document.createElement("div");
	div.className = "Box";
	div.innerHTML = "Device";
	div.innerHTML = "Temperature: " + temperature ;

	element.appendChild(div);
}

function addDevice() {
	var address = document.getElementById("device-address").value;
	var password = document.getElementById("device-password").value;


	$.ajax({
		type: "POST",
		url: "/addDevice",
		contentType: "application/json;",
		data: JSON.stringify(
			{
				"link": address,
				"password": password
			}),
		success: function (data) {
			document.getElementById("result").innerText = data.result;
			addDeviceInHTML(data.getResponseHeader('temperature'));
		}
	});
}

