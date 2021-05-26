var myWebpage = document.body;
var movieAPI = "9c5dbcc8325add89d9671960be80deee";
var gamesAPI = "9a5faf5a1494404bb42b76ac7d60cdcd";
var musicAPI = "";

document.addEventListener("DOMContentLoaded", searchMovies);

// Displays the 40 most relevant results.
function searchMovies() {
    document.getElementById("movieSubmit").addEventListener("click", function (event) {
        var req = new XMLHttpRequest();
        var movieQuery = document.getElementById("movieQuery").value;
        req.open("GET", "https://api.themoviedb.org/3/search/movie?api_key=" + movieAPI + "&language=en-US&query=" + movieQuery + "&page=1&include_adult=false", false);
        req.send(null);
        var response = JSON.parse(req.responseText);
        var searchResults = response.results;

        // Removes previous search results.
        var bodyList = document.getElementById("searchResultsContainer");
        if (bodyList.children.length > 0) {
            let removed_list = document.getElementById("searchResultsList");
            removed_list.remove();
        }

        // Display list of movies matching the search terms.
        var searchList = movieSearchResults(searchResults);
        bodyList.appendChild(searchList);

        // Display the next 20 results.
        var req = new XMLHttpRequest();
        var movieQuery = document.getElementById("movieQuery").value;
        req.open("GET", "https://api.themoviedb.org/3/search/movie?api_key=" + movieAPI + "&language=en-US&query=" + movieQuery + "&page=1&include_adult=false", false);
        req.send(null);
        var response = JSON.parse(req.responseText);
        var searchResults = response.results;
        var searchList = movieSearchResults(searchResults);

        event.preventDefault();
    })
}

function movieSearchResults(searchArray) {
    var newList = document.getElementById("searchResultsList");

    if (newList === null) {
        var newList = document.createElement("ul");
        newList.id = "searchResultsList"
    }

    // Adds each title to the unordered list.
    for (let i = 0; i < searchArray.length; i++) {
        let newListItem = document.createElement("li");
        let addToUserListButton = document.createElement("button");

        // Add button to add movie to the user's list.
        addToUserListButton.className = "addToListButton";
        addToUserListButton.textContent = "Add to list";
        addToUserListButton.addEventListener("click", function () {
            addToMovieList(searchArray[i]);
        });

        newListItem.appendChild(document.createTextNode(searchArray[i].original_title));
        newListItem.appendChild(addToUserListButton);
        newList.appendChild(newListItem);
    }

    return newList;
}

function addToMovieList(itemToAdd) {
    var userList = document.getElementById("userList");
    var newRow = document.createElement("tr");
    var cover = newRow.insertCell(0);
    var title = newRow.insertCell(1);
    var overview = newRow.insertCell(2);
    var remove = newRow.insertCell(3);

    console.log(itemToAdd);

    // Adds remove button to remove a movie from the user's list.
    var removeButton = document.createElement("button");
    removeButton.textContent = "Remove from list";
    removeButton.addEventListener("click", function () {
        userList.deleteRow(this.parentElement.parentElement.rowIndex);
    });

    // Displays the poster picture, title, overview, and remove button for the user's list.
    if (itemToAdd.poster_path === null) {
        cover.innerHTML = "<img src=noImage.jpg>";
        cover.innerHTML += "<div>Picture from depositphotos.com.</div>";      // Cites the picture.
    }
    else {
        cover.innerHTML = "<img src=http://image.tmdb.org/t/p/original" + itemToAdd.poster_path + ">";
        cover.innerHTML += "<div>Picture from TheMovieDB.</div>";      // Cites the picture.    
    }
    title.textContent = itemToAdd.original_title;
    overview.textContent = itemToAdd.overview;
    remove.appendChild(removeButton);
    userList.appendChild(newRow);

    // Unimplemented feature.
    // // Removes the search list after adding to the user's list.
    // var bodyList = document.getElementById("searchResultsContainer");
    // if (bodyList.children.length > 0){
    //     let removed_list = document.getElementById("searchResultsList");
    //     removed_list.remove();
    // }
}