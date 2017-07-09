$(document).ready(function()
{
	$("#mainBody").fadeIn(500);
});
function formularCheck()
{
	var inputComplete = true;
	if($('input[name=gender]:checked', '#myForm').val() == undefined)
		inputComplete = false;
	if($("#firstName").val() == "" || $("#lastName").val() == "" || $("#placeBirth").val() == "" ||
		 $("#age").val() == "")
		inputComplete = false;	
	if(inputComplete)
	{
		$("#formularButton").removeClass("nextButtonShake");
		thisSound = document.getElementById("clickAudio");
		thisSound.play();
		$("#formularMain").fadeOut(1000 , function() {$("#susMain").fadeIn(1500);});
	}
	else
	{
		thisSound = document.getElementById("errorAudio");
		thisSound.play();
		$("#formularButton").addClass("nextButtonShake");
	}

}
var selectedRows = 0;
var selectedRowsValues = new Array(0,0,0,0,0,0,0,0,0,0);
function susHandler(fieldId)
{

	var fieldData = fieldId.match(/\d/g);
	var fieldRowNumber = parseInt(fieldData[0]);
	var fieldRow = $("#"+fieldId).parent()[0];
	for(var i = 1 ; i < fieldRow.children.length ; i++)
	{
		if(fieldRow.children[i].innerHTML === "X")
		{
			var oldValue = parseInt(fieldRow.children[i].id.match(/\d/g)[2]);
			$(fieldRow.children[i]).css("background-color" , "#D9D9D9");
			fieldRow.children[i].innerHTML = "";
			selectedRows--;
			break;
		}
	}
	selectedRowsValues[fieldRowNumber] = parseInt(fieldData[2]);
	selectedRows++;
	$("#"+fieldId).css("background-color" , "#b7b7b7");
	$("#"+fieldId).html("X");
}

function susCheck()
{
	if(selectedRows == 10)
	{
		$("#susButton").removeClass("nextButtonShake");
		thisSound = document.getElementById("clickAudio");
		thisSound.play();
		$("#susMain").fadeOut(1000 , function() {$("#chartsMain").fadeIn(1500);});
		storeData();
		createSettingsObject();
	}
	else
	{
		thisSound = document.getElementById("errorAudio");
		thisSound.play();
		$("#susButton").addClass("nextButtonShake");
	}
}

var normalColor = undefined;
$(".bar").hover( function() 
{
	normalColor = $( this).css('background');
	opacityIndex = normalColor.lastIndexOf(',');
	var hoverColor = normalColor.slice(0, opacityIndex) + ", 1.0)";
	$( this ).css('background', hoverColor);
  }, function() 
  {
    $( this ).css('background', normalColor);
  });
