$(document).ready(function () {

	chrome.storage.sync.get('userInfo', function (i) {
		if(!$.isEmptyObject(i)){
			$(".logout-wrapper").show();
			$(".login-wrapper").hide();
		}
	});

	$("#btnNewUser").on('click', function () {
		var url = "https://go.salesbox.com/desktop/#/login?mode=register";
		window.open(url , '_blank');
	});

	$("#btnLogout").on('click', function () {
		chrome.storage.sync.remove('userInfo');
		$(".logout-wrapper").hide();
		$(".login-wrapper").show();
	});

	$("#lform").on('submit', function (event) {
		event.preventDefault();
		var username = $("#username").val();
		var password = CryptoJS.MD5($("#password").val()).toString();

		var data = {
			"username": username,
			"hashPassword": password,
			"webPlatform": false,
			"deviceToken": "WEB_TOKEN",
			"version": "3.0"
		}

		var login_url = "https://production.salesbox.com/enterprise-v3.0/user/login";

		$.ajax({
	    type: "POST",
	    url: login_url,
	    data: JSON.stringify(data),
	    contentType: "application/json; charset=utf-8",
	    dataType: "JSON",
	    success: function(response){
	    	$("#llogin").show();
	    	$("#lform").hide();

	    	chrome.storage.sync.set({userInfo : response});
	    },
	    error: function(errMsg) {
	    }
		});
	});
});