// List view (first)

var ClientsView = function() {
	// Buttons management
	this.showReturnButton	= false;
	this.showSaveButton		= false;
	this.showAddButton		= true;
	this.showEditButton		= false;
	this.showRemoveButton	= false;

	this.htmlPage 			= "clients.html";
	this.tabLabel			= "clients";

	this.init = function() {
		$('#listView').show();
		$.getJSON(Config.clientsApi, {action:"getList", job:Config.job.toUpperCase()}, function(data) {
			titles = [
				{label:"name",			title:Strings.CLIENTS_LABEL_NAME,			dataType:"string"},
				{label:"animals",		title:Strings.CLIENTS_LABEL_ANIMALS,		dataType:"string"},
				{label:"phoneMobile",	title:Strings.CLIENTS_LABEL_PHONE_MOBILE,	dataType:"int"},
				{label:"phoneFixe",		title:Strings.CLIENTS_LABEL_PHONE_FIXE,		dataType:"int"},
				{label:"address",		title:Strings.CLIENTS_LABEL_ADDRESS,		dataType:"string"},
				{label:"zipcode",		title:Strings.CLIENTS_LABEL_ZIPCODE,		dataType:"int"},
				{label:"city",			title:Strings.CLIENTS_LABEL_CITY,			dataType:"string"}
			];
			new SortableList("clientsList", titles, data, function(id) {
				ManageView.push(new ClientDetails(id));
			}, function(x, y, id) {
				var background = $('<div>').attr('id', "rightClickBack").click(function() {
					$(this).remove();
					$("#" + id).removeClass('tr_selected');
					document.oncontextmenu = function() {return true;};
				});
				var popup = $('<div>').attr('id', 'rightClickPopup').css({left: x, top: y});
				var button1 = $('<div>').attr({class:'rightClickButton edit-icon', id: id}).text(Strings.EDIT).click(function() {
					document.oncontextmenu = function() {return true;};
					$('#rightClickBack').remove();
					$.getJSON(Config.clientsApi, {action:"getInfos", id:this.id}, function(data) {
						ManageView.push(new ClientFormView(data));
					});
				});
				var button2 = $('<div>').attr({class:'rightClickButton delete-icon', id: id}).text(Strings.REMOVE).click(function() {
					document.oncontextmenu = function() {return true;};
					$('#rightClickBack').remove();
					var name = $('#clientsList #' + this.id + " [label=name]").text();
					if (confirm(Strings.CONFIRM_DELETE.replace('$1', name))) {
						$.post(Config.clientsApi, {action:"delete", id:this.id}, function() {
							History.add("clients", "delete", 0, name, null, true, true, function() {
								ManageView.display();
							});
						});
					} else {
						$("#" + id).removeClass('tr_selected');
					}
				});
				$('body').append(background.append(popup.append(button1).append(button2)));
			});
		});
	};

	this.manageButtonClick = function(button) {
		if (button != "add") return;
		ManageView.push(new ClientFormView());
	};
};

// Details view

var ClientDetails = function(id) {
	// Buttons management
	this.showReturnButton	= true;
	this.showSaveButton		= false;
	this.showAddButton		= false;
	this.showEditButton		= true;
	this.showRemoveButton	= true;

	this.htmlPage 			= "clients.html";
	this.tabLabel			= "clients";

	this.id					= id;
	this.data				= null;

	var _this = this;

	this.init = function() {
		$('#detailView').show();
		$.getJSON(Config.clientsApi, {action:"getInfos", id:this.id}, function(data) {
			_this.data = data;
			$('#detailView #name').text(_this.data.name);
			$("#detailView #address").text(_this.data.address);
			$("#detailView #zipcode").text(_this.data.zipcode);
			$("#detailView #city").text(_this.data.city);
			$("#detailView #phoneFixe").text(_this.data.phoneFixe);
			$("#detailView #phoneMobile").text(_this.data.phoneMobile);
			$('#detailView #mail').text(_this.data.mail);

			// Animal part
			titles = [
				{label:"name",		title:Strings.ANIMALS_LABEL_NAME,			dataType:"string"},
				{label:"type",		title:Strings.ANIMALS_LABEL_TYPE,			dataType:"string"},
				{label:"race",		title:Strings.ANIMALS_LABEL_RACE,			dataType:"string"},
				{label:"age",		title:Strings.ANIMALS_LABEL_AGE,			dataType:"string"}

			];
			new SortableList("clientHorsesList", titles, _this.data.animalsList, function(id) {
				ManageView.push(new AnimalDetails(id));
			}, function(x, y, id) {
				var background = $('<div>').attr('id', "rightClickBack").click(function() {
					$(this).remove();
					$("#" + id).removeClass('tr_selected');
					document.oncontextmenu = function() {return true;};
				});
				var popup = $('<div>').attr('id', 'rightClickPopup').css({left: x, top: y});
				var button = $('<div>').attr({class:'rightClickButton delete-icon', id: id}).text(Strings.REMOVE_FROM_LIST).click(function() {
					document.oncontextmenu = function() {return true;};
					$('#rightClickBack').remove();
					var horseId = this.id;
					$.post(Config.clientsApi, {
						action: 'unlinkAnimal',
						clientId:_this.id,
						animalId:horseId
					}, function() {
						History.add("clients", "delete_animal", 0, _this.data.name,  $("#clientHorsesList #" + horseId+ " [label=name]").text(), true, true, function() {
							ManageView.display();
						});
					});
				});
				$('body').append(background.append(popup.append(button)));
			});

			// Search animals to add
			$("#detailView #searchHorse").autocomplete({
				source : Config.animalsApi + "?action=search&job=" + Config.job.toUpperCase(),
				select : function(event, ui) {
					$.post(Config.clientsApi, {
						action:		"linkAnimal",
						clientId:	_this.id,
						animalId:	ui.item.id
					}, function() {
						History.add("clients", "add_animal", 0, _this.data.name, ui.item.name, true, true, function() {
							ManageView.display();
						});
					});
					return false;
				}
			}).data("ui-autocomplete")._renderItem = function(ul, item) {
				return $("<li>").data("ui-item.autocomplete", item).append(
					'<a>' + item.name + '</a>').appendTo(ul);
			};

			// Bills part
			titles = [
				{label:"date",		title:Strings.BILLS_LABEL_DATE,		dataType:"string"},
				{label:"number",	title:Strings.BILLS_LABEL_NUMBER,	dataType:"string"},
				{label:"taxFree",	title:Strings.BILLS_LABEL_TAXFREE,	dataType:"float"},
				{label:"total",		title:Strings.BILLS_LABEL_TOTAL,	dataType:"float"},
				{label:"file",		title:Strings.BILLS_LABEL_FILE,		dataType:"string"}
			];
			new SortableList("billsList", titles, _this.data.billsList, function(id) {
				
			});
		});
	};

	this.manageButtonClick = function(button) {
		if (button == "edit")
			ManageView.push(new ClientFormView(_this.data));
		else if (button == "remove" && confirm(Strings.CONFIRM_DELETE.replace('$1', _this.data.name))) {
			$.post(Config.clientsApi, {action:"delete", id:_this.data.id}, function() {
				History.add("clients", "delete", 0, _this.data.name,  null, true, true, function() {
					ManageView.pop();
				});
			});
		}
	};
};

