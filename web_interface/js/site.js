/* This software is licensed under the MIT License: https://github.com/spacehuhntech/esp8266_deauther */

var langJson = {};

function getE(name) {
	return document.getElementById(name);
}

function esc(str) {
	if (str) {
		return str.toString()
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/\"/g, '&quot;')
			.replace(/\'/g, '&#39;')
			.replace(/\//g, '&#x2F;');
	}
	return "";
}

function convertLineBreaks(str) {
	if (str) {
		str = str.toString();
		str = str.replace(/(?:\r\n|\r|\n)/g, '<br>');
		return str;
	}
	return "";
}

function showMessage(msg) {
	if (msg.startsWith("ERROR")) {
		getE("status").style.backgroundColor = "#d33";
		getE("status").innerHTML = "disconnected";

		console.error("disconnected (" + msg + ")");
	} else if (msg.startsWith("LOADING")) {
		getE("status").style.backgroundColor = "#fc0";
		getE("status").innerHTML = "loading...";
	} else {
		getE("status").style.backgroundColor = "#3c5";
		getE("status").innerHTML = "connected";

		console.log("" + msg + "");
	}
}

function getFile(adr, callback, timeout, method, onTimeout, onError) {
	/* fallback stuff */
	if (adr === undefined) return;
	if (callback === undefined) callback = function () { };
	if (timeout === undefined) timeout = 8000;
	if (method === undefined) method = "GET";
	if (onTimeout === undefined) {
		onTimeout = function () {
			showMessage("ERROR: timeout loading file " + adr);
		};
	}
	if (onError === undefined) {
		onError = function () {
			showMessage("ERROR: loading file: " + adr);
		};
	}

	/* create request */
	var request = new XMLHttpRequest();

	/* set parameter for request */
	request.open(method, encodeURI(adr), true);
	request.timeout = timeout;
	request.ontimeout = onTimeout;
	request.onerror = onError;
	request.overrideMimeType("application/json");

	request.onreadystatechange = function () {
		if (this.readyState == 4) {
			if (this.status == 200) {
				showMessage("CONNECTED");
				callback(this.responseText);
			}
		}
	};

	showMessage("LOADING");

	/* send request */
	request.send();

	console.log(adr);
}

function lang(key) {
	return convertLineBreaks(esc(langJson[key]));
}

function parseLang(fileStr) {
	langJson = JSON.parse(fileStr);
	if (langJson["lang"] != "en") {// no need to update the HTML	
		var elements = document.querySelectorAll("[data-translate]");
		for (i = 0; i < elements.length; i++) {
			var element = elements[i];
			element.innerHTML = lang(element.getAttribute("data-translate"));
		}
	}
	document.querySelector('html').setAttribute("lang", langJson["lang"]);
	if (typeof load !== 'undefined') load();
}

function loadLang() {
	var language = "default"; //navigator.language.slice(0, 2);
	getFile("lang/" + language + ".lang",
		parseLang,
		2000,
		"GET",
		function () {
			getFile("lang/en.lang", parseLang);
		}, function () {
			getFile("lang/en.lang", parseLang);
		}
	);
}

window.addEventListener('load', function () {
	getE("status").style.backgroundColor = "#3c5";
	getE("status").innerHTML = "connected";
});



// battery level here

// bat level updater loop
update_batLevel();
function update_batLevel() {
    getBatteryLevel();

    const intervalId = setInterval(function() {
        
        update_batLevel();
        
        clearInterval(intervalId);
        
        return
      }, 5000);

      
      return
}

function getBatteryLevel() {
	getFile("APIEvent_batLevel", update_batLevel2);

  	//update_batLevel2("899");
}

function update_batLevel2(batteryLevel_raw) {
	// convert the value from esp analog pin to a percentage
	let batteryLevel = (batteryLevel_raw - 790)/2;

    // change icon color
    levelString = batteryLevel.toString();

    var color = "#fff";
    const batteryIcon = document.getElementById("battery-icon");

	if (batteryLevel < 102 && batteryLevel > 100) {
		batteryLevel = 100;
	}

    if (batteryLevel > 100) {
      color = "#20c20e";
      levelString = "100";
      batteryIcon.textContent = `⚡`;
    } else if (batteryLevel > 60) {
      color = "#20c20e";
      batteryIcon.textContent = `${batteryLevel}%`;
    } else if (batteryLevel > 30) {
      color = "#FAA61A";
      batteryIcon.textContent = `${batteryLevel}%`;
    } else {
      color = "#F04747";
      batteryIcon.textContent = `${batteryLevel}%`;
    }

    getE("battery-icon").style.background = "linear-gradient(to right, "+color+" 0%, "+color+" "+levelString+"%, #4a4c50 "+levelString+"%, #4a4c50 100%)";

    showMessage("");
    
    return
}