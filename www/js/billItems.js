function getBillItemsFromUrl(listId, url) {
	$.ajax({
		type : "GET",
		url : url,
		data : {
			'memberId' : getUserId()
		},
		beforeSend : startLoading,
		complete : finishLoading
	}).done(function(data) {
		addBillItemMenuEntry(listId, data);
	});
}

function addBillItemMenuEntry(listId, data) {
	var oldDateStamp;
	var listSelector = "#" + listId;
	if (data.length !== 0) {
		var total = 0;
		$.each(data, function(key, billItem) {
			total += parseFloat(billItem.value);
			$(listSelector).append(createBillItemMenuEntry(billItem));
		});
		$(listSelector).append(createTotalMenuEntry(total));
	} else {
		$(listSelector).append("<li>Keine Eintr&auml;ge vorhanden</li>");
	}
	$(listSelector).listview("refresh");
}

function createBillItemMenuEntry(billItem) {
	var startDate = createDate(billItem.billDate.date);
	var listEntry = '<li><fieldset class="ui-grid-a"><div class="ui-block-a">';
	listEntry += '<h2>' + billItem.description + '</h2>';
	listEntry += '<p>' + getDateStamp(startDate) + '</p>';
	listEntry += '</div><div class="ui-block-b ui-li-aside">';
	listEntry += '<p><strong>' + billItem.value + '</strong></p>';
	listEntry += '</div></fieldset></li>';
	return listEntry;
}

function createTotalMenuEntry(total) {
	var listEntry = '<li><fieldset class="ui-grid-a"><div class="ui-block-a">';
	listEntry += '<h2>Total</h2>';
	listEntry += '</div><div class="ui-block-b ui-li-aside">';
	listEntry += '<p><strong><span class="total">' + roundTwoDecimalPlaces(total) + '</span></strong></p>';
	listEntry += '</div></fieldset></li>';
	return listEntry;
}

function addReceipt(){
	$("#receiptMemberId").val(getUserId());
	$("#receiptForm").ajaxSubmit({
		url : getAPIUrl() + '/receipt.php',
		beforeSend : startLoading,
		complete : finishLoading,		
		success : function(data) {
			if (data.success) {
				alert("Erfolgreich eingetragen");
			} else {
				alert("Fehlgeschlagen: " + data.error_message);
			}
		}
	});
}
