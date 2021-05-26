var myWebpage = document.body;
var gameAPI = "9a5faf5a1494404bb42b76ac7d60cdcd";

document.addEventListener("DOMContentLoaded", searchGames);

// Displays the 40 most relevant results.
function searchGames() {
    document.getElementById("gameSubmit").addEventListener("click", function (event) {
        var req = new XMLHttpRequest();
        var gameQuery = document.getElementById("gameQuery").value;
        req.open("GET", "https://api.rawg.io/api/games?key=" + gameAPI + "&page_size=40&search=" + gameQuery + "&search_precise=true", false);
        req.send(null);
        var response = JSON.parse(req.responseText);
        var searchResults = response.results;

        // Removes previous search results.
        var bodyList = document.getElementById("searchResultsContainer");
        if (bodyList.children.length > 0) {
            let removed_list = document.getElementById("searchResultsList");
            removed_list.remove()
        }

        // Display list of games matching the search terms.
        var searchList = gameSearchResults(searchResults)
        bodyList.appendChild(searchList);

        // Unimplemented feature.
        // // RAWG forces pagination, so continue listing the results from the rest of the pages.
        // while (response.next !== null){
        //     var req = new XMLHttpRequest();
        //     req.open("GET", response.next, false);
        //     req.send(null);
        //     var response = JSON.parse(req.responseText);
        //     var searchResults = response.results;
        //     var searchList = gameSearchResults(searchResults)
        // }

        event.preventDefault();
    })
}

function gameSearchResults(searchArray) {

    var newList = document.getElementById("searchResultsList");

    if (newList === null) {
        var newList = document.createElement("ul");
        newList.id = "searchResultsList"
    }

    // Adds each title to the unordered list.
    for (let i = 0; i < searchArray.length; i++) {
        let newListItem = document.createElement("li");
        let addToUserListButton = document.createElement("button");

        // Add button to add game to the user's list.
        addToUserListButton.className = "addToListButton";
        addToUserListButton.textContent = "Add to list";
        addToUserListButton.addEventListener("click", function () {
            addToGameList(searchArray[i]);
        });

        newListItem.appendChild(document.createTextNode(searchArray[i].name));
        newListItem.appendChild(addToUserListButton);

        newList.appendChild(newListItem);
    }

    return newList;
}

function addToGameList(itemToAdd) {

    // Get specified game information.
    var infoReq = new XMLHttpRequest();
    infoReq.open("GET", "https://api.rawg.io/api/games/" + itemToAdd.id + "?key=" + gameAPI, false);
    infoReq.send(null);
    var response = JSON.parse(infoReq.responseText);
    console.log(response);

    var userList = document.getElementById("userList");
    var newRow = document.createElement("tr");
    var cover = newRow.insertCell(0);
    var title = newRow.insertCell(1);
    var overview = newRow.insertCell(2);
    var metacritic = newRow.insertCell(3);
    var remove = newRow.insertCell(4);

    // Remove button to remove a game from the user's list.
    var removeButton = document.createElement("button");
    removeButton.textContent = "Remove from list";
    removeButton.addEventListener("click", function () {
        userList.deleteRow(this.parentElement.parentElement.rowIndex);
    });

    // Displays the poster picture, title, overview, metacritic link, and remove button for the user's list.
    if (response.background_image === null) {
        cover.innerHTML = "<img src=noImage.jpg>";
        cover.innerHTML += "<div>Picture from depositphotos.com.</div>";      // Cites the picture.
    }
    else {
        cover.innerHTML = "<img src=" + response.background_image + ">";
        cover.innerHTML += "<div>Picture from RAWG.</div>";      // Cites the picture.    
    }
    if (response.description_raw !== "") {
        overview.textContent = response.description_raw;
    }
    else if (response.description !== "") {
        overview.textContent = response.description.replace(/(<([^>]+)>)/ig, '');
    }
    else {
        overview.textContent = "No description available.";
    }
    if (response.metacritic_url === "") {
        metacritic.textContent = "N/A";
    }
    else {
        metacritic.innerHTML = "<a href='" + response.metacritic_url + "'>Metacritic</a>";
    }
    title.textContent = itemToAdd.name;
    remove.appendChild(removeButton);
    userList.appendChild(newRow);

    // Unimplemented feature.
    // Removes the search list after adding to the user's list.
    // var bodyList = document.getElementById("searchResultsContainer");
    // if (bodyList.children.length > 0){
    //     let removed_list = document.getElementById("searchResultsList");
    //     removed_list.remove()
    // }
}