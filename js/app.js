$(document).ready(function() {
	"use strict";

	// setup variabls
	var _selected,
		ajax = [],
		jsonArray = [],
		jsonData = {},
		_added = [],
		_selectedIAs = {
			Spice: [],
			Fathead: [],
			Goodies: [],
			Longtail: [],
			IsAwesome: [],
			Cheatsheets: [],
		},
		urls = {
			spice: 'data/spice.json', //https://duck.co/ia/repo/spice/json',
			goodies: 'data/goodie.json' //https://duck.co/ia/repo/goodies/json'
		};

	var autocomplete = document.getElementById("ia_autocomplete"),
		$textarea = $("#md-text");

	// iterate over urls to grab
	// collect in array of AJAX promises
	$.each(urls, function(k, v) {
		var name = k,
			url = v;

		ajax.push( $.getJSON(url) );
	});

	// Wait for promises to return
	//
	// This callback will be called with multiple arguments,
	// one for each AJAX call
	// Each argument is an array with the following structure: [data, statusText, jqXHR]
	$.when.apply($, ajax).done(function(){

		for ( var i = 0, len = arguments.length; i < len; i++ ) {
			var data = arguments[i][0];
			$.extend(jsonData, data);
			var arr = $.map(data, function(el) { return el; });
			jsonArray = jsonArray.concat(arr);
		}
		// console.dir(jsonArray);
		// console.dir(jsonData);

		horsey( autocomplete, {
			suggestions: jsonArray,
			getText: function (suggestion) {
				return suggestion.id;
			},
			getValue: function (suggestion) {
				return suggestion.id;
			},
			set: function(value){
				_selected = value;
				autocomplete.value = value;
			}
		});

		$(autocomplete).on("horsey-selected", function(){
			var ia = jsonData[_selected],
				type = getType(ia);
			if (_added[ia.id]){
				return false;
			} else {
				_added[ia.id] = true;
				_selectedIAs[type].push(ia);
				// console.dir(_selectedIAs);
				var markdown = getText(_selectedIAs);
				$($textarea).val(markdown);
				$("#ia_autocomplete").val("");
			}
		});
	});

	function getText(iaArray){
		var markdown = [];
		$.each(iaArray, function(type, ias) {
			if (ias.length === 0) {
				// console.log("Skipping: " +type);
				return true;
			}
			// console.log("Getting text for: " + type);

			var title = "\n## " + type + "\n\n",
				linkArray = [];
			// console.log(title);
			$.each(ias, function(index, ia) {
				 linkArray.push( makeLink(ia) );
			});
			linkArray.sort();
			markdown.push( title + linkArray.join("\n") );
		});
		return markdown.join("\n\n");
	}

	function makeLink(ia){
		var identifier = ia.perl_module;
		if (ia.perl_module.search(/DDG::Goodie::CheatSheets/) != -1){
			identifier = ia.name; // use IA name because cheat sheets have the same module
		}
		var pageLink = "- [ ] [" + identifier + "](https://duck.co/ia/view/" + ia.id + ")",
			queryEncoded = encodeURIComponent(ia.example_query),
			prodQueryLink = "- Production: [" + ia.example_query + "](https://duckduckgo.com/?q=" + queryEncoded + ")",
			stagingQueryLink = "- Staging: [" + ia.example_query + "](https://staging.duckduckgo.com/?q=" + queryEncoded + ")",
			line = pageLink +  "\n    " + prodQueryLink + "\n    " + stagingQueryLink;
		// console.log(line);
		return line;
	}

	function getType(ia){
		var module = ia.perl_module;
		// console.log(module);
		if ( module.search(/DDG::Spice/) != -1 ){
			return "Spice";
		}
		if ( module.search(/DDG::Fathead/) != -1 ){
			return "Fathead";
		}
		if ( module.search(/DDG::Longtail/) != -1 ){
			return "Longtail";
		}
		if ( module.search(/DDG::Goodie::IsAwesome/) != -1 ){
			return "IsAwesome";
		}
		if ( module.search(/DDG::Goodie::CheatSheets/) != -1 ){
			return "Cheatsheets";
		}
		if ( module.search(/DDG::Goodie/) != -1 ){
			return "Goodies";
		}
	}

	var $urlInput = $("#compare_url"),
		compUrl = $urlInput.val(),
		$urlBtn = $("#compare_btn");

	$urlBtn.click(function(event) {
		$.ajax(compUrl).success(function(data) {
			var html = $.parseHTML(data),
				files = [];

			console.log(html);

			var headers = $(html, "span.user-select-contain").each(function(index, el) {
					var text = $(el).val();

					console.log(text);
					if (text.search(/\w+\.(pm|json|js|css)$/) !== -1){
						files.push(text);
					}
				});
		});
	});

});
