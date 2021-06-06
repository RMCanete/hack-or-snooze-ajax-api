
"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDeleteButton = false) {
  console.debug("generateStoryMarkup", story);
  const hostName = story.getHostName();
  // Show star
  const star = Boolean(currentUser);
  // Show delete button
  return $(`
      <li id="${story.storyId}"> 
      ${showDeleteButton ? deleteButton() : ""}
      ${star ? createStar(story, currentUser): ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);     
     
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

// Add favorites

function addFavoritesList(){
    console.debug("addFavoritesList");

  $favoriteStories.empty();

    if (currentUser.favorites.length == 0) {
      $favoriteStories.append("<h1>No user favorites</h1>")
    }
    else {
    // loop through all of our stories and generate HTML for them
      for (let story of currentUser.favorites) {
        const $story = generateStoryMarkup(story);
        $favoriteStories.append($story);
      }
    }
    $favoriteStories.show();
  }

// Submit a new story form

async function submitNewStory(evt) {
  console.debug("submitNewStory");
  evt.preventDefault();

  const title = $("#create-title").val();
  const author = $("#create-author").val();
  const url = $("#create-url").val();
  const data = {title, author, url};

  const story = await storyList.addStory(currentUser, data);
  const generateStory = generateStoryMarkup(story);
  $allStoriesList.prepend(generateStory);
}
$submitStoryForm.on("submit", submitNewStory);

// Create favorite star

function createStar(story, user) {
  const newFavorite = user.favorite(story);
  const star = newFavorite ? "fas" : "far";
  return `<span class="star"><i class="${star} fa-star"></i></span>`;
}
  
// Mark / unmark a favorite

async function changeFavorite(e) {
  console.debug(changeFavorite);
    
  const $target = $(e.target);
  const li = $target.closest('li');
  const storyId = li.attr("id");
  const story = storyList.stories.find(s=>s.storyId ==storyId);

  if ($target.hasClass('fas')) {
    await currentUser.unmarkFavorite(story);
    $target.closest('i').toggleClass('fas far');
  } 
  else {
    await currentUser.markFavorite(story);
    $target.closest('i').toggleClass('fas far');
  }
}
$storiesList.on('click', '.star', changeFavorite);

// Add user stories

function addUserStories() {
  console.debug("addUserStories");

  $myStories.empty();

  if(currentUser.ownStories == 0) {
    $myStories.append("<h1>No User Stories</h1>");
  }
  else {
    for (let ownStory of currentUser.ownStories) {
      let story = generateStoryMarkup(ownStory, true);
      $myStories.append(story);
    }
  }
  $myStories.show();
}

// Create delete button

function deleteButton() {
  return `<span class = "trash-can"><i class="fas fa-trash-alt"></i></span>`;
}

// Delete a story

async function deleteStory(e) {
  console.debug('deleteStory');

  const $target = $(e.target);
  const li = $target.closest('li');
  const storyId = li.attr("id");
  
  await storyList.removeStory(currentUser, storyId);
  await addUserStories();
}
$myStories.on('click', ".trash-can", deleteStory);