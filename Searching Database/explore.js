// Get references to the buttons and modal

const openModalButton = document.getElementById('openModalButton');
const searchModal = document.getElementById('searchModal');
const closeModalButton = document.getElementsByClassName('close')[0];
const searchForm = document.querySelector("#searchForm");
const searchQueryInput = document.querySelector("#searchQuery");
const searchResultsContainer = document.querySelector("#searchResults");

// Function to open the modal
function openModal() {
  searchModal.style.display = 'block';
}

// Function to close the modal
function closeModal() {
  searchModal.style.display = 'none';
}

// Event listeners
openModalButton.addEventListener('click', openModal);
closeModalButton.addEventListener('click', closeModal);

searchForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const searchQuery = searchQueryInput.value.trim();

  if (searchQuery !== "") {
    searchDatabase(searchQuery);
  }
});


function searchDatabase(query) {
  const response = getresponse();

  const options = {
      method: "GET",
      headers: {
          Authorization: `Bearer ${response.token}`,
      },
  };

  searchResultsContainer.innerHTML = "";

  fetch (`${apiBaseURL}/api/search?q=${encodeURIComponent(query)}`, options)
    .then(response => response.json())
    .then(searchResults => {
      displaySearchResults(searchResults);
    })
    .catch(error => {
      console.error("Search error:", error);
    });
}

function displaySearchResults(results) {
  let resultsHTML = "";

// Adjust search result categories and layouts as needed

  // Display users
  resultsHTML += "<h5>Users</h5>";
  if (results.users.count > 0) {
      results.users.data.forEach(user => {
          resultsHTML += `
          <div class="card">
            <div class="card-header">
            <button type="button" class="user-thumbnail"><img src="${user.avatar}"></button>
            <b>@${user.username}</b></div>
            <div class="card-body">
              <p class="card-text">${user.full_name}</p>
                <p class="card-text">${user.bio}</p>
            </div>
          </div><br>`;
      });
  } else {
      resultsHTML += "<p>No users found.</p>";
  }

  // Display posts
  resultsHTML += "<h5>Posts</h5>";
  if (results.posts.count > 0) {
      results.posts.data.forEach(post => {
          resultsHTML += `
          <div class="card">
            <div class="card-header">
              <b>${post.title}</b>
              <b>@${post.username}</b></div>
            <div class="card-body">
                <p class="card-text">${post.content}</p>
            </div>
          </div><br>`;
      });
  } else {
      resultsHTML += "<p>No posts found.</p>";
  }

  // Display events
  resultsHTML += "<h5>Events</h5>";
  if (results.events.count > 0) {
      results.events.data.forEach(event => {
          resultsHTML += `
          <div class="card">
            <div class="card-header">
              <b>${event.event_name} | ${event.event_date}</b>
              <b>@${event.username}</b></div>
            </div>
            <div class="card-body">
                <p class="card-text">${event.event_description}</p>
              </div>
            <div class="card-footer text-muted">${event.location_text} | Tags:</div>
          </div><br>`;
      });
  } else {
      resultsHTML += "<p>No events found.</p>";
  }

// Display Polls
resultsHTML += "<h5>Polls</h5>";
if (results.polls.count > 0) {
    results.polls.data.forEach(poll => {
        resultsHTML += `
        <div class="card">
          <div class="card-header">
            ${poll.question}
            <b>@${poll.username}</b>
          </div>
          <div class="card-body">
              <p class="card-text">Created by: ${poll.user_id}</p></div>
              <div class="card-footer text-muted">Tags:</div>
            </div>
        </div><br>`;
  })
} else {
    resultsHTML += "<p>No polls found.</p>";
};

  // Display Skills
  resultsHTML += "<h5>Skills</h5>";
  if (results.skills.count > 0) {
      results.skills.data.forEach(skills => {
          resultsHTML += `
          <div class="card">
            <div class="card-header">
            <img src = ${skills.image_path} class = "skill-images">
            <div id = "skill-name"><b>${skills.skill_name}</b></div>
            </div>
            <div class="card-body">
                <p class="card-text">${skills.description}</p>
              </div>
          </div><br>`;
      });
  } else {
      resultsHTML += "<p>No skills found.</p>";
  }

  // Set the HTML content of the searchResultsContainer
  searchResultsContainer.innerHTML = resultsHTML;
}

