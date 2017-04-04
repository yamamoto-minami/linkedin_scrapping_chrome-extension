(function(window, jQuery) {

	var organization = {};
	var contact = {};
	var custom_fields = {};

	var contactLinkedInArray = [];
	var accountLinkedInArray = [];

	var real_timer ,adding_timer ;
	var current_location = window.location.href;

	var $head = $("head");
	var $css = "<link href=" + "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" + " rel='stylesheet'>";

	$head.append($css);

	var css_url = chrome.extension.getURL("assets/css/style.css");
	$css = "<link href=" + css_url + " rel='stylesheet'>";

	$head.append($css);

	

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
					clearInterval(adding_timer);
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
			},200);
		} else {
			return false;
		}
	});

	function addSalesBoxButton(type) {

		chrome.extension.sendMessage({
			msg: "GetUserInfo"
		}, function (response) {
			var token = response.userInfo.userDTO.token;

			chrome.extension.sendMessage({
				msg: "GetAllContactLinkedID",
				token: token
			}, function (contact_ids) {
				if(contact_ids.existingProfileIds.length > 0){
					contactLinkedInArray = contact_ids.existingProfileIds;	
				}
				
				chrome.extension.sendMessage({
					msg: "GetAllAccountLinkedID",
					token: token
				}, function (account_ids) {
					if(account_ids.existingProfileIds.length > 0 ){
						accountLinkedInArray = account_ids.existingProfileIds;
					}
					adding_timer = setInterval(function () {
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
												parent.find("span.linkedin-salesboxbutton").find("ul").append("<li id='salesbox_add_company_lead'>Add as Lead</li>");
												
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
								clearInterval(adding_timer);
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
													parent.find("div.salesbox-showmorewidget").hide();

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
								clearInterval(adding_timer);
							}
						} else if(type == 'search-people'){

							////// CUSTOMER IS IN SEARCH RESULT (PEOPLE) /////
							var parent = $("li.search-result__occluded-item div.search-result__actions");

							if(parent.length > 0){

								for(var i = 0 ;  i < parent.length ; i++){
									if(parent.eq(i).find("span.linkedin-salesboxbutton-person-search").length == 0){

										var key = parent.eq(i).parents(".search-result__occluded-item").find(".search-result__result-link").attr("href");

										if(contactLinkedInArray.length > 0) {
											var flag = checkContactAccountExisted(contactLinkedInArray, key);

											if(flag == true){
												var target = parent.eq(i);

												/**** Append <Add to Salesbox> button ****/
												target.find(".search-result__actions--primary").before($("<span class='linkedin-salesboxbutton-person-search add-success'>Added</span>"));

											} else {
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

										} else {
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
								}

								if(parent.length == 10 ){
									clearInterval(adding_timer);
								}
							}
						} else if(type == 'search-company'){

							////// CUSTOMER IS IN SEARCH RESULT (COMPANY) /////
							var parent = $("li.search-result__occluded-item div.search-result__actions");

							if(parent.length > 0){

								for(var i = 0 ;  i < parent.length ; i++){
									if(parent.eq(i).find("span.linkedin-salesboxbutton-company-search").length == 0){

										var key = parent.eq(i).parents(".search-result__occluded-item").find(".search-result__result-link").attr("href");

										if(accountLinkedInArray.length > 0){
											var flag = checkContactAccountExisted(accountLinkedInArray, key);
											if(flag == true) {
												var target = parent.eq(i);
												/**** Append <Add to Salesbox> button ****/
												target.find(".search-result__actions--primary").before($("<span class='linkedin-salesboxbutton-company-search add-success'>Added</span>"));	
											} else {
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
										} else {
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
								}

								if(parent.length == 10 ){
									clearInterval(adding_timer);	
								}
							}
						} else {
							////// CUSTOMER IS IN CONNECTION PAGE /////
							var parent = $("li.mn-person-card.connection-card div.mn-person-card__card-actions");

							if(parent.length > 0){

								for(var i = 0 ;  i < parent.length ; i++){
									if(parent.eq(i).find("span.linkedin-salesboxbutton-person-connection").length == 0){

										var key = parent.eq(i).parents(".mn-person-card.connection-card").find(".mn-person-info__link").attr("href");

										if(contactLinkedInArray.length > 0) {
											var flag = checkContactAccountExisted(contactLinkedInArray , key);
											if(flag == true) {
												var target = parent.eq(i);

												/**** Append <Add to Salesbox> button ****/
												target.find(".message-anywhere-button").before($("<span class='linkedin-salesboxbutton-person-connection add-success'>Added</span>"));

											} else {
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
										} else {
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
								}

								if(parent.length == parseInt($("h3.mn-connections__title").html().trim().split(" ")[0])){
									clearInterval(adding_timer);	
								}
							}
						}
					},200);
				});
			});
		});
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
	
		setTimeout(function () {
			if($("div.pv-contact-info__card-sub-heading").length == 1){
				$("div.salesbox-showmorewidget").show();
			}	else {
				$("div.salesbox-showmorewidget").hide();
			}
		},100);

		chrome.extension.sendMessage({
			msg: 'GetUserInfo'
		}, function (response) {
			if(!$.isEmptyObject(response)){
				var token = response.userInfo.userDTO.token;
				var url = "https://production.salesbox.com/enterprise-v3.0/customField/listByObject?token=" + token + "&objectType=CONTACT";

				$.ajax({
					url: url,
					method: 'GET',
					success: function (customfields) {
						custom_fields = customfields.customFieldDTOList;
						if(custom_fields.length > 0){
							showPopups(custom_fields);
						} else {
							showPopups(null);
						}
					}
				});
			}
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
				var company_name = $("h1.org-top-card-module__name").text().trim();

				var imageUrl = $("img.org-top-card-module__logo").attr("src");
				toDataUrl(imageUrl, function(base64Img) {

					var dd = getdata(base64Img);
          var apiData = new FormData();
          apiData.append("avatar", dd);          

          var uploadavatar_url = "https://production.salesbox.com/document-v3.0/photo/uploadAvatar?token=" + token;

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

	$(document).on('click', "#salesbox_add_company_lead ", function () {
		chrome.extension.sendMessage({
			msg: 'GetUserInfo'
		}, function (response) {
			if(!$.isEmptyObject(response)){

				var token = response.userInfo.userDTO.token;
				var ownerId = response.userInfo.userDTO.uuid;

				var company_name = $("h1.org-top-card-module__name").text().trim();

				var imageUrl = $("img.org-top-card-module__logo").attr("src");
				toDataUrl(imageUrl, function(base64Img) {

					var dd = getdata(base64Img);
          var apiData = new FormData();
          apiData.append("avatar", dd);          

          var uploadavatar_url = "https://production.salesbox.com/document-v3.0/photo/uploadAvatar?token=" + token;

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

										var organisationId = res.uuid;

										var data = {
											contactId: null,
											organisationId: organisationId,
											priority: 50,
											lineOfBusiness: {
												uuid : "13a09212-d198-413d-b900-6287a7f4946a"
											},
											type: "LINKEDIN",
											ownerId: ownerId
										};

										chrome.extension.sendMessage({
											msg: "AddLead",
											token: token,
											data: data
										}, function (response) {
											if(!$.isEmptyObject(response)){
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

				var token = response.userInfo.userDTO.token;

				var height = document.body.scrollHeight;
				var flag = true;
				var current_height = 0;
				$("body").append("<div class='salesbox-plugin-analyzing'>Analyzing the content...</div>");
				var scrolling_timer = setInterval(function () {
					if(flag == true){
						current_height += 100;
						if(current_height > height){
							flag = false;
						}
					} else {
						current_height -= 100;
						if(current_height < 0){
							clearInterval(scrolling_timer);
							AddContact(token);
							$(".salesbox-plugin-analyzing").remove();
						}	
					}
					window.scrollTo(0,current_height);
				},100);
			};
		});
	});
	
	$(document).on('click', "#salesbox_add_lead", function () {
		chrome.extension.sendMessage({
			msg: 'GetUserInfo'
		}, function (response) {
			if(!$.isEmptyObject(response)){

				var token = response.userInfo.userDTO.token;
				var ownerId = response.userInfo.userDTO.uuid;

				var height = document.body.scrollHeight;
				var flag = true;
				var current_height = 0;
				$("body").append("<div class='salesbox-plugin-analyzing'>Analyzing the content...</div>");
				var scrolling_timer = setInterval(function () {
					if(flag == true){
						current_height += 100;
						if(current_height > height){
							flag = false;
						}
					} else {
						current_height -= 100;
						if(current_height < 0){
							clearInterval(scrolling_timer);
							AddLead(token, ownerId);
							$(".salesbox-plugin-analyzing").remove();
						}	
					}
					window.scrollTo(0,current_height);
				},100);
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
		var title_name_account = parent.find(".subline-level-1.search-result__truncate").text().trim();
		var title = null;
		var company = null;
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
		var country = null;
		var region = null;
		var city = null;
		var street = null;
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

						var uploadavatar_url = "https://production.salesbox.com/document-v3.0/photo/uploadAvatar?token=" + token;

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
						var country = null;
						var region = null;
						var city = null;
						var street = null;
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

							var uploadavatar_url = "https://production.salesbox.com/document-v3.0/photo/uploadAvatar?token=" + token;

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
		var title_name_account = parent.find(".subline-level-1.search-result__truncate").text().trim();
		var title = null;
		var company = null;
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
		var country = null;
		var region = null;
		var city = null;
		var street = null;
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
					var ownerId = userInfo.userInfo.userDTO.uuid;

					toDataUrl(logo, function (base64Img) {
						var ddd = getdata(base64Img);
						var contact_avatar_data = new FormData();
						contact_avatar_data.append("avatar", ddd);

						var uploadavatar_url = "https://production.salesbox.com/document-v3.0/photo/uploadAvatar?token=" + token;

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
									var contactID = result.uuid;

									var data = {
										contactId: contactID,
										organisationId: null,
										priority: 50,
										lineOfBusiness: {
											uuid : "13a09212-d198-413d-b900-6287a7f4946a"
										},
										type: "LINKEDIN",
										ownerId: ownerId
									};

									chrome.extension.sendMessage({
										msg: "AddLead",
										token: token,
										data: data
									}, function (response) {
										if(!$.isEmptyObject(response)){
											gif_image.hide();
											button.show();
											button.text("Added");
											button.addClass("add-success");
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
			}, function (userInfo) {
				if(!$.isEmptyObject(userInfo)) {

					var token = userInfo.userInfo.userDTO.token;
					var ownerId = userInfo.userInfo.userDTO.uuid;

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
						var country = null;
						var region = null;
						var city = null;
						var street = null;
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

							var uploadavatar_url = "https://production.salesbox.com/document-v3.0/photo/uploadAvatar?token=" + token;

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
										var contactID = result.uuid;

										var data = {
											contactId: contactID,
											organisationId: uuid,
											priority: 50,
											lineOfBusiness: {
												uuid : "13a09212-d198-413d-b900-6287a7f4946a"
											},
											type: "LINKEDIN",
											ownerId: ownerId
										};

										chrome.extension.sendMessage({
											msg: "AddLead",
											token: token,
											data: data
										}, function (response) {
											if(!$.isEmptyObject(response)){
												gif_image.hide();
												button.show();
												button.text("Added");
												button.addClass("add-success");
											} else {
												gif_image.hide();
												button.show();
											}
										});
									});
						    }
						  });
						});
					});
				}
			});
		}
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

		var title_name_account = parent.find(".mn-person-info__occupation").text().trim();

		var title = null;
		var company = null;
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

						var uploadavatar_url = "https://production.salesbox.com/document-v3.0/photo/uploadAvatar?token=" + token;

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

							var uploadavatar_url = "https://production.salesbox.com/document-v3.0/photo/uploadAvatar?token=" + token;

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

		var button = $(this).parents(".mn-person-card.connection-card").find(".linkedin-salesboxbutton-person-connection");
		var gif_image = $(this).parents(".mn-person-card.connection-card").find(".salesbox-ajax-company");
		button.hide();
		gif_image.show();

		var at_list = ["at","في","在","在","na","på","op","à","beim","di","a","で","...에서","pada","på","w","Em","la","в","a","på","sa","At"]

		var parent = $(this).parents(".mn-person-card.connection-card");

		var key = parent.find(".mn-person-info__link").attr("href");

		var contact_name = parent.find("span.mn-person-info__name").html().trim();
		var logo = parent.find(".mn-person-info__picture img").attr("src");

		var title_name_account = parent.find(".mn-person-info__occupation").text().trim();

		var title = null;
		var company = null;
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
					var ownerId = userInfo.userInfo.userDTO.uuid;

					toDataUrl(logo, function (base64Img) {
						var ddd = getdata(base64Img);
						var contact_avatar_data = new FormData();
						contact_avatar_data.append("avatar", ddd);

						var uploadavatar_url = "https://production.salesbox.com/document-v3.0/photo/uploadAvatar?token=" + token;

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
									contactId = result.uuid;

									var data = {
										contactId: contactId,
										organisationId: null,
										priority: 50,
										lineOfBusiness: {
											uuid : "13a09212-d198-413d-b900-6287a7f4946a"
										},
										type: "LINKEDIN",
										ownerId: ownerId
									};

									chrome.extension.sendMessage({
										msg: "AddLead",
										token: token,
										data: data
									}, function (response) {
										if(!$.isEmptyObject(response)){
											gif_image.hide();
											button.show();
											button.text("Added");
											button.addClass("add-success");
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
			}, function (userInfo) {
				if(!$.isEmptyObject(userInfo)) {

					var token = userInfo.userInfo.userDTO.token;
					var ownerId = userInfo.userInfo.userDTO.uuid;
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

							var uploadavatar_url = "https://production.salesbox.com/document-v3.0/photo/uploadAvatar?token=" + token;

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
										var contactId = result.uuid

										var data = {
											contactId: contactId,
											organisationId: uuid,
											priority: 50,
											lineOfBusiness: {
												uuid : "13a09212-d198-413d-b900-6287a7f4946a"
											},
											type: "LINKEDIN",
											ownerId: ownerId
										};

										chrome.extension.sendMessage({
											msg: "AddLead",
											token: token,
											data: data
										}, function (response) {
											if(!$.isEmptyObject(response)){
												gif_image.hide();
												button.show();
												button.text("Added");
												button.addClass("add-success");
											} else {
												gif_image.hide();
												button.show();
											}
										});
									});
						    }
						  });
						});
					});
				}
			});
		}
	});

	$(document).on('click', "#add_account_search_company", function () {
		var button = $(this).parents(".search-result__occluded-item").find(".linkedin-salesboxbutton-company-search");

		var gif_image = $(this).parents(".search-result__occluded-item").find(".salesbox-ajax-company");

		button.hide();
		gif_image.show();

		var company_name = $(this).parents(".search-result__occluded-item").find(".search-result__title").text().trim();
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

	          var uploadavatar_url = "https://production.salesbox.com/document-v3.0/photo/uploadAvatar?token=" + token;

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

	          var uploadavatar_url = "https://production.salesbox.com/document-v3.0/photo/uploadAvatar?token=" + token;

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
		var button = $(this).parents(".search-result__occluded-item").find(".linkedin-salesboxbutton-company-search");

		var gif_image = $(this).parents(".search-result__occluded-item").find(".salesbox-ajax-company");

		button.hide();
		gif_image.show();

		var company_name = $(this).parents(".search-result__occluded-item").find(".search-result__title").text().trim();
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
					var ownerId = response.userInfo.userDTO.uuid;

					toDataUrl(logo, function(base64Img) {

						var dd = getdata(base64Img);
	          var apiData = new FormData();
	          apiData.append("avatar", dd);          

	          var uploadavatar_url = "https://production.salesbox.com/document-v3.0/photo/uploadAvatar?token=" + token;

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
										var organisationId = res.uuid;

										var data = {
											contactId: null,
											organisationId: organisationId,
											priority: 50,
											lineOfBusiness: {
												uuid : "13a09212-d198-413d-b900-6287a7f4946a"
											},
											type: "LINKEDIN",
											ownerId: ownerId
										};

										chrome.extension.sendMessage({
											msg: "AddLead",
											token: token,
											data: data
										}, function (response) {
											if(!$.isEmptyObject(response)){
												gif_image.hide();
												button.show();
												button.text("Added");
												button.addClass("add-success");
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
		} else {
			chrome.extension.sendMessage({
				msg: 'GetUserInfo'
			}, function (response) {
				if(!$.isEmptyObject(response)){

					var token = response.userInfo.userDTO.token;
					var ownerId = response.userInfo.userDTO.uuid;

					toDataUrl(logo, function(base64Img) {

						var dd = getdata(base64Img);
	          var apiData = new FormData();
	          apiData.append("avatar", dd);          

	          var uploadavatar_url = "https://production.salesbox.com/document-v3.0/photo/uploadAvatar?token=" + token;

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
											organisationId = res.uuid;

											var data = {
												contactId: null,
												organisationId: organisationId,
												priority: 50,
												lineOfBusiness: {
													uuid : "13a09212-d198-413d-b900-6287a7f4946a"
												},
												type: "LINKEDIN",
												ownerId: ownerId
											};

											chrome.extension.sendMessage({
												msg: "AddLead",
												token: token,
												data: data
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
								});
					    }
						});
			  	});
				}
			});
		}
	});

	$(document).on('click', 'div.salesbox-showmorewidget', function () {
		$("div.salesbox-showmorewidget").hide();
		$("button.contact-see-more-less").trigger('click');
	});

	$(document).on('click', 'div.salesbox-showmorewidget .close', function (event) {
		event.stopPropagation();
		$("div.salesbox-showmorewidget").remove();
	});

	$(document).on('click', 'div.skypecustomurl', function (event) {
		var url = "https://go.salesbox.com/desktop/#/company-setting/customFields";
		window.open(url , "_blank");
	});

	$(document).on('click', 'div.skypecustomurl .close', function (event) {
		event.stopPropagation();
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
			value = value.replace(/\n/g, " ").trim();
			var update_field = {};
			var isCustomFieldClicked = false;

			if(caption == 'email'){

				contact["email"] = value;
				var object = {
					value: value,
					type: "EMAIL_WORK",
					main: true,
					isPrivate: false
				}
				contact["additionalEmailList"].push(object);

			} else if(caption.indexOf('address') >-1 ){

				var locations = value.split(", ");

				var country = null;
				var region = null;
				var city = null;
				var street = null;
				if(locations.length == 1){
					country = locations[0];
				} else if(locations.length == 2){
					region = locations[0];
					country = locations[1];
				} else if(locations.length == 3) {
					city = locations[0];
					region = locations[1];
					country = locations[2];
				} else if(locations.length == 4) {
					street = locations[0];
					city = locations[1];
					region = locations[2];
					country = locations[3];
				} else if(locations.length > 4){
					country = locations[locations.length - 1];
					region = locations[locations.length - 2];
					city = locations[locations.length - 3];

					var street_array = [];
					for(var i = 0 ; i < locations.length - 4; i++){
						street_array.push(locations[i]);
					}
					street = street_array.join(" ");
				}
				contact["country"] = country;
				contact["region"] = region;
				contact["city"] = city;
				contact["street"] = street;

			} else if(caption.indexOf('website') > -1){

				organization["web"]= value

			} else if(caption == 'phone'){

				contact["phone"] = value
				var object = {
					value: value,
					type: "PHONE_WORK",
					main: true,
					isPrivate: false
				}
				contact["additionalPhoneList"].push(object);

			} else if(caption.indexOf('profile') > -1){

				isCustomFieldClicked = true;
				// Update Skype Custom Fields
				for(var i = 0 ; i < custom_fields.length; i++){
					if(custom_fields[i].title.toLowerCase() == "linkedin"){
						custom_fields[i].customFieldValueDTOList = [];
						var object = {
							value : value
						};

						custom_fields[i].customFieldValueDTOList.push(object);
						update_field = custom_fields[i];
						break;
					}
				}

			}	else {

				isCustomFieldClicked = true;
				// Update Other Custom Fields
				for(var i = 0 ; i < custom_fields.length; i++){
					if(custom_fields[i].title.toLowerCase() == caption){
						custom_fields[i].customFieldValueDTOList = [];
						var object = {
							value : value
						};

						custom_fields[i].customFieldValueDTOList.push(object);
						update_field = custom_fields[i];
						break;
					}
				}

			}

			add.hide();
			updating.show();

			if(isCustomFieldClicked == true) {
				chrome.extension.sendMessage({
					msg: "GetUserInfo"
				}, function (response) {
					var token = response.userInfo.userDTO.token;
					var uuid = contact.uuid;

					chrome.extension.sendMessage({
						msg: "UpdateCustomField",
						token: token,
						uuid: uuid,
						data: update_field
					}, function (res) {
						if(!$.isEmptyObject(res)){
							updating.hide();
							checked.show();
						} else {
							updating.hide();
							add.show();
						}
					});
				});
			} else {
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
		if((name == '1-10') || (name == '2-10')){
			name = '3-10';
		};
		
		name = name.replace(/,/g , "");
		for(var i = 0 ; i < sizes.length; i++){
			if(sizes[i].name == name){
				return sizes[i];
				break;
			}
		}
		return sizes[sizes.length - 1];
	}

	function showPopups(fields) {

		if(fields == null){

			/// USER HAS NO CUSTOM FIELDS IN SALESBOX CRM //////////

			var info_objects = $("div.pv-profile-section__section-info section");
			for(var i = 0 ; i < info_objects.length ; i++){
				info_objects.eq(i).append('<span class="salesbox-info-add" aria-hidden="true">+</span>');
				info_objects.eq(i).append('<img class="salesbox-info-updating" src=' + chrome.extension.getURL('assets/img/loading.gif') + '>');
				info_objects.eq(i).append('<i class="fa fa-check-circle salesbox-info-check" aria-hidden="true"></i>')
			}

			if(!$.isEmptyObject(contact)){
				$("div.pv-profile-section__section-info section.ci-vanity-url").append("<div class='skypecustomurl'><span class='close'>x</span><span class='conainer'>You need to add a LinkedIn URL custom field on Contacts in Salesbox first</span></div>");

				var options = $("div.pv-profile-section__section-info section");
				if(options.length > 1){
					for(var i = 1 ; i < options.length; i++){
						var caption = options.eq(i).find("header").html().trim().toLowerCase();
						options.eq(i).append("<div class='skypecustomurl'><span class='close'>x</span><span class='conainer'>You need to add a " + capitalizeFirstLetter(caption) + " custom field on Contacts in Salesbox first</span></div>");

						if(caption == 'email'){
							options.eq(i).find(".skypecustomurl").remove();
							if(contact["email"] != null){
								options.eq(i).find("span.salesbox-info-add").hide();
								options.eq(i).find("i.salesbox-info-check").show();
							}
						} else if(caption.indexOf('address') > -1){

							options.eq(i).find(".skypecustomurl").remove();

						} else if(caption == 'phone'){
							options.eq(i).find(".skypecustomurl").remove();
							if(contact["phone"] != null){
								options.eq(i).find("span.salesbox-info-add").hide();
								options.eq(i).find("i.salesbox-info-check").show();	
							}
						} else if(caption.indexOf('website') > -1 ){
							options.eq(i).find(".skypecustomurl").remove();
							if(organization["web"] != null){
								options.eq(i).find("span.salesbox-info-add").hide();
								options.eq(i).find("i.salesbox-info-check").show();
							}
						} else if(caption == 'birthday'){
							options.eq(i).find(".skypecustomurl").remove();
							options.eq(i).find("span.salesbox-info-add").remove();
							options.eq(i).find("img.salesbox-info-updating").remove();
							options.eq(i).find("i.salesbox-info-check").remove();
						}
					}
				}
			} else {
				var options = $("div.pv-profile-section__section-info section");
				if(options.length > 1){
					for(var i = 1 ; i < options.length; i++){
						var caption = options.eq(i).find("header").html().trim().toLowerCase();

						if(caption == 'birthday'){
							options.eq(i).find(".skypecustomurl").remove();
							options.eq(i).find("span.salesbox-info-add").remove();
							options.eq(i).find("img.salesbox-info-updating").remove();
							options.eq(i).find("i.salesbox-info-check").remove();
						}
					}
				}
			}
		} else {

			/// USER HAS CUSTOM FIELDS IN SALESBOX CRM //////////

			var info_objects = $("div.pv-profile-section__section-info section");
			for(var i = 0 ; i < info_objects.length ; i++){
				info_objects.eq(i).append('<span class="salesbox-info-add" aria-hidden="true">+</span>');
				info_objects.eq(i).append('<img class="salesbox-info-updating" src=' + chrome.extension.getURL('assets/img/loading.gif') + '>');
				info_objects.eq(i).append('<i class="fa fa-check-circle salesbox-info-check" aria-hidden="true"></i>');
			}

			if(!$.isEmptyObject(contact)){
				$("div.pv-profile-section__section-info section.ci-vanity-url").append("<div class='skypecustomurl'><span class='close'>x</span><span class='conainer'>You need to add a LinkedIn URL custom field on Contacts in Salesbox first</span></div>");

				var isLinkeinExisted = checkField(fields, "linkedin");
				if(isLinkeinExisted == true){
					$("div.pv-profile-section__section-info section.ci-vanity-url").find(".skypecustomurl").remove();
					var valueExisted = checkFieldvalue(contact, "linkedin");
					if(valueExisted == true){
						$("div.pv-profile-section__section-info section.ci-vanity-url").find("span.salesbox-info-add").hide();
						$("div.pv-profile-section__section-info section.ci-vanity-url").find("i.salesbox-info-check").show();		
					}
				}

				var options = $("div.pv-profile-section__section-info section");
				if(options.length > 1){
					for(var i = 1 ; i < options.length; i++){
						var caption = options.eq(i).find("header").html().trim().toLowerCase();
						options.eq(i).append("<div class='skypecustomurl'><span class='close'>x</span><span class='conainer'>You need to add a " + capitalizeFirstLetter(caption) + " custom field on Contacts in Salesbox first</span></div>");

						if(caption == 'email'){
							options.eq(i).find(".skypecustomurl").remove();
							if(contact["email"] != null){
								options.eq(i).find("span.salesbox-info-add").hide();
								options.eq(i).find("i.salesbox-info-check").show();
							}
						} else if(caption.indexOf('address') > -1){
							options.eq(i).find(".skypecustomurl").remove();
							var value = options.eq(i).find("header").next().text();

							if(value.indexOf(contact["country"]) > -1){
								options.eq(i).find("span.salesbox-info-add").hide();
								options.eq(i).find("i.salesbox-info-check").show();
							}
							if(contact["email"] != null){
								options.eq(i).find("span.salesbox-info-add").hide();
								options.eq(i).find("i.salesbox-info-check").show();
							}

						} else if(caption == 'phone'){
							options.eq(i).find(".skypecustomurl").remove();
							if(contact["phone"] != null){
								options.eq(i).find("span.salesbox-info-add").hide();
								options.eq(i).find("i.salesbox-info-check").show();	
							}
						} else if(caption.indexOf('website') > -1 ){
							options.eq(i).find(".skypecustomurl").remove();
							if(organization["web"] != null){
								options.eq(i).find("span.salesbox-info-add").hide();
								options.eq(i).find("i.salesbox-info-check").show();
							}
						} else if(caption == 'birthday'){
							options.eq(i).find(".skypecustomurl").remove();
							options.eq(i).find("span.salesbox-info-add").remove();
							options.eq(i).find("img.salesbox-info-updating").remove();
							options.eq(i).find("i.salesbox-info-check").remove();
						}	else {
							var isExisted = checkField(fields, caption);
							if(isExisted == true){
								options.eq(i).find(".skypecustomurl").remove();
								var valueExisted = checkFieldvalue(contact, caption);
								if(valueExisted == true){
									options.eq(i).find("span.salesbox-info-add").hide();
									options.eq(i).find("i.salesbox-info-check").show();		
								}
							}
						}
					}
				}
			} else {
				var options = $("div.pv-profile-section__section-info section");
				if(options.length > 1){
					for(var i = 1 ; i < options.length; i++){
						var caption = options.eq(i).find("header").html().trim().toLowerCase();

						if(caption == 'birthday'){
							options.eq(i).find(".skypecustomurl").remove();
							options.eq(i).find("span.salesbox-info-add").remove();
							options.eq(i).find("img.salesbox-info-updating").remove();
							options.eq(i).find("i.salesbox-info-check").remove();
						}
					}
				}
			}
		}
	}

	function checkFieldvalue(contact, name) {
		var flag = false;
		for(var i = 0 ; i < contact.customFieldDTOList.length; i++){
			if(contact.customFieldDTOList[i].title.toLowerCase() == name){
				if(contact.customFieldDTOList[i].customFieldValueDTOList.length > 0){
					if(contact.customFieldDTOList[i].customFieldValueDTOList[0].value != ""){
						flag = true;
						break;
					}
				}
			}
		}
		return flag;
	}

	function checkField(fields, name) {
		var flag = false;
		for(var i = 0 ;i < fields.length; i++){
			if(fields[i].title.toLowerCase() == name){
				flag = true;
				break;
			}
		}

		return flag;
	};

	function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
	}

	function AddContact(token) {
		company_name = $("section.pv-profile-section.experience-section ul.pv-profile-section__section-info").find("li").eq(0).find("div.pv-entity__summary-info .pv-entity__secondary-title").text();
		title = $("section.pv-profile-section.experience-section ul.pv-profile-section__section-info").find("li").eq(0).find("div.pv-entity__summary-info h3").text();

		var company_logo = $("section.pv-profile-section.experience-section ul.pv-profile-section__section-info").find("li").eq(0).find("div.pv-position-entity__logo img.pv-position-entity__logo-img").attr("src");

		toDataUrl(company_logo, function (base64Img) {
			var dd = getdata(base64Img);
			var apiData = new FormData();
			apiData.append("avatar", dd);

			var uploadavatar_url = "https://production.salesbox.com/document-v3.0/photo/uploadAvatar?token=" + token;

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
							organization = res;
							var organisationId = res.uuid;

							var name = $("h1.pv-top-card-section__name").html().trim();
							var street = $(".pv-top-card-section__location").html().trim();
							var locations = street.split(", ");
							var country = null;
							var region = null;
							var city = null;
							var street = null;
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

								var uploadavatar_url = "https://production.salesbox.com/document-v3.0/photo/uploadAvatar?token=" + token;

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
												$("div.salesbox-showmorewidget").show();
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

	function AddLead(token, ownerId) {
		company_name = $("section.pv-profile-section.experience-section ul.pv-profile-section__section-info").find("li").eq(0).find("div.pv-entity__summary-info .pv-entity__secondary-title").text();
		title = $("section.pv-profile-section.experience-section ul.pv-profile-section__section-info").find("li").eq(0).find("div.pv-entity__summary-info h3").text();

		var company_logo = $("section.pv-profile-section.experience-section ul.pv-profile-section__section-info").find("li").eq(0).find("div.pv-position-entity__logo img.pv-position-entity__logo-img").attr("src");

		toDataUrl(company_logo, function (base64Img) {
			var dd = getdata(base64Img);
			var apiData = new FormData();
			apiData.append("avatar", dd);

			var uploadavatar_url = "https://production.salesbox.com/document-v3.0/photo/uploadAvatar?token=" + token;

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
							organization = res;
							var organisationId = res.uuid;

							var name = $("h1.pv-top-card-section__name").html().trim();
							var street = $(".pv-top-card-section__location").html().trim();
							var locations = street.split(", ");
							var country = null;
							var region = null;
							var city = null;
							var street = null;
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

								var uploadavatar_url = "https://production.salesbox.com/document-v3.0/photo/uploadAvatar?token=" + token;

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
												var contactID = result.uuid;

												var data = {
													contactId: contactID,
													organisationId: organisationId,
													priority: 50,
													lineOfBusiness: {
														uuid : "13a09212-d198-413d-b900-6287a7f4946a"
													},
													type: "LINKEDIN",
													ownerId: ownerId
												};

												chrome.extension.sendMessage({
													msg: "AddLead",
													token: token,
													data: data
												}, function (response) {
													if(!$.isEmptyObject(response)){
														$(".salesbox-ajax").hide();
														$(".linkedin-salesboxbutton").show();
														$(".linkedin-salesboxbutton").text("Added");
														$(".linkedin-salesboxbutton").addClass("add-success");
														$("div.salesbox-showmorewidget").show();
													} else {
														$(".salesbox-ajax").hide();
														$(".linkedin-salesboxbutton").show();		
													}
												});
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

	function checkContactAccountExisted(array , item) {

		var flag = false;

		if(array.indexOf(item) > -1 ){
			flag = true;
		}

		return flag;
	}

})(window, $)