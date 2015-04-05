var REQUEST = require('request');
var CHEERIO = require('cheerio');
var $;

function extractBlock (s){
	var words = s.split(' ');
	var block = "";
	for(var i = 0; i < words.length; i++){
		if(words[i] != 'I' && words[i] != 'B' && words[i] != 'S' && words[i] != 'E' && words[i] != 'D')
			block += words[i] + " ";
	}
	return block.trim();
}

/*function extractImg(src){
	if(!src)
		return undefined;
	var clean_url = src.split('?')[0];
	var split_url = clean_url.split('/')
	var img_name = split_url[split_url.length - 1].split('px-')[1];
	var base_url = "";
	for(var i = 0; i < split_url.length - 1; i++)
		base_url += split_url[i] + '/';

	var version = {"16" : "", "25" : "", "32" : "", "64" : "", "128" : ""};
	for(size in version){
		version[size] = base_url + size + "px-" + img_name;
	}

	return version;
}*/

function getItem(row){
	var rows = row.find('td');
	var block = extractBlock($(rows[4]).text());
	if(block.indexOf('unused') > 0) //it's not an item, just an empty registered id
		return undefined;

	var data = {
		dec : $(rows[1]).text(),
		hex	: $(rows[2]).text(),
		name : $(rows[3]).text(),
		block : block,
		src : $(rows[4]).find('a').attr('href')
	};

	//var imgs = extractImg($($(rows[0]).find('img')[0]).attr('src'));

	//return {data: data, img: {id : data.dec, version: imgs}};
	return data;
}

function parseItems(html){
	var out_items = [];
	//var out_imgs = [];

	$ = CHEERIO.load(html);
	$('#mw-content-text table').each(function() {
		$($(this).find('tr')[0]).nextAll('tr').each(function() {
			var item = getItem($(this));
			if(item){
				out_items.push(item);
				//out_items.push(item.data);
				//out_imgs.push(item.img);
			}
		});
	});

	//return {items: out_items, images : out_imgs};
	return out_items;
}


/*****************************************************************/

function parse(url, func){
	REQUEST(url, function (error, response, body) {
		var out = parseItems(body)
		func(out);
	});
}

module.exports = {parse: parse};