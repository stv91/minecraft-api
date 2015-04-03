var REQUEST = require('request');
var CHEERIO = require('CHEERIO');
var _ = require('underscore');

var $;

function getIngredients(cell){
	var out = [];
	var ing_rec = $(cell).text().replace(/\n/g, "").split('or');
	for(i in ing_rec){
		var rec = ing_rec[i].replace(/\n|--/g, "").split('+');
		for(r in rec)
			rec[r] = rec[r].trim();
		out.push(rec);
	}
	return out;
}

/*function getIngredients(cell){
	var out = [];
	var ing_rec = $(cell).text().replace(/\n/g, "").split('--or--');
	for(i in ing_rec){
		var rec = ing_rec[i].split('+');
		var ing = [];
		for(r in rec){
			ing.push(rec[r].split('or'));
		}

		for(it in ing){
			for(it2 in ing[it]){
				if(out.length == 0){
					out.push(ing[it][it2]);
				}
			}
		}
			
	}
	return out;
}*/

function getName(th){
	return th.text().replace(/\n/g, "").split(' or ');
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
				var items = $(cells[c]).find('span.item');
				for(var a = 0; a < items.length; a++){ //Para los que tienen animación
					var img = $(items[a]).find('img')[0];
					var obj = null;
					if(img){
						obj = {
							//position: {x: c, y: r, a: a}, 
							position: {x: c, y: r}, 
							name: $(img).attr("alt"),
							scr: $(img).attr("src").split('?')[0],
						}
					}
					if(!out.recipe[a])
						out.recipe[a] = []
					out.recipe[a].push(obj);
					//out.recipe.push(obj);
				}
			}
		}
		
		//Obtenemos el item resultante
		
		table.find('.output>span').each(function(index, el) {
			var img = $(this).find('img');
			var number = $(this).find('.number>a').text();
			out.output.push({
				name: img.attr('alt'),
				src: img.attr('src').split('?')[0],
				number : (number != "")? number : "1"
			});
		});

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

function reformatRecipe(rec){
	var recipes = [];
	if(rec.recipe.length == rec.output.length || rec.output.length == 1){
		for(r in rec.recipe){
			var obj = {
				recipe : rec.recipe[r],
				output : rec.output[r]? rec.output[r] : rec.output[0],
				shapeless : rec.shapeless,
				fixed : rec.fixed
			}
			recipes.push(obj);
		}
		return recipes;
	}
	return null;
}

function reformat(obj){
	var out = [];
	var rec = reformatRecipe(obj.recipe);
		
	if(rec != null){
		//base case
		if(obj.name.length == 1 && obj.ingredients.length == 1){
			out.push({
				name : obj.name[0],
				ingredients : obj.ingredients[0],
				recipe : rec? rec[0] : null,
				descripcion : obj.descripcion
			});
		}
		else if(obj.ingredients.length == rec.length){
			for(i in rec){
				out.push({
					name : obj.name[i]? obj.name[i] : obj.name[0],
					ingredients : obj.ingredients[i],
					recipe : rec? rec[i] : null,
					descripcion : obj.descripcion
				});
			}
		}
	}
	else {
		console.log("Estamos jodidos para " + obj.name[0] + " - " + obj.recipe.recipe.length + " "  + obj.recipe.output.length );
	}

	return out;
}

function parseRecipes(html){
	var out = [];
	$ = CHEERIO.load(html);
	$($("table.wikitable>tr")[0]).nextAll('tr').each(function() {
		var obj = {};
		var cells = $(this).children('td');

		obj.name = getName($(this).children('th'));
		obj.ingredients = getIngredients(cells[0]);
		obj.recipe = getRecipe(cells[1]);
		obj.descripcion = $($(cells[2]).first()).text();
		//out.push(obj);
		out = out.concat(reformat(obj));
	});
	return out;
}


/****************************************************************/

function parse(url, ids, func){
	REQUEST(url, function (error, response, body) {
		var out = parseRecipes(body)
		func(out);
	});
}

module.exports = {parse: parse};