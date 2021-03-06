"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

// submit a story by clicking submit

function navSubmitStoryClick(evt) {
  console.debug("navSubmitStory", evt);
  hidePageComponents();
  $allStoriesList.show();
  $submitStoryForm.show();
}

$navSubmitStory.on("click", navSubmitStoryClick);

function navFavoritesClick(evt){
  console.debug("navFavoritesClick", evt);
  hidePageComponents();
  addFavoritesList();
}

$body.on("click", "#nav-favorites", navFavoritesClick);

function navMyStoriesClick(evt){
  console.debug("navMyStoriesClick", evt);
  hidePageComponents();
  addUserStories();
  $myStories.show();

}

$body.on("click", "#nav-my-stories", navMyStoriesClick);
 
