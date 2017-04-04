(function(window, jQuery){
	chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {

		switch(request.msg) {
			case 'check-validation':
				chrome.storage.sync.get('userInfo', function (response) {
					if(!$.isEmptyObject(response)){
						sendResponse({
							status: true
						});
					} else {
						sendResponse({
							status: false
						});
					}
				});
				return true;
				break;

			case 'GetSizeList':
				var industry_list = "https://production.salesbox.com/administration-v3.0/workData/workData/getSizeTypes?token=" + request.token;

				$.ajax({
			    type: "GET",
			    url: industry_list,
			    contentType: "application/json; charset=utf-8",
			    success: function(response){
			    	sendResponse(response);
			    },
			    error: function(errMsg) {
			    	sendResponse();
			    }
				});
				return true;
				break;
				
			case 'GetIndustryList':
				var industry_list = "https://production.salesbox.com/administration-v3.0/workData/workData/industries?token=" + request.token;

				$.ajax({
			    type: "GET",
			    url: industry_list,
			    contentType: "application/json; charset=utf-8",
			    success: function(response){
			    	sendResponse(response);
			    },
			    error: function(errMsg) {
			    	sendResponse();
			    }
				});
				return true;
				break;

			case 'GetUserInfo':
				chrome.storage.sync.get('userInfo', function (response) {
					sendResponse(response);
				});
				return true;
				break;

			case 'GetOrganizationByKey':
				var url = "https://production.salesbox.com/organisation-v3.0/getOrganisationByLinkedInId?token=" + request.token + "&linkedinProfileId=" + request.data;
				$.ajax({
				    type: "GET",
				    url: url,
				    contentType: "application/json; charset=utf-8",
				    dataType: "JSON",
				    success: function(response){
				    	sendResponse(response);
				    },
				    error: function(errMsg) {
				    	sendResponse();
				    }
				});
				return true;
				break;

			case 'GetAllContactLinkedID':
				var url = "https://production.salesbox.com/contact-v3.0/getAllContactLinkedInId?token=" + request.token;
				$.ajax({
				    type: "GET",
				    url: url,
				    contentType: "application/json; charset=utf-8",
				    dataType: "JSON",
				    success: function(response){
				    	sendResponse(response);
				    },
				    error: function(errMsg) {
				    	sendResponse();
				    }
				});
				return true;
				break;

			case 'GetAllAccountLinkedID':
				var url = "https://production.salesbox.com/organisation-v3.0/getAllOrganisationLinkedInId?token=" + request.token;
				$.ajax({
				    type: "GET",
				    url: url,
				    contentType: "application/json; charset=utf-8",
				    dataType: "JSON",
				    success: function(response){
				    	sendResponse(response);
				    },
				    error: function(errMsg) {
				    	sendResponse();
				    }
				});
				return true;
				break;

			case 'GetContactByKey':
				var url = "https://production.salesbox.com/contact-v3.0/getContactByLinkedInId?token=" + request.token + "&linkedinProfileId=" + request.data + "&languageCode=en";
				$.ajax({
				    type: "GET",
				    url: url,
				    contentType: "application/json; charset=utf-8",
				    dataType: "JSON",
				    success: function(response){
				    	sendResponse(response);
				    },
				    error: function(errMsg) {
				    	sendResponse();
				    }
				});
				return true;
				break;

			case 'AddAccount':
				var data = request.data;
				var token = request.token;

				var addaccount_url = "https://production.salesbox.com/organisation-v3.0/add?token=" + token;

				$.ajax({
				    type: "POST",
				    url: addaccount_url,
				    data: JSON.stringify(data),
				    contentType: "application/json; charset=utf-8",
				    dataType: "JSON",
				    success: function(response){
				    	sendResponse(response);
				    },
				    error: function(errMsg) {
				    	sendResponse();
				    }
				});
				return true;
				break;

			case 'AddLead':
				var data = request.data;
				var token = request.token;

				var addlead_url = "https://production.salesbox.com/lead-v3.0/add?token=" + token;

				$.ajax({
				    type: "POST",
				    url: addlead_url,
				    data: JSON.stringify(data),
				    contentType: "application/json; charset=utf-8",
				    dataType: "JSON",
				    success: function(response){
				    	sendResponse(response);
				    },
				    error: function(errMsg) {
				    	sendResponse();
				    }
				});
				return true;
				break;

			case 'UpdateCustomField':
				var data = request.data;
				var token = request.token;
				var uuid = request.uuid;

				var updatecustomfield_url = "https://production.salesbox.com/enterprise-v3.0/customFieldValue/addOrEdit?token=" + token + "&objectId=" + uuid;

				$.ajax({
				    type: "POST",
				    url: updatecustomfield_url,
				    data: JSON.stringify(data),
				    contentType: "application/json; charset=utf-8",
				    dataType: "JSON",
				    success: function(response){
				    	sendResponse(response);
				    },
				    error: function(errMsg) {
				    	sendResponse();
				    }
				});
				return true;
				break;

			case 'UpdateAccount':
				var data = request.data;
				var token = request.token;

				var updateaccount_url = "https://production.salesbox.com/organisation-v3.0/update?token=" + token + "&languageCode=en";

				$.ajax({
				    type: "POST",
				    url: updateaccount_url,
				    data: JSON.stringify(data),
				    contentType: "application/json; charset=utf-8",
				    dataType: "JSON",
				    success: function(response){
				    	sendResponse(response);
				    },
				    error: function(errMsg) {
				    	sendResponse();
				    }
				});
				return true;
				break;

			case 'UpdateContact':
				var data = request.data;
				var token = request.token;

				var updatecontact_url = "https://production.salesbox.com/contact-v3.0/update?token=" + token + "&languageCode=en";

				$.ajax({
				    type: "POST",
				    url: updatecontact_url,
				    data: JSON.stringify(data),
				    contentType: "application/json; charset=utf-8",
				    dataType: "JSON",
				    success: function(response){
				    	sendResponse(response);
				    },
				    error: function(errMsg) {
				    	sendResponse();
				    }
				});
				return true;
				break;

			case 'AddContact':
				var data = request.data;
				var token = request.token;

				var addcontact_url = "https://production.salesbox.com/contact-v3.0/add?token=" + token + "&languageCode=en";

				$.ajax({
			    type: "POST",
			    url: addcontact_url,
			    data: JSON.stringify(data),
			    contentType: "application/json; charset=utf-8",
			    dataType: "JSON",
			    success: function(response){
			    	sendResponse(response);
			    },
			    error: function(errMsg) {
			    	sendResponse();
			    }
				});
				return true;
				break;
			default:
				console.log("Unknown request was found.");
				break;
		}
			
	});
})(window, $);