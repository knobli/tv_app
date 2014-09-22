function getNewsFromUrl(listId, url, linkUrl) {
	$.getJSON(url, function(data) {
		addNewsMenuEntry(listId, data, linkUrl);
	});
}

function addNewsMenuEntry(listId, data, linkUrl) {
	$.each(data, function(key, val) {
		var createDate;
		if (val.createDate != null) {
			createDate = createDate(val.createDate.date);
		} else {
			createDate = new Date();
		}
		$("#" + listId).append('<li><a href="' + linkUrl + '?id=' + val.id + '"><h2>' + $('<textarea />').html(val.title).text() + '</h2><p>' + getDateStamp(createDate) + '</p><p class="text-with-nl" id="introText' + val.id + '"></p></a></li>');
		$("#introText" + val.id).html($('<textarea />').html(val.introText).text());
	});

	$("#" + listId).listview("refresh");
}

function loadNews(url, id) {
	$.ajax({
		type : "GET",
		url : url,
		data : {
			'id' : id
		}
	}).done(function(news) {
		if (news.createDate != null) {
			createDate = createDate(news.createDate.date);
		} else {
			createDate = new Date();
		}
		$("#pageTitle").html($('<textarea />').html(news.title).text());
		$("#createDate").text(getDateStamp(createDate));
		$("#introText").html($('<textarea />').html(news.introText).text());
		if (news.fullText != "") {
			$("#fullText").html($('<textarea />').html(news.fullText).text());
		}
	});
}