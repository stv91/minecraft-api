var cheerio = require('cheerio');
var $;

function getIngredients(cell){
	var ingredients = [];
	$(cell).find('a').each(function(index, val) {
		 ingredients.push($(this).text());
	});
	return ingredients;
}

function getName(th){
	var out = [];
	var links = th.find('a');

	for(var i = 0; i < links.length; i++){
		out.push($(links[i]).text());
	}

	if(links.length == 0)
		out.push($(th.children()[0]).text());

	return out;
}

function getRecipe(cell){
	var out = {recipe: [], output: [], shapeless: false, fixed: false};
	var table = $(cell).find('table');

	var rows = table.find('tr');
	if(rows.length == 3){
		//Obtenemos la receta
		for(var r = 0; r < rows.length; r++){
			var cells = $(rows[r]).find('td');
			//Obtenemos los 3 elementos de la fila
			for(var c = 0; c < 3; c++){
				var imgs = $(cells[c]).find('img');
				for(var a = 0; a < imgs.length; a++){ //Para los que tienen animación
					var img = $(imgs[a]);
					var obj = {
						position: {x: c, y: r, a: a}, 
						name: img.attr("alt"),
						scr: img.attr("src").split('?')[0],
					}
					out.recipe.push(obj);
				}
			}
		}
		
		//Obtenemos el item resultante
		var numberlink = table.find('.output .number a');
		var number = (numberlink)? numberlink.text() : "1";
		
		var img = table.find('.output img');
		for(var i = 0; i < img.length; i++){
			out.output.push({
				name: $(img[i]).attr("alt"),
				scr: $(img[i]).attr("src").split('?')[0],
				number: number
			});
		}

		//Obtenemos si la receta es fija o no importa la forma
		img = table.find('.shapeless img');
		var alt = img.attr("alt");
		if(alt){
			out.shapeless = (alt.indexOf('Shapeless') >= 0);
			out.fixed = (alt.indexOf('Fixed') >= 0);
		}
	}
	return out;
}


function parse(html){ 
	var out = [];
	$ = cheerio.load(html);
	var rows = $(".wikitable>tr");
	for(var i = 1; i < rows.length; i++){
		var obj = {};
		var cells = $(rows[i]).children('td');

		obj.name = getName($(rows[i]).children('th'));
		obj.ingredients = getIngredients(cells[0]);
		obj.recipe = getRecipe(cells[1]);
		obj.descripcion = $($(cells[2]).children()[0]).text();
		out.push(obj);
	}
	return out;
}	

module.exports = {parse: parse};