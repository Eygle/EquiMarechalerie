var tabs = null;

function switchJob() {
	Config.job = Config.job == "farriery" ? "pension" : "farriery";
	$('#switchJob').css('background-image', 'url("images/' + (Config.job == "farriery" ? "farrieryIcon" : "pensionIcon2") + '.png")');
	ManageView.display();
	$('#jobLabel').text(Config.job == "farriery" ? "Maréchalerie" : "Pension");
	tabs.update();
}

function initShortcuts() {
	$(document).keydown(function(e) {
		//console.log("pressbutton: " + e.which);
		switch (e.which) {
			case 13:	// Enter
				if ($('#addButton').is(':visible'))
					$('#addButton').trigger('click');
				else if (!Config.textareaFocused && $('#saveButton').is(':visible')) {
					var autocompleteVisible = false;
					$('.ui-autocomplete-input').each(function() {
						if ($(this).is(':focus'))
							autocompleteVisible = true;
					});
					if (!autocompleteVisible)
						$('#saveButton').trigger('click');
				}
			break;
			case 27:	// Escape
				if ($('#returnButton').is(':visible'))
					$('#returnButton').trigger('click');
			break;
			case 46:	// Delete
				if ($('#removeButton').is(':visible') && !$('#custom-popup-background').is(':visible'))
					$('#removeButton').trigger('click');
			break;
		}
	});
}

function initProgram() {
	$("#jobSelection").hide();
	$("#corps").show();
	tabs = new Tabs();
	initShortcuts();
	$('#settings').click(function() {new SettingsPanel();});
	ManageView.init();
	ManageView.push(new HomeView());
}

$(document).ready(function() {
	$.post(Config.settingsApi, {action: 'checkAutoSave'});
	$("#farriery").click(function() {
		Config.job = "farriery";
		$('#switchJob').css('background-image', 'url("images/farrieryIcon.png")');
		$('#jobLabel').text(Config.job == "farriery" ? "Maréchalerie" : "Pension");
		initProgram();
	});
	$("#pension").click(function() {
		Config.job = "pension";
		$('#switchJob').css('background-image', 'url("images/pensionIcon2.png")');
		$('#jobLabel').text(Config.job == "farriery" ? "Maréchalerie" : "Pension");
		initProgram();
	});

	$('#switchJob, #jobLabel').click(function() {
		switchJob();
	});
});