var userCount = 0;
var youId = 0;
function storeData()
{
	var firstName = $("#firstName").val();
	var lastName = $("#lastName").val()
	var gender = $('input[name=gender]:checked', '#myForm').val();
	var nationality = $("#nationality").val();
	var age = $("#age").val();
	eval("var user"+ userCount+" = new Object()");
	eval("user"+userCount+".firstName = '"+firstName+"'");
	eval("user"+userCount+".lastName = '"+lastName+"'");
	eval("user"+userCount+".gender = '"+gender+"'");
	eval("user"+userCount+".nationality = '"+nationality+"'");
	eval("user"+userCount+".age = '"+age+"'");
	eval("sus"+userCount+"= selectedRowsValues");
	eval("user"+userCount+".sus = selectedRowsValues");
	localStorage.setItem(eval("'user"+ userCount +"'") , JSON.stringify(eval("user"+ userCount)));
	youId = userCount;
	userCount++;
}
function createSettingsObject ()
{
	var settings = new Object();
	settings.isMale = document.getElementById("genderMale").checked;
	settings.isFemale = document.getElementById("genderFemale").checked;
	settings.isOthers = document.getElementById("genderOthers").checked;
	settings.isYoung = document.getElementById("youngAge").checked;
	settings.isMiddle = document.getElementById("middleAge").checked;
	settings.isOld = document.getElementById("oldAge").checked;
	settings.isYou = document.getElementById("youPeople").checked;
	settings.isOther = document.getElementById("otherPeople").checked;
	$('input[type="checkbox"]').prop("disabled" , true);
	setTimeout(function() {$('input[type="checkbox"]').prop("disabled" , false);} , 1000 );
	calcAverages(settings);
}
function calcAverages(settings)
{
	var wantedUsersCount = 0.0; //important that its float, to avoid rounding in average calculation
	var barValues = new Array(0,0,0,0,0,0,0,0,0,0); 
	for(var i = 0; i < userCount; i++)
	{
			var thisUsersData = JSON.parse(localStorage.getItem('user'+i));
			if(thisUsersData.gender == "male" && settings.isMale == false
			|| thisUsersData.gender == "female" && settings.isFemale == false
			|| thisUsersData.gender == "other" && settings.isOthers == false
			|| thisUsersData.age < 26 && settings.isYoung == false
			|| thisUsersData.age < 51 && thisUsersData.age > 25 && settings.isMiddle == false
			|| thisUsersData.age > 50 && settings.isOld == false
			|| i == youId && settings.isYou == false
			|| i != youId && settings.isOther == false)
				continue;
			else
			{ //add values of this users array to end result
				wantedUsersCount++;
				for(var j = 0; j < 10 ; j++)
					barValues[j] += thisUsersData.sus[j];
			}
	}
	if(wantedUsersCount != 0)
	{
		for(var i = 0; i< 10 ; i++)
			barValues[i] = parseInt(barValues[i] / wantedUsersCount * 25);
	}
	var susValue = 0;
	for(var i = 0 ; i < 10 ; i++)
	{
		susValue += barValues[i];
	}
	var susValue = parseInt(susValue / 10);
	console.log(susValue);
	var susHue = parseInt(susValue * 1.2);
	console.log(susHue);
	$("#colorMe").css("color" , "hsl("+ susHue +", 100%, 50%)");
	$("#colorMe").text(susValue);
	drawGraphs(barValues);
}
function drawGraphs(barValues)
{
	for(var i = 0 ; i < 10 ; i++)
	{
		$("#b" + i).css("transform" , "translateZ(0px)");
		$("#b" + i +" .barfront").css("height" , "0px");
		$("#b" + i +" .barback").css("height" , "0px");
		$("#b" + i +" .barright").css("width" , "0px");
		$("#b" + i +" .barleft").css("width" , "0px");
	}

	for(var i = 0 ; i < 10 ; i++)
	{	
		hslHue = parseInt(barValues[i] * 1.2);
		var barHeight = barValues[i]*2;
		$("#b" + i).velocity({translateZ : barHeight + "px"}, 1000);
		$("#b" + i).css("background" , "hsla("+hslHue+", 100%, 50%, 0.8)");
		$("#b" + i +" span").text(barValues[i]);
		$("#b" + i +" .barfront").velocity({"height" : barHeight + "px"}, 1000);
		$("#b" + i +" .barback").velocity({"height" : barHeight + "px"}, 1000);
		$("#b" + i +" .barright").velocity({"width" : barHeight + "px"}, 1000);
		$("#b" + i +" .barleft").velocity({"width" : barHeight + "px"}, 1000);	
	}
}
function again()
{
	youId = userCount;
	selectedRows = 0;
	//Flush data from Formular.
	$("#firstName").val("");
	$("#lastName").val("")
	$('input[name=gender]:checked', '#myForm').prop("checked" , false);
	$("#nationality").val("");
	$("#age").val("");
	//Flush data from SUS
	selectedRowsValues = new Array(0,0,0,0,0,0,0,0,0,0);
	var susRows = document.getElementById("susTable").firstElementChild.children;
	
	for(var i = 1 ; i < susRows.length ; i++) // we start i, j at 1. we ignore first column and first row
	{
		for(var j = 1 ; j < susRows[i].children.length; j++)
		{
			$(susRows[i].children[j]).css("background-color" , "#D9D9D9");
			susRows[i].children[j].innerHTML = "";
		}
	}
	$("#chartsMain").fadeOut(1000 , function () {$("#formularMain").fadeIn(1000)});
}
function addDummies ()
{
	var putin = {"firstName":"Владимирович","lastName":"Путин","gender":"male","nationality":"Russian","age":"64","sus":[4,4,4,4,4,4,4,4,4,4]};
	localStorage.setItem(eval("'user"+ userCount +"'") , JSON.stringify(putin));
	userCount++;
	var merkel = {"firstName":"Angela","lastName":"Merkel","gender":"female","nationality":"German","age":"62","sus":[2,3,4,2,1,2,3,1,0,2]};
	localStorage.setItem(eval("'user"+ userCount +"'") , JSON.stringify(merkel));
	userCount++;
	var trump = {"firstName":"Donald","lastName":"Trump","gender":"male","nationality":"American","age":"71","sus":[1,2,2,1,4,3,0,0,0,3]};
	localStorage.setItem(eval("'user"+ userCount +"'") , JSON.stringify(trump));
	userCount++;
	var roussef = {"firstName":"Dilma","lastName":"Roussef","gender":"female","nationality":"Brazilian","age":"69","sus":[1,3,0,2,0,4,3,2,1,4]};
	localStorage.setItem(eval("'user"+ userCount +"'") , JSON.stringify(roussef));
	userCount++;
	var may = {"firstName":"Theresa","lastName":"May","gender":"female","nationality":"British","age":"60","sus":[1,2,3,2,1,4,0,1,0,0]};
	localStorage.setItem(eval("'user"+ userCount +"'") , JSON.stringify(may));
	userCount++;
	var cBoss = {"firstName":"Dennis","lastName":"Ritchie","gender":"male","nationality":"American","age":"75","sus":[4,0,4,0,4,0,4,0,4,0]};
	localStorage.setItem(eval("'user"+ userCount +"'") , JSON.stringify(cBoss));
	userCount++;
	var jenner = {"firstName":"Caitlyn","lastName":"Jenner","gender":"other","nationality":"American","age":"67","sus":[4,0,4,0,4,0,4,0,4,0]};
	localStorage.setItem(eval("'user"+ userCount +"'") , JSON.stringify(jenner));
	userCount++;
	var profi1 = {"firstName":"Artuk","lastName":"Kakhorov","gender":"male","nationality":"Tajiki","age":"23","sus":[1,0,4,2,1,3,2,4,3,1]};
	localStorage.setItem(eval("'user"+ userCount +"'") , JSON.stringify(profi1));
	userCount++;
	var profi2 =
{"firstName":"Nicolas-Andreas","lastName":"Tamm-Garetto","gender":"male","nationality":"Chilean","age":"20","sus":[2,1,3,3,2,4,1,0,2,4]};
	localStorage.setItem(eval("'user"+ userCount +"'") , JSON.stringify(profi2));
	userCount++;
	var profi3 =
{"firstName":"Angela","lastName":"Carrieri","gender":"female","nationality":"Italian","age":"19","sus":[1,2,2,2,3,1,3,4,0,0]};
	localStorage.setItem(eval("'user"+ userCount +"'") , JSON.stringify(profi3));
	userCount++;
	var joe =
{"firstName":"Joe","lastName":"Smith","gender":"male","nationality":"American","age":"42","sus":[1,4,1,2,3,4,1,2,3,3]};
	localStorage.setItem(eval("'user"+ userCount +"'") , JSON.stringify(joe));
	userCount++;
	var maxi =
{"firstName":"Max","lastName":"Mustermann","gender":"male","nationality":"German","age":"42","sus":[2,1,3,4,2,1,0,2,1,4]};
	localStorage.setItem(eval("'user"+ userCount +"'") , JSON.stringify(maxi));
	userCount++;
	var emma =
{"firstName":"Emma","lastName":"Miller","gender":"female","nationality":"Iranian","age":"42","sus":[1,3,4,3,2,1,4,2,4,0]};
	localStorage.setItem(eval("'user"+ userCount +"'") , JSON.stringify(emma));
	userCount++;
	var picasso =
{"firstName":"Pablo Diego José Francisco de Paula Juan Nepomuceno María","lastName":"de los Remedios Cipriano de la Santísima Trinidad Ruiz y Picasso","gender":"male","nationality":"Spanish","age":"91","sus":[4,0,4,0,4,0,4,0,4,0]};
	localStorage.setItem(eval("'user"+ userCount +"'") , JSON.stringify(maxi));
	userCount++;

	createSettingsObject();
	$("#addDummiesButton").prop("disabled" , true);
}
window.onbeforeunload = function()
{
  localStorage.clear();
  return ''; // must return String
};
