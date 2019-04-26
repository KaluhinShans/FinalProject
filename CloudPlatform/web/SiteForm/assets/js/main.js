$('.js-button-campaign').click(function () {

    $('.js-overlay-campaign').fadeIn();
    $('.js-overlay-campaign').addClass('disabled');
});

$('.js-close-campaign').click(function () {
    $('.js-overlay-campaign').fadeOut();

});

$(document).mouseup(function (e) {
    var popup = $('.js-popup-campaign');
    if (e.target != popup[0] && popup.has(e.target).length === 0) {
        $('.js-overlay-campaign').fadeOut();

    }
});

function setRelay(button) {
    var div = button.parentNode.parentNode;

    var address = div.id;
    var password = div.name;

    var relay = div.querySelector('#isRelayOpen');
    var status = relay.className;
    if (status === "btn btn-success") {
        sendRelayStatus(address,password,"close");
        relay.innerHTML = "CLOSED";
        relay.className = "btn btn-danger"
    } else if (status === "btn btn-danger") {
        sendRelayStatus(address,password,"open");
        relay.innerHTML = "OPEN";
        relay.className = "btn btn-success"
    }
    refresh(button.parentNode);
}

function refresh(button) {
    var div = button.parentNode;

    var address = div.id;
    var password = div.name;

    refreshData(div, address, password)
}

function addDeviceInHTML(xhr, address, password) {
    var element = document.getElementById("devices");

    var div = document.getElementById("mainDevice").cloneNode(true);
    div.className = "Box";
    div.id = address;

    buildDiv(div
        , address
        , password
        , xhr.getResponseHeader("temperature")
        , xhr.getResponseHeader("humidity")
        , xhr.getResponseHeader("time")
        , xhr.getResponseHeader("isWaterOnFlow")
        , xhr.getResponseHeader("IsRelayOpen"));

    element.appendChild(div);
}

function buildDiv(div, address, password, temperature, humidity, time, isWaterOnFlow, isRelayOpen) {

    if (isRelayOpen === "OPEN") {
        div.querySelector('#isRelayOpen').className = "btn btn-success";
    } else if (isRelayOpen === "CLOSED") {
        div.querySelector('#isRelayOpen').className = "btn btn-danger";
    }

    div.querySelector('#address').innerHTML = address;
    div.querySelector('#temperature').innerHTML = temperature;
    div.querySelector('#humidity').innerHTML = humidity;
    div.querySelector('#time').innerHTML = time;
    div.querySelector('#isWaterOnFlow').innerHTML = isWaterOnFlow;
    div.querySelector('#isRelayOpen').innerHTML = isRelayOpen;
    div.name = password;
}

function getData() {
    var address = document.getElementById("device-address").value;
    var password = document.getElementById("device-password").value;


    $.ajax({
        type: "POST",
        url: "/getData",
        contentType: "application/json;",
        data: JSON.stringify(
            {
                "link": address,
                "password": password
            }),
        success: function (output, status, xhr) {
            addDeviceInHTML(xhr, address, password);
            document.getElementById("result").innerText = output.result;

        }
    });
}

function refreshData(div, address, password) {
    $.ajax({
        type: "POST",
        url: "/getData",
        contentType: "application/json;",
        data: JSON.stringify(
            {
                "link": address,
                "password": password
            }),
        success: function (output, status, xhr) {
            buildDiv(div
                , address
                , password
                , xhr.getResponseHeader("temperature")
                , xhr.getResponseHeader("humidity")
                , xhr.getResponseHeader("time")
                , xhr.getResponseHeader("isWaterOnFlow")
                , xhr.getResponseHeader("IsRelayOpen"));

            document.getElementById("result").innerText = output.result;
        }
    });
}

function sendRelayStatus(address, password, status) {
    $.ajax({
        type: "POST",
        url: "/setRelay",
        contentType: "application/json;",
        data: JSON.stringify(
            {
                "link": address,
                "password": password,
                "status": status
            }),
        success: function (output, status, xhr) {
            document.getElementById("result").innerText = output.result;
        }
    });
}
