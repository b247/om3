if ('serviceWorker' in navigator) {
	console.log('CLIENT: service worker registration in progress.');
	navigator.serviceWorker.register('/sw.js').then(function() {
		console.log('CLIENT: service worker registration complete.');
	}, function() {
		console.log('CLIENT: service worker registration failure.');
	});
} else {
	console.log('CLIENT: service worker is not supported.');
}




let formData = {}
let positions = {
	nume : [56.808, 39.195],
	prenume : [119.267,39.195],
	data_nastere_ziua : [56.42,48.206],
	data_nastere_luna : [71.501,48.206],
	data_nastere_an : [86.582,48.206],
	adresa_linia_1 : [56.102, 57.217],
	adresa_linia_2 : [56.102, 66.228],
	adresa_deplasare : [19.995, 94.821],
	motivul_deplasarii_1 : [32.409, 123.503],
	motivul_deplasarii_2 : [32.409, 134.367],
	motivul_deplasarii_3 : [32.409, 145.2],
	motivul_deplasarii_4 : [32.409, 151],
	motivul_deplasarii_5 : [32.409, 161.6],
	motivul_deplasarii_6 : [32.409, 172.7],
	motivul_deplasarii_6_1 : [38.12, 175.174],
	motivul_deplasarii_7 : [32.409, 184],
	motivul_deplasarii_8 : [32.409, 189.7],
	motivul_deplasarii_9 : [32.409, 195.3],
	motivul_deplasarii_10 : [32.409, 200.965],
	today : [56.308, 236],
	semnatura : [125, 231.809],
}



$(function () {

	let generatePdfBtn = $('#generatePdfBtn');

	let loadingDiv = $('#loading-container');
	let declaratieForm = $('#declaratie');
	let signatureBlackboard = $("#signature-container");
	let signatureBlackboardReset = $("#signature-reset");
	let signatureHolographic = $("#signature");

	signatureHolographic.jSignature();
	signatureBlackboardReset.click(function(e){signatureHolographic.jSignature('reset')});
	// signatureHolographic.on('change', function(e){
	// 	// signatureVector = $(this).jSignature('getData','svgbase64')
	// 	signatureVector = signatureHolographic.jSignature('getData')
	// 	if(signatureVector[1].length == 312) {
	// 		signatureBlackboard.find(':input').val(null);
	// 	} else {
	// 		signatureBlackboard.find(':input').val(signatureVector);
	// 	}
		
	// })

	declaratieForm.submit(function(e){
		e.preventDefault();

		generatePdfBtn.prop('disabled',true);
		loadingDiv.removeClass('d-none');

		var sData = declaratieForm.find(':input').not('#semnatura').serializeArray();
		console.log(sData);

		signatureVector = signatureHolographic.jSignature('getData');
		console.log(signatureVector);
		return false;

		var today = new Date().toJSON().slice(0,10).split('-').reverse().join('.');

		var doc = new jsPDF('p', 'mm', 'a4', true);
		doc.addFileToVFS("Merriweather_Regular.ttf", Merriweather_Regular);
    	doc.addFont('Merriweather_Regular.ttf', 'Merriweather_Regular', 'normal');
    	doc.setFont('Merriweather_Regular');
		doc.setFontSize(11);
		// doc.setTextColor('#004890');
		doc.addImage(background, 'PNG', 0, 0, 210, 297);

		for(var field in sData) {
			if(typeof positions[sData[field].name] !== 'undefined') {
				if (sData[field].value == 'check') {
					doc.circle(positions[sData[field].name][0] + 1.5, positions[sData[field].name][1] + 1.5, 2, 'F');
				} else if (sData[field].name == 'semnatura') {
					// var semnatura = doc.getImageProperties(sData[field].value);
					var semnatura = doc.getImageProperties(signatureVector);
					var ratio = semnatura.width / semnatura.height;
					var height = 17;
					var width = height * ratio;
					doc.addImage(sData[field].value, 'PNG', positions[sData[field].name][0], positions[sData[field].name][1] + 10 - height, width, height);
				} else {
					doc.text(positions[sData[field].name][0] + 1, positions[sData[field].name][1] + 5, sData[field].value);
				}
				formData[sData[field].name] = sData[field].value;
			}
		}

		doc.text(positions['today'][0], positions['today'][1], today);


		var docname = 'DECLARAȚIE PE PROPRIE RĂSPUNDERE cf. Ordonanța Militară nr. 3/2020, ' + formData.nume + ' ' +formData.prenume +', '+today+'.pdf';
		doc.save(docname, { returnPromise: true }).then( setTimeout(function(){ loadingDiv.addClass('d-none'); generatePdfBtn.prop('disabled',false); }, 700) );
	})
})