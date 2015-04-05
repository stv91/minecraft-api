var REQUEST = require('request');
var CHEERIO = require('cheerio');
var _ = require('underscore');
var $;

function getProperty(name){
	var prop = null;
	$('.notaninfobox>table.infobox-rows tr').each(function() {
		var text = $(this).text();
		if(text.indexOf(name) >= 0){
			prop = $(this).find('td').text().replace(/\n/g, "");
		}
	});
	return prop;
}

function parseDetails(html, item){
	var out;
	$ = CHEERIO.load(html);
	//console.log("parse -> " + item.name);

	var stackable = 0;
	var prop_stackable = getProperty('Stackable');
	if(prop_stackable != null && prop_stackable.indexOf('Yes') >= 0){
		stackable = parseInt(prop_stackable.replace( /^\D+/g, ''));
	}

	var img = $('.notaninfobox>div a.image>img');
	out = {
		//id : item.dec,
		img : img.attr('src') ? img.attr('src').split('?')[0] : undefined,
		type : getProperty('Type'),
		stackable : stackable
	};

	item.src = undefined;

	return _.extend(item, out);
}

/********************************************************/
function parse(index, ids, func){
	var base_url = "http://minecraft.gamepedia.com";
	//console.log(base_url + ids[index].src);
	REQUEST(base_url + ids[index].src, function (error, response, body) {
		if(body) {
			var out = parseDetails(body, ids[index]);
			func(out);
		}
	});
}

module.exports = {parse: parse};