(function(window, jQuery) {

	var organization = {};
	var contact = {}
	var $head = $("head");
	var $css = "<link href=" + "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" + " rel='stylesheet'>";

	$head.append($css);

	var css_url = chrome.extension.getURL("assets/css/style.css");
	$css = "<link href=" + css_url + " rel='stylesheet'>";

	$head.append($css);

	var real_timer ;
	var current_location = window.location.href;

	// Check if Salesbox extension is activated
	chrome.extension.sendMessage({
		msg: 'check-validation'
	}, function (response) {
		var status = response.status;
		if(status == true) {
			
			var location = window.location.href;
			if(location.indexOf('https://www.linkedin.com/company-beta') > -1) {
				addSalesBoxButton("company");
			} else if(location.indexOf('https://www.linkedin.com/in') > -1){
				addSalesBoxButton("user");
			} else if(location.indexOf('https://www.linkedin.com/search/results/people') > -1){
				addSalesBoxButton("search-people")
			} else if(location.indexOf('https://www.linkedin.com/search/results/companies') > -1) {
				addSalesBoxButton("search-company")
			} else if(location.indexOf("https://www.linkedin.com/mynetwork/invite-connect/connections/" > -1)){
				addSalesBoxButton("mynetwork");
			}

			real_timer = setInterval(function () {
				var href = window.location.href;
				if(current_location != href){
					current_location = href;
					if($("span.linkedin-salesboxbutton").length > 0 ){
						$("span.linkedin-salesboxbutton").remove();
						$("img.salesbox-ajax").remove();
					}

					if(href.indexOf('https://www.linkedin.com/company-beta') > -1) {
						addSalesBoxButton("company");
					} else if(href.indexOf('https://www.linkedin.com/in') > -1){
						addSalesBoxButton("user");
					} else if(href.indexOf('https://www.linkedin.com/search/results/people') > -1){
						addSalesBoxButton("search-people");
					} else if(href.indexOf('https://www.linkedin.com/search/results/companies') > -1) {
						addSalesBoxButton("search-company");
					} else if(href.indexOf("https://www.linkedin.com/mynetwork/invite-connect/connections/" > -1)){
						addSalesBoxButton("mynetwork");
					}
				}
			},1000);
		} else {
			return false;
		}
	});

	function addSalesBoxButton(type) {

		var timer = setInterval(function () {
			if(type == 'company'){

				//////////////////////// CUSTOMER IS IN COMPANY PROFILE //////////////////////////////

				var parent = $("div.org-top-card-module__company-actions-bar");
				if($("div.org-top-card-module__company-actions-bar .org-top-card-actions__follow-btn").length > 0){

					/***** Check if this company is already added ************/
					var key = window.location.href;

					chrome.extension.sendMessage({
						msg: 'GetUserInfo'
					}, function (response) {
						if(!$.isEmptyObject(response)){
							var token = response.userInfo.userDTO.token;

							chrome.extension.sendMessage({
								msg: 'GetOrganizationByKey',
								data: key,
								token: token
							}, function (organization_res) {
								organization = organization_res
								if($.isEmptyObject(organization_res)){
									/**** Append <Add to Salesbox> button ****/
									$("<span class='linkedin-salesboxbutton company-adding'>Add to Salesbox</span>").insertBefore("div.org-top-card-module__company-actions-bar .org-top-card-actions__follow-btn");

									/**** Add Ajax Spin Image **********/
									$('<img class="salesbox-ajax salesbox-ajax-company" src=' + chrome.extension.getURL("assets/img/loading.gif") + '>').insertBefore("div.org-top-card-module__company-actions-bar .org-top-card-actions__follow-btn");

									/**** Append Menu ****/
									parent.find("span.linkedin-salesboxbutton").append("<ul class='salesbox-menu'></ul>");
									parent.find("span.linkedin-salesboxbutton").find("ul").append("<li id='salesbox_add_account'>Add as Account</li>");
									parent.find("span.linkedin-salesboxbutton").find("ul").append("<li id='salesbox_add_lead'>Add as Lead</li>");
									
									/**** Change width of parent ***/
									var width = parent.outerWidth() + 190;
									parent.css('width', width + 'px');

									$(".org-top-card-module__container").css('z-index', 9999);
								} else {
									/**** Append <Add to Salesbox> button ****/
									$("<span class='linkedin-salesboxbutton company-adding add-success'>Added</span>").insertBefore("div.org-top-card-module__company-actions-bar .org-top-card-actions__follow-btn");

									/**** Change width of parent ***/
									var width = parent.outerWidth() + 190;
									parent.css('width', width + 'px');
								}
							});
						};
					});
					clearInterval(timer);
				}
			} else if(type == 'user'){

				//////////////////////// CUSTOMER IS IN USER PROFILE //////////////////////////////

				var parent = $(".pv-top-card-section__actions");
				if(parent.length > 0){

					/***** Check if this user is already added ************/
					var key = window.location.href;

					chrome.extension.sendMessage({
						msg: 'GetUserInfo'
					}, function (response) {
						if(!$.isEmptyObject(response)){
							var token = response.userInfo.userDTO.token;

							chrome.extension.sendMessage({
								msg: 'GetContactByKey',
								data: key,
								token: token
							}, function (contact_res) {
								contact = contact_res;

								chrome.extension.sendMessage({
									msg: 'GetOrganizationByKey',
									data: key,
									token: token
								}, function (organization_res) {
									organization = organization_res;

									if($.isEmptyObject(contact_res)){
										/**** Append <Add to Salesbox> button ****/
										parent.append("<span class='linkedin-salesboxbutton'>Add to Salesbox</span>");

										/**** Append <Click Show> widget ***/
										parent.append("<div class='salesbox-showmorewidget'><span class='close'>x</span><span class='conainer'>Click show more to add personal info to Salesbox</span></div>");

										/**** Append Menu ****/
										parent.find("span.linkedin-salesboxbutton").append("<ul class='salesbox-menu'></ul>");
										parent.find("span.linkedin-salesboxbutton").find("ul").append("<li id='salesbox_add_contact'>Add as Contact</li>");
										parent.find("span.linkedin-salesboxbutton").find("ul").append("<li id='salesbox_add_lead'>Add as Lead</li>");

										/**** Add Ajax Spin Image **********/
										parent.append('<img class="salesbox-ajax" src=' + chrome.extension.getURL("assets/img/loading.gif") + '>');

										/**** Append Logo Icon to <Show more info> ****/
										for(var i = 0 ; i < $("h2.pv-profile-section__card-heading").length; i++){
											if($("h2.pv-profile-section__card-heading").eq(i).html().trim() == 'Contact and Personal Info'){
												$("h2.pv-profile-section__card-heading").eq(i).append("<img class='salesbox-info-logo'>");
												$("h2.pv-profile-section__card-heading").eq(i).find("img").attr("src", chrome.extension.getURL("assets/img/logo.png"));
												break;
											}
										}
									} else {
										/**** Append <Add to Salesbox> button ****/
										parent.append("<span class='linkedin-salesboxbutton add-success'>Added</span>");

										/**** Append <Click Show> widget ***/
										parent.append("<div class='salesbox-showmorewidget'><span class='close'>x</span><span class='conainer'>Click show more to add personal info to Salesbox</span></div>");

										/**** Append Logo Icon to <Show more info> ****/
										for(var i = 0 ; i < $("h2.pv-profile-section__card-heading").length; i++){
											if($("h2.pv-profile-section__card-heading").eq(i).html().trim() == 'Contact and Personal Info'){
												$("h2.pv-profile-section__card-heading").eq(i).append("<img class='salesbox-info-logo'>");
												$("h2.pv-profile-section__card-heading").eq(i).find("img").attr("src", chrome.extension.getURL("assets/img/logo.png"));
												break;
											}
										}
									}
								});
							});
						}
					});
					clearInterval(timer);
				}
			} else if(type == 'search-people'){

				////// CUSTOMER IS IN SEARCH RESULT (PEOPLE) /////
				var parent = $("li.search-result__occluded-item div.search-result__actions");

				if(parent.length > 0){

					for(var i = 0 ;  i < parent.length ; i++){
						if(parent.eq(i).find("span.linkedin-salesboxbutton-person-search").length == 0){
							var target = parent.eq(i);

							/**** Append <Add to Salesbox> button ****/
							target.find(".search-result__actions--primary").before($("<span class='linkedin-salesboxbutton-person-search'>Add to Salesbox</span>"));

							/**** Add Ajax Spin Image **********/
							target.find(".search-result__actions--primary").before($('<img class="salesbox-ajax salesbox-ajax-company" src=' + chrome.extension.getURL("assets/img/loading.gif") + '>'));

							/**** Append Menu ****/
							target.find("span.linkedin-salesboxbutton-person-search").append("<ul class='submenu'></ul>");
							target.find("span.linkedin-salesboxbutton-person-search").find("ul").append("<li id='add_contact_search_people'>Add as Contact</li>");
							target.find("span.linkedin-salesboxbutton-person-search").find("ul").append("<li id='add_lead_search_people'>Add as Lead</li>");
						}
					}

					if(parent.length == 10 ){
						clearInterval(timer);	
					}
				}
			} else if(type == 'search-company'){

				////// CUSTOMER IS IN SEARCH RESULT (COMPANY) /////
				var parent = $("li.search-result__occluded-item div.search-result__actions");

				if(parent.length > 0){

					for(var i = 0 ;  i < parent.length ; i++){
						if(parent.eq(i).find("span.linkedin-salesboxbutton-company-search").length == 0){
							var target = parent.eq(i);

							/**** Append <Add to Salesbox> button ****/
							target.find(".search-result__actions--primary").before($("<span class='linkedin-salesboxbutton-company-search'>Add to Salesbox</span>"));

							/**** Add Ajax Spin Image **********/
							target.find(".search-result__actions--primary").before($('<img class="salesbox-ajax salesbox-ajax-company" src=' + chrome.extension.getURL("assets/img/loading.gif") + '>'));

							/**** Append Menu ****/
							target.find("span.linkedin-salesboxbutton-company-search").append("<ul class='submenu'></ul>");
							target.find("span.linkedin-salesboxbutton-company-search").find("ul").append("<li id='add_account_search_company'>Add as Account</li>");
							target.find("span.linkedin-salesboxbutton-company-search").find("ul").append("<li id='add_lead_search_company'>Add as Lead</li>");
						}
					}

					if(parent.length == 10 ){
						clearInterval(timer);	
					}
				}
			} else {
				////// CUSTOMER IS IN CONNECTION PAGE /////
				var parent = $("li.mn-person-card.connection-card div.mn-person-card__card-actions");

				if(parent.length > 0){

					for(var i = 0 ;  i < parent.length ; i++){
						if(parent.eq(i).find("span.linkedin-salesboxbutton-person-connection").length == 0){
							var target = parent.eq(i);

							/**** Append <Add to Salesbox> button ****/
							target.find(".message-anywhere-button").before($("<span class='linkedin-salesboxbutton-person-connection'>Add to Salesbox</span>"));

							/**** Add Ajax Spin Image **********/
							target.find(".message-anywhere-button").before($('<img class="salesbox-ajax salesbox-ajax-company" src=' + chrome.extension.getURL("assets/img/loading.gif") + '>'));

							/**** Append Menu ****/
							target.find("span.linkedin-salesboxbutton-person-connection").append("<ul class='submenu'></ul>");
							target.find("span.linkedin-salesboxbutton-person-connection").find("ul").append("<li id='add_contact_connection_people'>Add as Contact</li>");
							target.find("span.linkedin-salesboxbutton-person-connection").find("ul").append("<li id='add_lead_connection_people'>Add as Lead</li>");
						}
					}

					if(parent.length == parseInt($("h3.mn-connections__title").html().trim().split(" ")[0])){
						clearInterval(timer);	
					}
				}
			}
		},1000);
	}

	$(document).on("click", function () {
		$("ul.salesbox-menu").hide();
		$("ul.submenu").hide();
	});

	$(document).on("click", 'span.linkedin-salesboxbutton',function (event) {
		event.stopPropagation();
		$("ul.salesbox-menu").show();
	});

	$(document).on('click', 'button.contact-see-more-less', function () {
		chrome.extension.sendMessage({
			msg: 'GetUserInfo'
		}, function (userInfo) {
			var token = userInfo.userInfo.userDTO.token;

			$.ajax({
				url: "https://production-qa.salesbox.com/enterprise-v3.0/customField/checkIfURLTypeExist?token=" + token +"&urlType=LINKEDIN",
				method: 'GET',
				success: function (response) {
					isLinkedinCustomfield = true;
					$.ajax({
						url: "https://production-qa.salesbox.com/enterprise-v3.0/customField/checkIfURLTypeExist?token=" + token +"&urlType=SKYPE",
						method: 'GET',
						success: function (response) {
							isSkypeCustomField = true;
							CheckContactPersonalInformation(isLinkedinCustomfield, isSkypeCustomField);
						},
						error: function (error) {
							isSkypeCustomField = false;
							CheckContactPersonalInformation(isLinkedinCustomfield, isSkypeCustomField);
						}
					});
				},
				error: function (error) {
					isLinkedinCustomfield = false;
					$.ajax({
						url: "https://production-qa.salesbox.com/enterprise-v3.0/customField/checkIfURLTypeExist?token=" + token +"&urlType=SKYPE",
						method: 'GET',
						success: function (response) {
							isSkypeCustomField = true;
							CheckContactPersonalInformation(isLinkedinCustomfield, isSkypeCustomField);
						},
						error: function (error) {
							isSkypeCustomField = false;
							CheckContactPersonalInformation(isLinkedinCustomfield, isSkypeCustomField);
						}
					});
				}
			});
		});
	});

	$(document).on('click', 'ul.salesbox-menu li', function(event) {
		event.stopPropagation();
		$("ul.salesbox-menu").removeAttr('style');
		$(".linkedin-salesboxbutton").hide();
		$(".salesbox-ajax").show();
	});

	$(document).on('click', 'ul.submenu li', function(event) {
		event.stopPropagation();
		$(this).parent().hide();
	});

	$(document).on('click', "#salesbox_add_account ", function () {
		chrome.extension.sendMessage({
			msg: 'GetUserInfo'
		}, function (response) {
			if(!$.isEmptyObject(response)){

				var token = response.userInfo.userDTO.token;
				var company_name = $("h1.org-top-card-module__name").html().trim();

				var imageUrl = $("img.org-top-card-module__logo").attr("src");
				toDataUrl(imageUrl, function(base64Img) {

					var dd = getdata(base64Img);
          var apiData = new FormData();
          apiData.append("avatar", dd);          

          var uploadavatar_url = "https://production-qa.salesbox.com/document-v3.0/photo/uploadAvatar?token=" + token;

					$.ajax({
				    type: "POST",
				    url: uploadavatar_url,
				    data: apiData,
				    cache: false,
	          contentType: false,
	          processData: false,
				    success: function(response){
				    	var avatarID = response.avatar;
				    	chrome.extension.sendMessage({
							 	msg: 'GetIndustryList',
							 	token: token
							}, function (indust_response) {
							 	var industries = indust_response.workDataOrganisationDTOList;
							 	var industry = {};
							 	if($("dd.org-about-company-module__industry").length > 0){
							 		industry = getIndustry(industries, $("dd.org-about-company-module__industry").html().trim());
							 	}

							 	chrome.extension.sendMessage({
							 		msg: 'GetSizeList',
							 		token: token
							 	}, function (size_response) {
							 		var sizes = size_response.sizeTypeList;
							 		var size = {}

							 		if($("dd.org-about-company-module__staff-count-range").length > 0){
								 		size = getSize(sizes, $("dd.org-about-company-module__staff-count-range").html().trim().split(" ")[0]);
								 	}

								 	var account_data = {
										avatar: avatarID,
										additionalEmailList: [],
										additionalPhoneList: [],
										email: null,
										industry: industry,
										isChanged: false,
										isPrivate: false,
										mainEmailType: "EMAIL_DEPARTMENT",
										mainPhoneType: "PHONE_DEPARTMENT",
										mediaType: "MANUAL",
										name: company_name,
										numberGoalsMeeting: 0,
										participantList: [],
										phone: null,
										size: size,
										type: null,
										city: $(".org-top-card-module__location").length > 0 ? $(".org-top-card-module__location").html().trim() : null,
										web: $("dd.org-about-company-module__company-page-url a").length > 0 ? $("dd.org-about-company-module__company-page-url a").html().trim() : null,
										linkedinProfileId: window.location.href
									};

									chrome.extension.sendMessage({
										msg: 'AddAccount',
										data: account_data,
										token: token
									}, function (res) {
										if(!$.isEmptyObject(res)){
											$(".salesbox-ajax").hide();
											$(".linkedin-salesboxbutton").show();
											$(".linkedin-salesboxbutton").text("Added");
											$(".linkedin-salesboxbutton").addClass("add-success");
										} else {
											$(".salesbox-ajax").hide();
											$(".linkedin-salesboxbutton").show();		
										}
									});
							 	});
							});
				    }
					});
		  	});
			};
		});
	});

	$(document).on('click', "#salesbox_add_contact", function () {
		chrome.extension.sendMessage({
			msg: 'GetUserInfo'
		}, function (response) {
			if(!$.isEmptyObject(response)){

				var company_name = null;
				var title = null;
				if($("section.pv-profile-section.experience-section ul.pv-profile-section__section-info").length >0){
					if($("section.pv-profile-section.experience-section ul.pv-profile-section__section-info").find("li").length > 0){

						company_name = $("section.pv-profile-section.experience-section ul.pv-profile-section__section-info").find("li").eq(0).find("div.pv-entity__summary-info .pv-entity__secondary-title").text();
						title = $("section.pv-profile-section.experience-section ul.pv-profile-section__section-info").find("li").eq(0).find("div.pv-entity__summary-info h3").text();

						var company_logo = $("section.pv-profile-section.experience-section ul.pv-profile-section__section-info").find("li").eq(0).find("div.pv-position-entity__logo img.pv-position-entity__logo-img").attr("src");

						var token = response.userInfo.userDTO.token;

						toDataUrl(company_logo, function (base64Img) {
							var dd = getdata(base64Img);
							var apiData = new FormData();
							apiData.append("avatar", dd);

							var uploadavatar_url = "https://production-qa.salesbox.com/document-v3.0/photo/uploadAvatar?token=" + token;

							$.ajax({
						    type: "POST",
						    url: uploadavatar_url,
						    data: apiData,
						    cache: false,
			          contentType: false,
			          processData: false,
						    success: function(response){
						    	var avatarID = response.avatar;

						    	var account_data = {
										avatar: avatarID,
										additionalEmailList: [],
										additionalPhoneList: [],
										email: null,
										industry: null,
										isChanged: false,
										isPrivate: false,
										mainEmailType: null,
										mainPhoneType: null,
										mediaType: "MANUAL",
										name: company_name,
										numberGoalsMeeting: 0,
										participantList: [],
										phone: null,
										size: null,
										type: null,
										linkedinProfileId: window.location.href
									};

									chrome.extension.sendMessage({
										msg: 'AddAccount',
										data: account_data,
										token: token
									}, function (res) {
										if(!$.isEmptyObject(res)){
											var organisationId = res.uuid;

											var name = $("h1.pv-top-card-section__name").html().trim();
											var street = $(".pv-top-card-section__location").html().trim();
											var locations = street.split(", ");
											var country = "";
											var region = "";
											var city = "";
											var street = "";
											if(locations.length == 1){
												country = locations[0];
											} else if(locations.length == 2){
												region = locations[0];
												country = locations[1];
											} else {
												city = locations[0];
												region = locations[1];
												country = locations[2];
											}

											var contact_logo = $("button.pv-top-card-section__photo img").attr("src");

											toDataUrl(contact_logo, function (base64Img) {
												var ddd = getdata(base64Img);
												var contact_avatar_data = new FormData();
												contact_avatar_data.append("avatar", ddd);

												var uploadavatar_url = "https://production-qa.salesbox.com/document-v3.0/photo/uploadAvatar?token=" + token;

												$.ajax({
											    type: "POST",
											    url: uploadavatar_url,
											    data: contact_avatar_data,
											    cache: false,
								          contentType: false,
								          processData: false,
											    success: function(response_avatar){
											    	var ava_id = response_avatar.avatar;

											    	var contact_data = {
															avatar: ava_id,
															additionalEmailList: [],
															additionalPhoneList: [],
															city: city,
															country: country,
															region: region,
															discProfile: "NONE",
															firstName: name.split(" ")[0],
															industry: null,
															lastName: name.split(" ")[1],
															mainEmailType: "EMAIL_WORK",
															mainPhoneType: "PHONE_WORK",
															mediaType: "MANUAL",
															organisationId:  organisationId,
															participantList: [],
															relationship: "YELLOW",
															title: title,
															street: null,
															type: null,
															zipCode: null,
															linkedinProfileId: window.location.href
														}

														chrome.extension.sendMessage({
															msg: 'AddContact',
															data : contact_data,
															token: token
														}, function (result) {
															if(!$.isEmptyObject(result)){
																contact = result;
																$(".salesbox-ajax").hide();
																$(".linkedin-salesboxbutton").show();
																$(".linkedin-salesboxbutton").text("Added");
																$(".linkedin-salesboxbutton").addClass("add-success");
															} else {
																$(".salesbox-ajax").hide();
																$(".linkedin-salesboxbutton").show();		
															}
														});
											    }
											  });
											});
										} else {
											$(".salesbox-ajax").hide();
											$(".linkedin-salesboxbutton").show();
										}
									});
						    }
							});
						});
					}
				} else {
					var token = response.userInfo.userDTO.token;

					var name = $("h1.pv-top-card-section__name").html().trim();
					var street = $(".pv-top-card-section__location").html().trim();
					var locations = street.split(", ");
					var country = "";
					var region = "";
					var city = "";
					var street = "";
					if(locations.length == 1){
						country = locations[0];
					} else if(locations.length == 2){
						region = locations[0];
						country = locations[1];
					} else {
						city = locations[0];
						region = locations[1];
						country = locations[2];
					}

					var contact_logo = $("button.pv-top-card-section__photo img").attr("src");

					toDataUrl(contact_logo, function (base64Img) {
						var ddd = getdata(base64Img);
						var contact_avatar_data = new FormData();
						contact_avatar_data.append("avatar", ddd);

						var uploadavatar_url = "https://production-qa.salesbox.com/document-v3.0/photo/uploadAvatar?token=" + token;

						$.ajax({
					    type: "POST",
					    url: uploadavatar_url,
					    data: contact_avatar_data,
					    cache: false,
		          contentType: false,
		          processData: false,
					    success: function(response_avatar){
					    	var av_id = response_avatar.avatar;
					    	var contact_data = {
									avatar: av_id,
									additionalEmailList: [],
									additionalPhoneList: [],
									city: city,
									country: country,
									region: region,
									discProfile: "NONE",
									firstName: name.split(" ")[0],
									industry: null,
									lastName: name.split(" ")[1],
									mainEmailType: "EMAIL_WORK",
									mainPhoneType: "PHONE_WORK",
									mediaType: "MANUAL",
									participantList: [],
									relationship: "YELLOW",
									street: null,
									type: null,
									zipCode: null,
									linkedinProfileId: window.location.href
								}

								chrome.extension.sendMessage({
									msg: 'AddContact',
									data : contact_data,
									token: token
								}, function (result) {
									if(!$.isEmptyObject(result)){
										$(".salesbox-ajax").hide();
										$(".linkedin-salesboxbutton").show();
										$(".linkedin-salesboxbutton").text("Added");
										$(".linkedin-salesboxbutton").addClass("add-success");
									} else {
										$(".salesbox-ajax").hide();
										$(".linkedin-salesboxbutton").show();		
									}
								});
					    }
					  });
					});
				};
			};
		});
	});
	
	$(document).on('click', "#add_contact_search_people", function () {

		var button = $(this).parents(".search-result__occluded-item").find(".linkedin-salesboxbutton-person-search");
		var gif_image = $(this).parents(".search-result__occluded-item").find(".salesbox-ajax-company");
		button.hide();
		gif_image.show();

		var at_list = ["at","في","在","在","na","på","op","à","beim","di","a","で","...에서","pada","på","w","Em","la","в","a","på","sa","At"]

		var parent = $(this).parents(".search-result__occluded-item");

		var key = parent.find(".search-result__result-link").attr("href");

		var contact_name = parent.find("span.name.actor-name").html().trim();
		var address = parent.find(".subline-level-2.search-result__truncate").html().trim();
		var logo = parent.find(".search-result__image img").attr("src");
		var title_name_account = parent.find(".subline-level-1.search-result__truncate").html().trim();
		var title = "";
		var company = "";
		for(var i = 0 ; i < at_list.length; i++){
			if(title_name_account.indexOf(" " + at_list[i] + " ") > -1 ){
				title = title_name_account.split(" " + at_list[i] + " ")[0];
				company = title_name_account.split(" " + at_list[i] + " ")[1];
				break;
			} else {
				title = title_name_account;
			}
		}		

		var locations = address.split(", ");
		var country = "";
		var region = "";
		var city = "";
		var street = "";
		if(locations.length == 1){
			country = locations[0];
		} else if(locations.length == 2){
			region = locations[0];
			country = locations[1];
		} else {
			city = locations[0];
			region = locations[1];
			country = locations[2];
		}

		if(company == ""){
			chrome.extension.sendMessage({
				msg: 'GetUserInfo'
			}, function (userInfo) {
				if(!$.isEmptyObject(userInfo)) {

					var token = userInfo.userInfo.userDTO.token;

					toDataUrl(logo, function (base64Img) {
						var ddd = getdata(base64Img);
						var contact_avatar_data = new FormData();
						contact_avatar_data.append("avatar", ddd);

						var uploadavatar_url = "https://production-qa.salesbox.com/document-v3.0/photo/uploadAvatar?token=" + token;

						$.ajax({
					    type: "POST",
					    url: uploadavatar_url,
					    data: contact_avatar_data,
					    cache: false,
		          contentType: false,
		          processData: false,
					    success: function(response_avatar){
					    	var av_id = response_avatar.avatar;
					    	var contact_data = {
									avatar: av_id,
									additionalEmailList: [],
									additionalPhoneList: [],
									city: city,
									country: country,
									region: region,
									discProfile: "NONE",
									firstName: contact_name.split(" ")[0],
									industry: null,
									lastName: contact_name.split(" ")[1],
									mainEmailType: "EMAIL_WORK",
									mainPhoneType: "PHONE_WORK",
									mediaType: "MANUAL",
									participantList: [],
									relationship: "YELLOW",
									street: null,
									type: null,
									zipCode: null,
									title: title,
									linkedinProfileId: key
								}

								chrome.extension.sendMessage({
									msg: 'AddContact',
									data : contact_data,
									token: token
								}, function (result) {
									if(!$.isEmptyObject(result)){
										gif_image.hide();
										button.show();
										button.text("Added");
										button.addClass("add-success");
									} else {
										gif_image.hide();
										button.show();
									}
								});
					    }
					  });
					});
				}
			});
		} else {
			chrome.extension.sendMessage({
				msg: 'GetUserInfo'
			}, function (userInfo) {
				if(!$.isEmptyObject(userInfo)) {

					var token = userInfo.userInfo.userDTO.token;

					var account_data = {
						avatar: null,
						additionalEmailList: [],
						additionalPhoneList: [],
						email: null,
						industry: null,
						isChanged: false,
						isPrivate: false,
						mainEmailType: "EMAIL_DEPARTMENT",
						mainPhoneType: "PHONE_DEPARTMENT",
						mediaType: "MANUAL",
						name: company,
						numberGoalsMeeting: 0,
						participantList: [],
						phone: null,
						size: null,
						type: null,
						city: address,
						linkedinProfileId: key
					};

					chrome.extension.sendMessage({
						msg: 'AddAccount',
						data: account_data,
						token: token
					}, function (res) {
						var uuid = res.uuid;

						var contact_name = parent.find("span.name.actor-name").html().trim();
						var address = parent.find(".subline-level-2.search-result__truncate").html().trim();
						var logo = parent.find(".search-result__image img").attr("src");

						var locations = address.split(", ");
						var country = "";
						var region = "";
						var city = "";
						var street = "";
						if(locations.length == 1){
							country = locations[0];
						} else if(locations.length == 2){
							region = locations[0];
							country = locations[1];
						} else {
							city = locations[0];
							region = locations[1];
							country = locations[2];
						}
						toDataUrl(logo, function (base64Img) {
							var ddd = getdata(base64Img);
							var contact_avatar_data = new FormData();
							contact_avatar_data.append("avatar", ddd);

							var uploadavatar_url = "https://production-qa.salesbox.com/document-v3.0/photo/uploadAvatar?token=" + token;

							$.ajax({
						    type: "POST",
						    url: uploadavatar_url,
						    data: contact_avatar_data,
						    cache: false,
			          contentType: false,
			          processData: false,
						    success: function(response_avatar){
						    	var av_id = response_avatar.avatar;
						    	var contact_data = {
										avatar: av_id,
										additionalEmailList: [],
										additionalPhoneList: [],
										city: city,
										country: country,
										region: region,
										discProfile: "NONE",
										firstName: contact_name.split(" ")[0],
										industry: null,
										lastName: contact_name.split(" ")[1],
										mainEmailType: "EMAIL_WORK",
										mainPhoneType: "PHONE_WORK",
										mediaType: "MANUAL",
										participantList: [],
										relationship: "YELLOW",
										street: null,
										type: null,
										zipCode: null,
										title : title,
										organisationId: uuid,
										linkedinProfileId: key
									}

									chrome.extension.sendMessage({
										msg: 'AddContact',
										data : contact_data,
										token: token
									}, function (result) {
										if(!$.isEmptyObject(result)){
											gif_image.hide();
											button.show();
											button.text("Added");
											button.addClass("add-success");
										} else {
											gif_image.hide();
											button.show();
										}
									});
						    }
						  });
						});
					});
				}
			});
		}
	});

	$(document).on('click', "#add_lead_search_people", function () {
		
	});

	$(document).on('click', "#add_contact_connection_people", function () {

		var button = $(this).parents(".mn-person-card.connection-card").find(".linkedin-salesboxbutton-person-connection");
		var gif_image = $(this).parents(".mn-person-card.connection-card").find(".salesbox-ajax-company");
		button.hide();
		gif_image.show();

		var at_list = ["at","في","在","在","na","på","op","à","beim","di","a","で","...에서","pada","på","w","Em","la","в","a","på","sa","At"]

		var parent = $(this).parents(".mn-person-card.connection-card");

		var key = parent.find(".mn-person-info__link").attr("href");

		var contact_name = parent.find("span.mn-person-info__name").html().trim();
		var logo = parent.find(".mn-person-info__picture img").attr("src");

		var title_name_account = parent.find(".mn-person-info__occupation").html().trim();

		var title = "";
		var company = "";
		for(var i = 0 ; i < at_list.length; i++){
			if(title_name_account.indexOf(" " + at_list[i] + " ") > -1 ){
				title = title_name_account.split(" " + at_list[i] + " ")[0];
				company = title_name_account.split(" " + at_list[i] + " ")[1];
				break;
			} else {
				title = title_name_account;
			}
		}

		if(company == ""){
			chrome.extension.sendMessage({
				msg: 'GetUserInfo'
			}, function (userInfo) {
				if(!$.isEmptyObject(userInfo)) {

					var token = userInfo.userInfo.userDTO.token;

					toDataUrl(logo, function (base64Img) {
						var ddd = getdata(base64Img);
						var contact_avatar_data = new FormData();
						contact_avatar_data.append("avatar", ddd);

						var uploadavatar_url = "https://production-qa.salesbox.com/document-v3.0/photo/uploadAvatar?token=" + token;

						$.ajax({
					    type: "POST",
					    url: uploadavatar_url,
					    data: contact_avatar_data,
					    cache: false,
		          contentType: false,
		          processData: false,
					    success: function(response_avatar){
					    	var av_id = response_avatar.avatar;
					    	var contact_data = {
									avatar: av_id,
									additionalEmailList: [],
									additionalPhoneList: [],
									city: null,
									country: null,
									discProfile: "NONE",
									firstName: contact_name.split(" ")[0],
									industry: null,
									lastName: contact_name.split(" ")[1],
									mainEmailType: "EMAIL_WORK",
									mainPhoneType: "PHONE_WORK",
									mediaType: "MANUAL",
									participantList: [],
									relationship: "YELLOW",
									street: null,
									type: null,
									zipCode: null,
									title: title,
									linkedinProfileId: key
								}

								chrome.extension.sendMessage({
									msg: 'AddContact',
									data : contact_data,
									token: token
								}, function (result) {
									if(!$.isEmptyObject(result)){
										gif_image.hide();
										button.show();
										button.text("Added");
										button.addClass("add-success");
									} else {
										gif_image.hide();
										button.show();
									}
								});
					    }
					  });
					});
				}
			});
		} else {
			chrome.extension.sendMessage({
				msg: 'GetUserInfo'
			}, function (userInfo) {
				if(!$.isEmptyObject(userInfo)) {

					var token = userInfo.userInfo.userDTO.token;

					var account_data = {
						avatar: null,
						additionalEmailList: [],
						additionalPhoneList: [],
						email: null,
						industry: null,
						isChanged: false,
						isPrivate: false,
						mainEmailType: "EMAIL_DEPARTMENT",
						mainPhoneType: "PHONE_DEPARTMENT",
						mediaType: "MANUAL",
						name: company,
						numberGoalsMeeting: 0,
						participantList: [],
						phone: null,
						size: null,
						type: null,
						city: null,
						linkedinProfileId: key
					};

					chrome.extension.sendMessage({
						msg: 'AddAccount',
						data: account_data,
						token: token
					}, function (res) {
						var uuid = res.uuid;

						toDataUrl(logo, function (base64Img) {
							var ddd = getdata(base64Img);
							var contact_avatar_data = new FormData();
							contact_avatar_data.append("avatar", ddd);

							var uploadavatar_url = "https://production-qa.salesbox.com/document-v3.0/photo/uploadAvatar?token=" + token;

							$.ajax({
						    type: "POST",
						    url: uploadavatar_url,
						    data: contact_avatar_data,
						    cache: false,
			          contentType: false,
			          processData: false,
						    success: function(response_avatar){
						    	var av_id = response_avatar.avatar;
						    	var contact_data = {
										avatar: av_id,
										additionalEmailList: [],
										additionalPhoneList: [],
										city: null,
										country: null,
										discProfile: "NONE",
										firstName: contact_name.split(" ")[0],
										industry: null,
										lastName: contact_name.split(" ")[1],
										mainEmailType: "EMAIL_WORK",
										mainPhoneType: "PHONE_WORK",
										mediaType: "MANUAL",
										participantList: [],
										relationship: "YELLOW",
										street: null,
										type: null,
										zipCode: null,
										title : title,
										organisationId: uuid,
										linkedinProfileId: key
									}

									chrome.extension.sendMessage({
										msg: 'AddContact',
										data : contact_data,
										token: token
									}, function (result) {
										if(!$.isEmptyObject(result)){
											gif_image.hide();
											button.show();
											button.text("Added");
											button.addClass("add-success");
										} else {
											gif_image.hide();
											button.show();
										}
									});
						    }
						  });
						});
					});
				}
			});
		}
	});

	$(document).on('click', "#add_lead_connection_people", function () {
		
	});
	$(document).on('click', "#add_account_search_company", function () {
		var button = $(this).parents(".search-result__occluded-item").find(".linkedin-salesboxbutton-company-search");

		var gif_image = $(this).parents(".search-result__occluded-item").find(".salesbox-ajax-company");

		button.hide();
		gif_image.show();

		var company_name = $(this).parents(".search-result__occluded-item").find(".search-result__title").html();
		var industry_name = $(this).parents(".search-result__occluded-item").find(".subline-level-1.search-result__truncate").html();
		var employees_name = $(this).parents(".search-result__occluded-item").find(".subline-level-2.search-result__truncate").html();
		var logo = $(this).parents(".search-result__occluded-item").find(".search-result__image img").attr("src");
		var key = $(this).parents(".search-result__occluded-item").find(".search-result__result-link").attr("href");
		if(employees_name != undefined){
			employees_name = employees_name.split("employee")[0];
		}

		if(employees_name == undefined){
			chrome.extension.sendMessage({
				msg: 'GetUserInfo'
			}, function (response) {
				if(!$.isEmptyObject(response)){

					var token = response.userInfo.userDTO.token;

					toDataUrl(logo, function(base64Img) {

						var dd = getdata(base64Img);
	          var apiData = new FormData();
	          apiData.append("avatar", dd);          

	          var uploadavatar_url = "https://production-qa.salesbox.com/document-v3.0/photo/uploadAvatar?token=" + token;

						$.ajax({
					    type: "POST",
					    url: uploadavatar_url,
					    data: apiData,
					    cache: false,
		          contentType: false,
		          processData: false,
					    success: function(response){
					    	var avatarID = response.avatar;
					    	chrome.extension.sendMessage({
								 	msg: 'GetIndustryList',
								 	token: token
								}, function (indust_response) {
								 	var industries = indust_response.workDataOrganisationDTOList;
								 	var industry = getIndustry(industries, industry_name);

								 	var account_data = {
										avatar: avatarID,
										additionalEmailList: [],
										additionalPhoneList: [],
										email: null,
										industry: industry,
										isChanged: false,
										isPrivate: false,
										mainEmailType: "EMAIL_DEPARTMENT",
										mainPhoneType: "PHONE_DEPARTMENT",
										mediaType: "MANUAL",
										name: company_name,
										numberGoalsMeeting: 0,
										participantList: [],
										phone: null,
										size: null,
										type: null,
										linkedinProfileId: key
									};

									chrome.extension.sendMessage({
										msg: 'AddAccount',
										data: account_data,
										token: token
									}, function (res) {
										if(!$.isEmptyObject(res)){
											gif_image.hide();
											button.text("Added");
											button.addClass("add-success");
											button.show();
										} else {
											gif_image.hide();
											button.show();		
										}
									});
								});
					    }
						});
			  	});
				}
			});
		} else {
			chrome.extension.sendMessage({
				msg: 'GetUserInfo'
			}, function (response) {
				if(!$.isEmptyObject(response)){

					var token = response.userInfo.userDTO.token;

					toDataUrl(logo, function(base64Img) {

						var dd = getdata(base64Img);
	          var apiData = new FormData();
	          apiData.append("avatar", dd);          

	          var uploadavatar_url = "https://production-qa.salesbox.com/document-v3.0/photo/uploadAvatar?token=" + token;

						$.ajax({
					    type: "POST",
					    url: uploadavatar_url,
					    data: apiData,
					    cache: false,
		          contentType: false,
		          processData: false,
					    success: function(response){
					    	var avatarID = response.avatar;
					    	chrome.extension.sendMessage({
								 	msg: 'GetIndustryList',
								 	token: token
								}, function (indust_response) {
								 	var industries = indust_response.workDataOrganisationDTOList;
								 	var industry = getIndustry(industries, industry_name);

								 	chrome.extension.sendMessage({
								 		msg: 'GetSizeList',
								 		token: token
								 	}, function (size_response) {
								 		var sizes = size_response.sizeTypeList;
								 		var size = getSize(sizes, employees_name);

									 	var account_data = {
											avatar: avatarID,
											additionalEmailList: [],
											additionalPhoneList: [],
											email: null,
											industry: industry,
											isChanged: false,
											isPrivate: false,
											mainEmailType: "EMAIL_DEPARTMENT",
											mainPhoneType: "PHONE_DEPARTMENT",
											mediaType: "MANUAL",
											name: company_name,
											numberGoalsMeeting: 0,
											participantList: [],
											phone: null,
											size: size,
											type: null,
											linkedinProfileId: key
										};

										chrome.extension.sendMessage({
											msg: 'AddAccount',
											data: account_data,
											token: token
										}, function (res) {
											if(!$.isEmptyObject(res)){
												gif_image.hide();
												button.text("Added");
												button.addClass("add-success");
												button.show();
											} else {
												gif_image.hide();
												button.show();		
											}
										});
								 	});
								});
					    }
						});
			  	});
				}
			});
		}
	});

	$(document).on('click', "#add_lead_search_company", function () {
		
	});

	$(document).on('click', 'div.salesbox-showmorewidget', function () {
		$("button.contact-see-more-less").trigger('click');
	});

	$(document).on('click', 'div.salesbox-showmorewidget .close', function (event) {
		event.stopPropagation();
		$("div.salesbox-showmorewidget").remove();
	});

	$(document).on('click', 'div.skypecustomurl .close', function () {
		$("div.skypecustomurl").remove();
	});

	$(document).on('click', '.salesbox-info-add', function () {
		if($.isEmptyObject(contact)){
			alert('You should add contact first');
		} else {
			var add = $(this);
			var updating = $(this).next();
			var checked = $(this).next().next();
			
			var caption = add.siblings('header').html().trim().toLowerCase();
			var value = add.parent().find(".pv-contact-info__ci-container").text().trim();
			if(value.indexOf("(") > -1 ){
				value = value.substring(0, value.indexOf("("));	
			}

			value = value.replace(/[^\x20-\x7E]/gmi, "").trim();

			if(caption == 'email'){
				contact["email"] = value;
			} else if(caption == 'address'){
				contact["street"] = value;
			} else if(caption == 'birthday'){
				contact["birthday"] = value;
			} else if(caption.indexOf('website') > -1){
				organization["web"]= value
			} else if(caption == 'phone'){
				contact["phone"] = value
			} else if(caption == 'im'){
				contact["im"] = value
			}

			add.hide();
			updating.show();
			if(caption.indexOf('website') > -1){
				chrome.extension.sendMessage({
					msg: "GetUserInfo"
				}, function (response) {
					if(!$.isEmptyObject(response)){
						var token = response.userInfo.userDTO.token;

						chrome.extension.sendMessage({
							msg: 'UpdateAccount',
							token: token,
							data: organization
						}, function (res) {
							if(!$.isEmptyObject(res)){
								updating.hide();
								checked.show();	
							} else {
								updating.hide();
								add.show();
							}
						})
					}
				})
			} else {
				chrome.extension.sendMessage({
					msg: 'GetUserInfo'
				}, function (response) {
					if(!$.isEmptyObject(response)){
						var token = response.userInfo.userDTO.token;

						chrome.extension.sendMessage({
							msg: 'UpdateContact',
							token: token,
							data : contact
						}, function (response) {
							if(!$.isEmptyObject(response)){
								updating.hide();
								checked.show();	
							} else {
								updating.hide();
								add.show();
							}
						});
					}
				});
			}
		}
	});

	$(document).on('click', '.linkedin-salesboxbutton-person-search', function (event) {
		event.stopPropagation();
		$("ul.submenu").hide();
		$(this).find("ul.submenu").show();
	});

	$(document).on('click', '.linkedin-salesboxbutton-company-search', function (event) {
		event.stopPropagation();
		$("ul.submenu").hide().parent().css('z-index', 9999);
		$(this).find("ul.submenu").show();
		$(this).css('z-index', 10000);
	});

	$(document).on('click', '.linkedin-salesboxbutton-person-connection', function (event) {
		event.stopPropagation();
		$("ul.submenu").hide().parent().css('z-index', 9999);
		$(this).find("ul.submenu").show();
		$(this).css('z-index', 10000);
	});

	function toDataUrl(url, callback, outputFormat) {
    var img = new Image();
	  img.crossOrigin = 'Anonymous';
	  img.onload = function() {
	    var canvas = document.createElement('CANVAS');
	    var ctx = canvas.getContext('2d');
	    var dataURL;
	    canvas.height = this.height;
	    canvas.width = this.width;
	    ctx.drawImage(this, 0, 0);
	    dataURL = canvas.toDataURL(outputFormat);
	    callback(dataURL);
	    canvas = null;
	  };
	  img.src = url;
	}

	function getdata(dataURL) {
    var BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) == -1) {
        var parts = dataURL.split(',');
        var contentType = parts[0].split(':')[1];
        var raw = decodeURIComponent(parts[1]);

        return new Blob([raw], {
            type: contentType
        });
    }

    var parts = dataURL.split(BASE64_MARKER);
    var contentType = parts[0].split(':')[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;

    var uInt8Array = new Uint8Array(rawLength);

    for (var i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], {
        type: contentType
    });
	}

	function getIndustry(industries, name) {
		for(var i = 0 ; i < industries.length; i++){
			if(industries[i].name == name){
				return industries[i];
				break;
			}
		}
	}

	function getSize(sizes, name) {
		name = name.replace(/,/g , "");
		for(var i = 0 ; i < sizes.length; i++){
			if(sizes[i].name == name){
				return sizes[i];
				break;
			}
		}
		return sizes[sizes.length - 1];
	}

	function CheckContactPersonalInformation(linkedin, skype) {
		var info_objects = $("div.pv-profile-section__section-info section");
		for(var i = 0 ; i < info_objects.length ; i++){
			info_objects.eq(i).append('<span class="salesbox-info-add" aria-hidden="true">+</span>');
			info_objects.eq(i).append('<img class="salesbox-info-updating" src=' + chrome.extension.getURL('assets/img/loading.gif') + '>');
			info_objects.eq(i).append('<i class="fa fa-check-circle salesbox-info-check" aria-hidden="true"></i>')
		}

		if(!$.isEmptyObject(contact)){
			$("div.pv-profile-section__section-info section.ci-vanity-url span.salesbox-info-add").hide();
			$("div.pv-profile-section__section-info section.ci-vanity-url i.salesbox-info-check").show();
			if(linkedin == false) {
				$("div.pv-profile-section__section-info section.ci-vanity-url").append("<div class='skypecustomurl'><span class='close'>x</span><span class='conainer'>You need to add a LinkedIn URL custom field on Contacts in Salesbox first</span></div>");
			}
			var isLinkedinCustomfield = false;
			var isSkypeCustomField = false;

			var options = $("div.pv-profile-section__section-info section");
			if(options.length > 1){
				for(var i = 1 ; i < options.length; i++){
					var caption = options.eq(i).find("header").html().trim().toLowerCase();
					if(caption == 'email'){
						if(contact["email"] != null){
							options.eq(i).find("span.salesbox-info-add").hide();
							options.eq(i).find("i.salesbox-info-check").show();
						}
					} else if(caption == 'birthday'){
						if(contact["birthday"] != null){
							options.eq(i).find("span.salesbox-info-add").hide();
							options.eq(i).find("i.salesbox-info-check").show();	
						}
					} else if(caption == 'website'){
						if(organization["web"] != null){
							options.eq(i).find("span.salesbox-info-add").hide();
							options.eq(i).find("i.salesbox-info-check").show();	
						}
					} else if(caption == 'phone'){
						if(contact["phone"] != null){
							options.eq(i).find("span.salesbox-info-add").hide();
							options.eq(i).find("i.salesbox-info-check").show();	
						}
					} else if(caption == 'im'){
						if(isSkypeCustomField == false) {
							options.eq(i).append("<div class='skypecustomurl'><span class='close'>x</span><span class='conainer'>You need to add a Skype URL custom field on Contacts in Salesbox first</span></div>");
						}
						if(contact["skype"] != null){
							options.eq(i).find("span.salesbox-info-add").hide();
							options.eq(i).find("i.salesbox-info-check").show();	
						}
					}
				}
			}
		}
	}
})(window, $)