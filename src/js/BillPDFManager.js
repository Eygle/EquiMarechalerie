var BillPDFManager = function(data) {
	this.htmlBill = null;

	var totalHT;
	var totalTTC;
	var billId;

	var _this = this;

	this.init = function(data) {
		$('#hiddenBillHeader').load("pdf-generator/pdf_header.html", function() {
			$('#hiddenBillHeader .company').text(data.infos.companyName);
			var infos = $('#hiddenBillHeader .infos');
			infos.html($('<div>').text(data.infos.address + " - " + data.infos.zipcode + " " + data.infos.city));
			infos.append($('<div>').text("N° Siret " + data.infos.siret));
			infos.append($('<div>').html("Tél: " + data.infos.phoneFixe + " - Mobile: " + data.infos.phoneMobile + " - email: <span class=\"mail\">" + data.infos.mail + "</span>"));
			$('#hiddenBill').load("pdf-generator/pdf.html", function() {
				_this.fillClientInfos(data);
				_this.generateTableHeader($('#hiddenBill .bill'));
				_this.sendPDF();
			});
		});
	};

	this.generate = function(data) {
		$('#hiddenBill').load("pdf-generator/pdf.html", function() {
			_this.fillClientInfos(data);

			var $table = $('#hiddenBill .bill');
			_this.generateTableHeader($table);

			_this.totalHT	= 0.0;
			_this.totalTTC	= 0.0;

			for (var horse in data.client.animalsList) {
				var horse = data.client.animalsList[horse];
				if (horse.performancesSelected == 0) continue;
				$table.append($("<tr>").append($('<td>').attr({colspan:7, class:"horseName"}).text(horse.name)));
				for (var perf in horse.performancesList) {
					perf = horse.performancesList[perf];
					if (!perf.isSelected) continue;
					var date = $('<td>').attr({class: 'center'}).text(perf.formattedDate);
					var desc = $('<td>').attr({class: 'back-highlight'}).text(perf.name);
					var unit = $('<td>').attr({class: 'center'}).text(perf.unit);
					var quantity = $('<td>').attr({class: 'center back-highlight'}).text(perf.quantity);
					var tva = $('<td>').attr({class: 'center'}).text(perf.tva);
					// if ()	// TODO REMISE
					// 	var desc = $('<td>').attr({class: 'center'}).text(perf.date);
					// if ()	// TODO SUPPL
					// 	var desc = $('<td>').attr({class: 'center'}).text(perf.date);
					var unitHT = $('<td>').attr({class: 'right'}).text(parseInt(perf.quantity) > 1 ? perf.priceHT : "");
					var ht = $('<td>').attr({class: 'right'}).text(new String("" + perf.priceHT).replace(',', '.') * parseInt(perf.quantity));
					_this.totalHT += parseFloat(new String("" + perf.priceHT).replace(',', '.')) * parseInt(perf.quantity);
					_this.totalTTC += parseFloat(new String("" + perf.priceTTC).replace(',', '.')) * parseInt(perf.quantity);
					$table.append($('<tr>').append(date, desc, unit, quantity, tva, unitHT, ht));
				}
			}

			_this.totalHT = Math.round(_this.totalHT * 100) / 100;
			_this.totalTTC = Math.round(_this.totalTTC * 100) / 100;
			var tva = Math.round((_this.totalTTC - _this.totalHT) * 100) / 100;

			$('#totalHT').text(_this.totalHT + " €");
			$('#totalTVA').text(tva + " €");
			$('#totalTTC, #price').text(_this.totalTTC + " €");
			_this.sendPDF();
		});
	};

	this.getFrenchMonth = function(month) {
		var months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
		return months[month];
	};

	this.fillClientInfos = function(data) {
		var date = new Date();
		var billNbr = this.formatNumber(data['billNumber'], 5);
		this.billId = "FC" + this.formatNumber(date.getDate(), 2) + this.formatNumber(date.getMonth() + 1, 2) + date.getFullYear().toString().substr(2,2) + billNbr;
		$('#hiddenBill #billRef').text(this.billId);
		$('#hiddenBill #date').text(date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear().toString().substr(2,2));
		var maxDate = new Date(date.getFullYear(), date.getMonth() + 2, 0); // 30 days
		$('#hiddenBill #dateEnd').text(maxDate.getDate() + '/' + (maxDate.getMonth() + 1) + '/' + maxDate.getFullYear().toString().substr(2,2));
		$('#hiddenBill #dateEndFull').text(maxDate.getDate() + ' ' + this.getFrenchMonth(maxDate.getMonth()) + ' ' + maxDate.getFullYear());
		$('#hiddenBill #clientName').text(data.client.firstName + ' ' + data.client.lastName);
		$('#hiddenBill #clientAddress').text(data.client.address);
		$('#hiddenBill #clientAdressEnd').text(data.client.zipcode + ' ' + data.client.city);
	};

	this.formatNumber = function(elem, digits) {
		var elem = String(elem);
		while (elem.length < digits)
			elem = '0'+elem;
		return elem;
	};

	this.generateTableHeader = function(table, data) {
		var date = $('<th>').attr({class: 'center'}).text("Date");
		var desc = $('<th>').attr({class: 'back-highlight'}).text("Désignation");
		var unit = $('<th>').attr({class: 'center'}).text("Unité");
		var quantity = $('<th>').attr({class: 'center back-highlight'}).text("Qte");
		var tva = $('<th>').attr({class: 'center'}).html("TVA<br />%");
		// if (data.)	// TODO REMISE
		// 	var desc = $('<th>').attr({class: 'center'}).text("Remise");
		// if (data.)	// TODO SUPPL
		// 	var desc = $('<th>').attr({class: 'center'}).text("Suppl.");
		var unitHT = $('<th>').attr({class: 'center'}).html("Unit.<br />HT");
		var ht = $('<th>').attr({class: 'cener'}).html("Montant<br />HT");
		table.append($('<tr>').append(date, desc, unit, quantity, tva, unitHT, ht));
	};

	this.sendPDF = function() {
		$.post(Config.billsApi, {
			action:		"editPDF",
			header: 	$('#hiddenBillHeader').html(),
			content:	$('#hiddenBill').html()
		}, function() {
			// Display new PDF
			$('#pdfViewer').html($('<embed>').attr({type:"application/pdf", src:"pdf-generator/generatePDF.php?title=" + _this.billId}));
		});
	};

	this.init(data);
};