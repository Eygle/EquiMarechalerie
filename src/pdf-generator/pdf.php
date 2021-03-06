<!DOCTYPE html>
<html>
	<head></head>

	<body>
		<table class="hidden">
			<tr>
				<td class="first">
					<table class="bill-label">
						<thead>
							<tr><th colspan="3">FACTURE</th></tr>
						</thead>
						<tbody>
							<tr><td class="small">Référence N°</td><td>:</td><td id="billRef">FC0406027</td></tr>
							<tr><td class="small">Date</td><td>:</td><td id="date">10/06/04</td></tr>
							<tr><td class="small">Mode de réglement</td><td>:</td><td>Traite à 30 jours fin de mois</td></tr>
							<tr><td>A payer avant le</td><td>:</td><td id="dateEnd">31-07-2004</td></tr>
							<tr><td colspan="3">Taux de pénalités de retard: 0.75% /mois de retard après le <span id="dateEndFull">31 juillet 2004</span></td></tr>
						</tbody>
					</table>
				</td>
				<td class="second">
					<div class="client-infos">
						<div id="clientName">SARL DU CLIENT</div>
						<div id="clientAddress">Adresse de mon client</div>
						<div id="clientAdressEnd">35000 RENNES</div>
					</div>
				</td>
			</tr>
		</table>

		<table class="bill"></table>

		<table class="hidden tripple">
			<tr>
				<td></td>
				<td></td>
				<td>
					<table class="totals">
						<tr><td>Total HT Net</td><td class="center" id="totalHT">0</td></tr>
						<tr><td>TVA</td><td class="center" id="totalTVA">0</td></tr>
						<tr><td>Total TTC</td><td class="center" id="totalTTC">0</td></tr>
						<tr><td class="gap"></td><td></td></tr>
						<tr><td class="highlight">Net à payer</td><td class="highlight center" id="price">0€</td></tr>
					</table>
				</td>
			</tr>
		</table>
	</body>
</html>