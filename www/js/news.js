function getNewsFromUrl(listId, url, linkUrl) {
	$.ajax({
		type : "GET",
		url : url,
		beforeSend : startLoading,
		complete : finishLoading		
	}).done(function(data) {
		addNewsMenuEntry(listId, data, linkUrl);
	});	
}

function addNewsMenuEntry(listId, data, linkUrl) {
	$.each(data, function(key, val) {
		var createdDate;
		if (val.createDate != null) {
            createdDate = createDate(val.createDate.date);
		} else {
            createdDate = new Date();
		}
		$("#" + listId).append('<li><a href="' + linkUrl + '?id=' + val.id + '"><h2>' + $('<textarea />').html(val.title).text() + '</h2><p>' + getDateStamp(createdDate) + '</p><p class="text-with-nl" id="introText' + val.id + '"></p></a></li>');
		$("#introText" + val.id).html($('<textarea />').html(convertUrl(val.introText)).text());
	});

	$("#" + listId).listview("refresh");
}

function loadNews(url, id) {
	$.ajax({
		type : "GET",
		url : url,
		data : {
			'id' : id
		},
		cache: true,
		beforeSend : startLoading,
		complete : finishLoading	
	}).done(function(news) {
		var createdDate;
		if (news.createDate != null) {
            createdDate = createDate(news.createDate.date);
		} else {
            createdDate = new Date();
		}
		$("#pageTitle").html($('<textarea />').html(news.title).text());
		$("#createDate").text(getDateStamp(createdDate));
		$("#introText").html($('<textarea />').html(convertUrl(news.introText)).text());
		if (news.fullText != "") {
			$("#fullText").html($('<textarea />').html(convertUrl(news.fullText)).text());
		}
	});
}

var loadingNews = 0;
function loadMoreNews(listId, url, linkUrl){
	$.ajax({
		type : "GET",
		url : url,
		data : {
			number: function() {
						return $('#' + listId).children().size();
					}
		},		
		beforeSend : function(){
						if(loadingNews == 1){
							return false;
						}
						startLoading();
						loadingNews=1;
					},
		complete : function(){
						finishLoading();
						loadingNews=0;
					},		
	}).done(function(data) {
		addNewsMenuEntry(listId, data, linkUrl);
	});		
}

function convertUrl(text) {
	return text.replaceAll(/href=&quot;(((?!(http|www)).)*)&quot;/g, 'href=&quot;https://www.grafstal.ch/$1&quot;');
}