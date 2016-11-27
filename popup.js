// 
// Name: Rohan Bhargava 
// Date: 8/29/16
// File name: popup.js
// Description: Takes care of all javascript for the popup displayed
//

/*
Runs code after all dom content has been loaded
*/
document.addEventListener('DOMContentLoaded', function() {
	
	chrome.storage.sync.clear();
	
	//add add row event to button click 
	document.getElementById("submitButton").addEventListener('click', addRow);
	
	//display old rows if any 
	displayRows();	
});

/*
Function that adds rows with all the appropriate listeners 
*/
function addRow() {
	
	//the website to block
	var tempValue = document.getElementById('formInput').value;
	
	//if nothing is entered then do nothing 
	if(tempValue == '') {
		return;
	}
	
	//json object to store 
	var tempStore = {
		"name": tempValue,
		"html": '<li id=' + tempValue + ' class=deletebut style="list-style: none; float:left">' + tempValue+ '</li>'
	}
	
	
	//store the value of the url to block in the array 
	chrome.storage.sync.get("array", function(e) {
		if(e.array) {
			e.array.push(tempStore);
		} else {
			//create the array if it is not made 
			e.array = [];
			e.array.push(tempStore);
		}
		
		//sync the array in the chrome storage
		chrome.storage.sync.set({"array": e.array});
	}
	);
}

//every time chrome storage changes call the row update function
chrome.storage.onChanged.addListener(displayRows);
			
//this function displays the rows of data 
function displayRows() {
	chrome.storage.sync.get("array", function(e) {
		
		$("#formOut").empty();
		
		//append each row to the form object
		for(i=0; i < e.array.length; i++) {
			$("#formOut").append(e.array[i].html);
			
			//if the delete button is pressed, remove from the array
			var searchString = '#' + e.array[i].name;
			$('.deletebut').click(function(event) {
				chrome.storage.sync.get("array", function(e) {
					for(i=0; i < e.array.length; i++) {
						if(e.array[i].name == event.target.id) {
							e.array.splice(i, 1);
						}
					}
					
					//sync updated array with chrome storage
					chrome.storage.sync.set({"array": e.array});
				
				});
				
			});
		
		}

	});
}