// Form view

var ClientFormView = function(data) {
	// Buttons management
	this.showReturnButton	= true;
	this.showSaveButton		= true;
	this.showAddButton		= false;
	this.showEditButton		= false;
	this.showRemoveButton	= false;

	this.htmlPage 			= "clients.html";
	this.tabLabel			= "clients";

	var _this				= this;

	this.editMode			= data != undefined;
	this.data				= data ? data : {
								firstName:		null,
								lastName:		null,
								address:		null,
								zipcode:		null,
								city:			null,
								phoneFixe:		null,
								phoneMobile:	null,
								mail:			null,
								inFarriery:		Config.job == "farriery",
								inPension:		Config.job == "pension"
							};

	this.init = function() {
		$('#formView').show();
		$('#formView #firstName').val(this.data.firstName);
		$('#formView #lastName').val(this.data.lastName);
		$("#formView #address").val(this.data.address);
		$("#formView #zipcode").val(this.data.zipcode).autocomplete({
			source : Config.citiesApi,
			select : function(event, ui) {
				$("#formView #zipcode").val(ui.item.zipcode);
				$("#formView #city").val(ui.item.city);
				return false;
			}
		}).data("ui-autocomplete")._renderItem = function(ul, item) {
			return $("<li>").data("ui-item.autocomplete", item).append(
				'<a>' + item.city + ' (' + item.zipcode + ')</a>').appendTo(ul);
		};
		$("#formView #city").val(this.data.city).autocomplete({
			source : Config.citiesApi,
			select : function(event, ui) {
				$("#formView #zipcode").val(ui.item.zipcode);
				$("#formView #city").val(ui.item.city);
				return false;
			}
		}).data("ui-autocomplete")._renderItem = function(ul, item) {
			return $("<li>").data("ui-item.autocomplete", item).append(
				'<a>' + item.city + ' (' + item.zipcode + ')</a>').appendTo(ul);
		};
		$("#formView #phoneFixe").val(this.data.phoneFixe);
		$("#formView #phoneMobile").val(this.data.phoneMobile);
		$('#formView #mail').val(this.data.mail);
		$('#formView #inFarriery').prop("checked", this.data.inFarriery);
		$('#formView #inPension').prop("checked", this.data.inPension);
	};

	this.manageButtonClick = function(button) {
		if (button != "save") return;

		var params = {
				action:			_this.editMode ? "edit" : "add", 
				firstName:		$('#formView #firstName').val(),
				lastName:		$('#formView #lastName').val(),
				address:		$('#formView #address').val(),
				zipcode:		$('#formView #zipcode').val(),
				city:			$('#formView #city').val(),
				phoneFixe:		$('#formView #phoneFixe').val(),
				phoneMobile:	$('#formView #phoneMobile').val(),
				mail:			$('#formView #mail').val(),
				inFarriery:		$('#formView #inFarriery').is(':checked'),
				inPension:		$('#formView #inPension').is(':checked'),
		};

		if (!this.checkForm(params)) return;

		if (_this.editMode) params.id = _this.data.id;
		$.post(Config.clientsApi, params, function(data) {
			History.add("clients", params.action, 0,  params.firstName + " " + params.lastName, null,  params.inFarriery,  params.inPension, function() {
				if (!_this.editMode)
					ManageView.replace(new ClientDetails(data.id));
				else
					ManageView.pop();
			});
		}, "json");
	};

	this.checkForm = function(data) {
		if (!data.firstName || !data.lastName) {
			alert(Strings.CLIENTS_REQUIRE_NAME);
			return false;
		} else if (!data.address) {
			alert(Strings.CLIENTS_REQUIRE_ADDRESS);
			return false;
		} else if (!data.zipcode) {
			alert(Strings.CLIENTS_REQUIRE_ZIPCODE);
			return false;
		} else if (!data.inFarriery && !data.inPension) {
			alert(Strings.CLIENTS_REQUIRE_JOB);
			return false;
		}
		return true;
	};
};