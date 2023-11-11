/// <reference path='../shikimori-to-anilist/typings/globals/jquery/index.d.ts' />

$(document).ready(function () {

	let filename = 'updated.xml';

	function read_file(file) {
		return new Promise((resolve) => {
			let file_reader = new FileReader();

			file_reader.onload = () => {
				resolve(file_reader.result);
			};

			console.log(file_reader)

			file_reader.readAsText(file);
		});
	}

	function parse_file(text) {
		let parser = new DOMParser();
		let xml = parser.parseFromString(text, 'text/xml');
		console.log(xml);

		let parent_tag = xml.children[0].children[1].tagName;
		let parent_node;

		switch (parent_tag) {
			case 'anime':
				parent_node = xml.getElementsByTagName('anime');

				for (let node of parent_node) {
					set_dates(node, xml);
				}

				break;
			case 'manga':
				parent_node = xml.getElementsByTagName('manga');

				for (let node of parent_node) {
					set_dates(node, xml);
					change_tag(node, xml);
				}

				break;
		}

		return xml;
	}

	function set_dates(node, xml) {
		if (node.getElementsByTagName('my_start_date').length == 0) {
			let my_start_date, my_finish_date;

			my_start_date = xml.createElement('my_start_date');
			my_start_date.textContent = '0000-00-00';
			node.appendChild(my_start_date);

			my_finish_date = xml.createElement('my_finish_date');
			my_finish_date.textContent = '0000-00-00';
			node.appendChild(my_finish_date);
		}
	}

	function change_tag(node, xml) {
		let my_times_watched = node.getElementsByTagName('my_times_watched')[0];
		let my_times_read = xml.createElement('my_times_read');

		my_times_read.textContent = my_times_watched.textContent;
		node.replaceChild(my_times_read, my_times_watched)
	}

	$('#file-input').change(() => {
		// $('#textarea').val('');

		let file, text;

		file = $('#file-input').prop('files')[0];

		filename = String(file.name).replace('.xml', '_updated.xml');

		read_file(file)
			.then((response) => {
				text = response;
				// console.log(response)
			})
			.then(() => {
				console.log(text)
				$('#textarea').val(vkbeautify.xml(text));
			})
	});

	$('#textarea').on('paste', (e) => {
		e.preventDefault();
		var text = e.originalEvent.clipboardData.getData('Text');
		$(this).val(vkbeautify.xml(text));
	});

	$('#convert-btn').click(() => {
		let text = $('#textarea').val();
		console.log(text)
		let xml = parse_file(text);

		console.log(xml);

		$('#textarea').val(vkbeautify.xml((new XMLSerializer()).serializeToString(xml)))

		$('#save').toggleClass('save');
	});

	$('.file-input').on('dragenter', (e) => {
		$(e.currentTarget).toggleClass('dragenter');
	})

	$('#file-input').on('dragleave', (e) => {
		$(e.currentTarget).toggleClass('dragenter');
	})

	$('#save').click(() => {
		var tempLink = document.createElement('a');
		let textArea = document.querySelector('textarea');
		var taBlob = new Blob([textArea.value], { type: 'text/xml' });
		tempLink.setAttribute('href', URL.createObjectURL(taBlob));
		tempLink.setAttribute('download', `${filename}`);
		tempLink.click();

		URL.revokeObjectURL(tempLink.href);
		$('#file-input').val('');
		$('#textarea').val('');
		$('#save').toggleClass('save');
	});

	// $('#copy').click(() => {
	// 	$('#textarea').select();
	// 	navigator.clipboard.writeText($('#textarea').val());
	// });

});
