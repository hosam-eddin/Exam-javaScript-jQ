// APIs:
// - search by name: https://www.themealdb.com/api/json/v1/1/search.php?s=
// - search by first letter: https://www.themealdb.com/api/json/v1/1/search.php?f=
// - search by Id: https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}
// - search by Category: https://www.themealdb.com/api/json/v1/1/categories.php

const menuItems = Array.from(document.querySelectorAll(".menu"));
let menuItemIndex = 0;
const animationDuration = 500;

const sideBar = document.querySelector("#sideBar");
const sideBarInnerWidth = $(".side").innerWidth();
sideBar.style.left = `-${sideBarInnerWidth}px`;

function resetLoading() {
  $("#content").html(``);
  $("#loading").fadeIn(animationDuration / 5, function () {
    $("body").css("overflow", "hidden");
  });
}

// SideNav Animation
const toggleSideBar = () => {
  const isSideBarOpen = sideBar.style.left === "0px";

  if (isSideBarOpen) {
    $(sideBar).animate({ left: `-${sideBarInnerWidth}px` }, animationDuration);

    $(".closeBtn").addClass("visually-hidden");
    $(".barsBtn").removeClass("visually-hidden");

    menuItems.forEach((menuItem) => {
      menuItem.classList.remove("animate__fadeInUpBig");
      menuItem.classList.add("animate__fadeOut");
    });

    setTimeout(() => {
      menuItems.forEach((menuItem) => {
        menuItem.classList.add("visually-hidden");
      });
    }, animationDuration / 2);
  } else {
    $(sideBar).animate({ left: "0px" }, animationDuration);
    $(".barsBtn").addClass("visually-hidden");
    $(".closeBtn").removeClass("visually-hidden");

    const interval1 = setInterval(() => {
      const currentItem = menuItems[menuItemIndex];
      currentItem.classList.remove("animate__fadeOut", "visually-hidden");

      currentItem.classList.add("animate__fadeInUpBig");

      menuItemIndex++;
      if (menuItemIndex === menuItems.length) {
        clearInterval(interval1);
        menuItemIndex = 0;
      }
    }, 50);
  }
};
$(".btnOpen").click(toggleSideBar);

// Start Site

// First Page by search API
$(document).ready(function () {
  $("#loading").fadeOut(animationDuration * 1.2, function () {
    $("body").css("overflow", "visible");
    firstPageMeals();
  });
});

async function firstPageMeals() {
  let res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=`
  );
  let mealsData = await res.json();
  console.log(mealsData);

  // Ready to display function
  displayFirstPageMeals(mealsData);
  getMealIdPlusGetDetails();
}

function displayFirstPageMeals(mealsData) {
  let cartona = "";
  for (let i = 0; i < mealsData.meals.length; i++) {
    cartona += `
      <div class="moveUp col-lg-3 col-md-6">
        <div class="position-relative rounded-4 overflow-hidden">
          <div class="slideUp bg-light bg-opacity-50 w-100 h-100 position-absolute top-0 start-0 d-flex justify-content-center align-items-center textShadow">
            <p class="fs-4 fw-bold text-center">${mealsData.meals[i].strMeal}</p>
            <span class="visually-hidden">${mealsData.meals[i].idMeal}</span>
          </div>
          <img class="w-100" src="${mealsData.meals[i].strMealThumb}" alt="">
        </div>
      </div>
    `;
  }
  $("#content").html(cartona);
}

function getMealIdPlusGetDetails() {
  $(".slideUp").click(function () {
    let mealId = $(this).find("span").text();

    resetLoading();
    $(document).ready(function () {
      $("#loading").fadeOut(animationDuration, function () {
        $("body").css("overflow", "visible");
        getMealDetails(mealId);
      });
    });
  });
}

async function getMealDetails(mealId) {
  let res2 = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
  );
  let mealDetails = await res2.json();
  console.log(mealDetails);

  let mealFinalDetails = {
    Recipes: getRecipesArray(mealDetails),
    Tags: getTagsArray(mealDetails),
    Instructions: mealDetails.meals[0].strInstructions,
    Area: mealDetails.meals[0].strArea,
    Category: mealDetails.meals[0].strCategory,
    Source: mealDetails.meals[0].strSource,
    Youtube: mealDetails.meals[0].strYoutube,
    recImage: mealDetails.meals[0].strMealThumb,
    recName: mealDetails.meals[0].strMeal,
  };

  // Ready to display function
  displayMealDetails(
    mealFinalDetails.Recipes,
    mealFinalDetails.Tags,
    mealFinalDetails.Instructions,
    mealFinalDetails.Area,
    mealFinalDetails.Category,
    mealFinalDetails.Source,
    mealFinalDetails.Youtube,
    mealFinalDetails.recImage,
    mealFinalDetails.recName
  );
}

function displayMealDetails(
  Recipes,
  Tags,
  Instructions,
  Area,
  Category,
  Source,
  Youtube,
  recImage,
  recName
) {
  let recipesCartona = "";
  if (Recipes != null) {
    for (let x = 0; x < Recipes.length; x++) {
      recipesCartona += `<div class="recipiesCont rounded-2 px-2 py-1 me-2 my-2">${Recipes[x]}</div>`;
    }
  }

  let tagsCartona = "";
  if (Tags != null) {
    for (let x = 0; x < Tags.length; x++) {
      tagsCartona += `<div class="recipiesCont rounded-2 px-2 py-1 me-2 my-2">${Tags[x]}</div>`;
    }
  }

  let detailsCartona = `
    <div class="col-lg-4">
      <img class="w-100 rounded-4 border border-1" src="${recImage}" alt="">
      <h2 class="text-light fs-3 text-center mt-2">${recName}</h2>
    </div>
    <div class="col-lg-8">
      <p class="text-warning fs-5"><b>Instructions:</b></p>
      <p class="text-light fs-6">${Instructions}</p>
      <p class="text-warning fs-5 mb-2"><b>Area:</b> <span class="fs-6 text-light">${Area}</span></p>

      <p class="text-warning fs-5 mb-2"><b>Category:</b> <span class="text-light fs-6">${Category}</span></p>

      <p class="text-warning fs-5 mb-1"><b>Recipes:</b></p>
      <div class="d-flex flex-wrap">
        ${recipesCartona}
      </div>

      <p class="text-warning fs-5 mb-1"><b>Tags:</b></p>
      <div class="d-flex flex-wrap">
        ${tagsCartona}
      </div>

      <p class="text-warning fs-5 mb-1"><b>Reference:</b></p>
      <div class="d-flex flex-wrap">
        <a href="${Source}">
          <div class="btn btn-success rounded-2 px-2 py-1 me-2 my-2">Source</div>
        </a>
        <a href="${Youtube}">
          <div class="btn btn-danger rounded-2 px-2 py-1 me-2 my-2">Youtube</div>
        </a>
      </div>
    </div>
  `;
  $("#content").html(detailsCartona);
}

function getRecipesArray(mealFindDetail) {
  var Recipes = [];
  for (var i = 1; i <= 20; i++) {
    var temp = mealFindDetail.meals[0][`strIngredient${i}`];
    var temp1 = mealFindDetail.meals[0][`strMeasure${i}`];
    if (temp != "") {
      Recipes[i - 1] = `${temp1} ${temp}`;
    }
  }
  return Recipes;
}

function getTagsArray(mealFindDetail) {
  var Tags = mealFindDetail.meals[0].strTags;
  console.log(Tags);
  if (Tags != null) {
    Tags = Tags.split(",");
    console.log(Tags);
  } // ! ex : s , o , u , p =>[soup]
  console.log(Tags);
  return Tags;
}
/////////////////////////////////////////////////////////////////////
//! Categories
$("#Categories").click(function () {
  $("#Home").html(
    `
    <div id="content" class="my-5 row ms-5 g-4 container w-75 d-flex justify-content-center"></div>
    `
  );
  resetLoading();
  $(document).ready(() => {
    $("#loading").fadeOut(animationDuration, async function () {
      $("body").css("overflow", "visible");
      let cateData = await getCategoriesReady();
      //todo ready to display
      readyToDisplayCate(cateData);
      getMealsAndDisplay();
    });
  });
});

async function getCategoriesReady() {
  let res3 = await fetch(
    `https://www.themealdb.com/api/json/v1/1/categories.php`
  );
  let cateData = await res3.json();
  return cateData;
}
function readyToDisplayCate(cateData) {
  let cateCartona = "";
  for (let i = 0; i < cateData.categories.length; i++) {
    cateCartona += `
    <div class="moveUp col-lg-3 col-md-6 ">
                <div class=" position-relative rounded-4 overflow-hidden">
                    <div
                        class="slideUp bg-light bg-opacity-75 w-100 h-100  position-absolute top-0 start-0 d-flex flex-column justify-content-center align-items-center ">
                        <span class="fs-4 fw-bold mt-1 mb-0 text-center">${cateData.categories[i].strCategory}</span>
                        <p class="fs-6 fw-semibold px-2 editText text-center">${cateData.categories[i].strCategoryDescription}</p>
                        <p class="visually-hidden">${cateData.categories[i].idCategory}</p>
                    </div>
                    <img class="w-100" src="${cateData.categories[i].strCategoryThumb}" alt="">
                </div>
            </div>
    `;
  }
  $("#content").html(cateCartona);
}

function getMealsAndDisplay() {
  $(".moveUp").click(function () {
    let catName = $(this).find("span").text();
    resetLoading();
    $(document).ready(function () {
      $("#loading").fadeOut(animationDuration * 2, async function () {
        let cateData = await getSpecificCategory(catName);
        $("body").css("overflow", "visible");
        displayFilteredCategories(cateData);
        getMealIdPlusGetDetails();
      });
    });
  });
}

async function getSpecificCategory(catName) {
  let res4 = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${catName}`
  );
  let cateData = await res4.json();
  return cateData;
}

function displayFilteredCategories(cateData) {
  let cartona = "";
  let displayed = 0;
    if (cateData.meals.length > 20) {
    numOfDisplay = 20;
  } else {
    numOfDisplay = cateData.meals.length;
  }
  for (let i = 0; i < displayed; i++) {
    cartona += `
    <div class="moveUp col-lg-3 col-md-6 ">
                <div class=" position-relative rounded-4 overflow-hidden">
                    <div
                        class="slideUp bg-light bg-opacity-50 w-100 h-100  position-absolute top-0 start-0 d-flex justify-content-center align-items-center textShadow">
                        <p class="fs-4 px-2 text-center fw-bold ">${cateData.meals[i].strMeal}</p>
                        <span class="visually-hidden">${cateData.meals[i].idMeal}</span>
                    </div>
                    <img class="w-100" src="${cateData.meals[i].strMealThumb}" alt="">
                </div>
            </div>
    `;

    $("#content").html(cartona);
  }
}
///////////////////////////////////////////////////////////////////////////
//! search
async function getSearchedMeals(searchWord) {
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchWord}`
  );
  // console.log(response);
  let searchedMeals = await response.json();
  return searchedMeals;
}

async function getSearchedFirstLetterMeals(firstLetter) {
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${firstLetter}`
  );
  // console.log(response);
  let searchedMeals = await response.json();

  return searchedMeals;
}

$("#Search").click(function () {
  resetLoading();
  $(document).ready(function () {
    $("#loading").fadeOut(animationDuration, async function () {
      $("body").css("overflow", "visible");
      $("#Home").html(
        `
        <div id="searchBox" class="my-5 ms-5 w-75 row d-flex justify-content-between">
            <input type="text" name="" id="searchByName" placeholder="Search By Name..."
                class=" inputs col-md-5 fs-5 py-2 mx-2 bg-black text-center">
            <input type="text" name="" id="searchByFirstLetter" placeholder="Search By First Letter..."
                class="inputs col-md-5 fs-5 py-2 mx-2 bg-black text-center">
        </div>
        <div id="content" class="my-5 row ms-5 g-4 container w-75 d-flex justify-content-center">
        </div>
        `
      );

      $("#searchByName").keyup(async function () {
        let searchWord = this.value;
        let searchedMeals = await getSearchedMeals(searchWord);
        displaySearchedMeals(searchedMeals);
      });

      $("#searchByFirstLetter").keyup(async function () {
        let searchWord = this.value;
        let firstLetter = searchWord.slice(0, 1);
        this.value = firstLetter;
        var searchedMeals = await getSearchedFirstLetterMeals(firstLetter);
        displaySearchedMeals(searchedMeals);
      });

      //!!!! chatGPT helped me here elsara7a
      $("#content").on("click", ".moveUp", function () {
        let mealId = $(this).find("span").text();
        resetLoading();
        $(document).ready(function () {
          $("#loading").fadeOut(animationDuration, function () {
            $("body").css("overflow", "visible");
            getMealDetails(mealId);
          });
        });
      });
    });
  });
});

function displaySearchedMeals(searchedMeals) {
  let container = "";
  let numOfDisplay = 0;
  resetLoading();
  $(document).ready(function () {
    $("#loading").fadeOut(animationDuration * 2, function () {
      $("body").css("overflow", "visible");
      if (searchedMeals.meals == null) {
        $("#content").html(container);
      } else {
        if (searchedMeals.meals.length > 20) {
          numOfDisplay = 20;
        } else {
          numOfDisplay = searchedMeals.meals.length;
        }
        for (let i = 0; i < numOfDisplay; i++) {
          container += `
          <div class="moveUp col-lg-3 col-md-6 ">
                      <div class=" position-relative rounded-4 overflow-hidden">
                          <div
                              class="slideUp bg-light bg-opacity w-100 h-100  position-absolute top-0 start-0 d-flex justify-content-center align-items-center  zIndex1">
                              <span class="visually-hidden">${searchedMeals.meals[i].idMeal}</span>
                          </div>
                          <div
                              class="slideUp bg-light bg-opacity-50 w-100 h-100  position-absolute top-0 start-0 d-flex justify-content-center align-items-center  zIndex">
                              <p class=" fs-4 fw-bold text-center">${searchedMeals.meals[i].strMeal}</p>
                          </div>
                          <img class="w-100" src="${searchedMeals.meals[i].strMealThumb}" alt="">
                      </div>
                  </div>
          `;
          $("#content").html(container);
        }
      }
    });
  });
}
/////////////////////////////////////////////////////////////////////////////////
//! Ingredients 
$("#Ingredients").click(function () {
  $("#Home").html(
    `
    <div id="content" class="my-5 row ms-5 g-4 container w-75 d-flex justify-content-center"></div>
    `
  );
  resetLoading();
  $(document).ready(function () {
    $("#loading").fadeOut(1000, async function () {
      $("body").css("overflow", "visible");

      var ingredientsData = await getIngredients();
      displayIngredients(ingredientsData);
      getMealByIngredientsPlusDisplay();
    });
  });
});

async function getIngredients() {
  var response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
  );
  var ingredientsData = await response.json();
  // console.log(ingredientsData.meals[0].strIngredient);
  return ingredientsData;
}

function displayIngredients(ingredientsData) {
  var container = "";
  // 20 results only
  var numOfDisplay = 0;
  if (ingredientsData.meals.length > 20) {
    numOfDisplay = 20;
  } else {
    numOfDisplay = ingredientsData.meals.length;
  }
  for (var i = 0; i < numOfDisplay; i++) {
    container += `
    <div class="moveUp col-lg-3 col-md-6 ">
                <div class=" position-relative rounded-4 overflow-hidden">
                    <div
                        class="slideUp bg-light bg-opacity-75 w-100 h-100  position-absolute top-0 start-0 d-flex flex-column justify-content-center align-items-center ">
                        <span class="fs-4 fw-bold mt-1 mb-0 text-center">${ingredientsData.meals[i].strIngredient}</span>
                        <p class="fs-6 fw-semibold px-2 editText text-center">${ingredientsData.meals[i].strDescription}</p>
                    </div>
                    <img class="w-100" src="images/ingredient/${ingredientsData.meals[i].strIngredient}.jpg" alt="">
                </div>
            </div>
    `;

    $("#content").html(container);
  }
}

function getMealByIngredientsPlusDisplay() {
  $(".slideUp").click(function () {
    var ingredientsName = $(this).find("span").text();
    // console.log(ingredientsName);
    resetLoading();
    $(document).ready(function () {
      $("#loading").fadeOut(2000, async function () {
        $("body").css("overflow", "visible");
        var mealsByIngredientsData = await getMealsByIngredients(
          ingredientsName
        );
        displayFilterdMealsByIngredients(mealsByIngredientsData);
        // reuse the same function from 1st fun. to display Details
        getMealIdPlusGetDetails();
      });
    });
  });
}

async function getMealsByIngredients(ingredientsName) {
  var response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredientsName}`
  );
  var mealsByIngredientsData = await response.json();
  // console.log(mealsByIngredientsData.meals[0].strMeal);
  return mealsByIngredientsData;
}

function displayFilterdMealsByIngredients(mealsByIngredientsData) {
  var container = "";
  var numOfDisplay = 0;
  if (mealsByIngredientsData.meals.length > 20) {
    numOfDisplay = 20;
  } else {
    numOfDisplay = mealsByIngredientsData.meals.length;
  }
  for (var i = 0; i < numOfDisplay; i++) {
    container += `
    <div class="moveUp col-lg-3 col-md-6 ">
                <div class=" position-relative rounded-4 overflow-hidden">
                    <div
                        class="slideUp bg-light bg-opacity-50 w-100 h-100  position-absolute top-0 start-0 d-flex justify-content-center align-items-center textShadow">
                        <p class="fs-4 px-2 text-center fw-bold ">${mealsByIngredientsData.meals[i].strMeal}</p>
                        <span class="visually-hidden">${mealsByIngredientsData.meals[i].idMeal}</span>
                    </div>
                    <img class="w-100" src="${mealsByIngredientsData.meals[i].strMealThumb}" alt="">
                </div>
            </div>
    `;

    $("#content").html(container);
  }
}
/////////////////////////////////////////////////////////////////
//! Area 
$("#Area").click(function () {
  $("#Home").html(
    `
    <div id="content" class="my-5 row ms-5 g-4 container w-75 d-flex justify-content-center"></div>
    `
  );
  resetLoading();
  $(document).ready(function () {
    $("#loading").fadeOut(1000, async function () {
      $("body").css("overflow", "visible");

      var areaData = await getArea();
      displayAreas(areaData);
      getMealByAreaPlusDisplay();
    });
  });
});

async function getArea() {
  var response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
  );
  var areaData = await response.json();
  // console.log(areaData.meals[0].strArea);
  return areaData;
}

function displayAreas(areaData) {
  var container = "";
  for (var i = 0; i < areaData.meals.length; i++) {
    container += `
    <div class="moveUp col-lg-3 col-md-6 ">
                <div class=" position-relative rounded-4 overflow-hidden">
                    <div
                        class="slideUp bg-light bg-opacity-75 w-100 h-100  position-absolute top-0 start-0 d-flex flex-column justify-content-center align-items-center textShadow">
                        <span class="fs-4 fw-bold mt-1 mb-0">${areaData.meals[i].strArea}</span>
                    </div>
                    <img class="w-100" src="images/${areaData.meals[i].strArea}.jpg" alt="">
                </div>
            </div>
    `;

    $("#content").html(container);
  }
}

async function getMealsByArea(areaName) {
  var response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${areaName}`
  );
  var mealsByAreaData = await response.json();
  // console.log(mealsData.meals[0].idMeal);
  // console.log(mealsData.meals[0].strMeal);
  return mealsByAreaData;
}
function getMealByAreaPlusDisplay() {
  $(".slideUp").click(function () {
    var areaName = $(this).find("span").text();
    // console.log(catName);
    resetLoading();
    $(document).ready(function () {
      $("#loading").fadeOut(2000, async function () {
        $("body").css("overflow", "visible");
        var mealsByAreaData = await getMealsByArea(areaName);
        displayFilterdMealsByArea(mealsByAreaData);
        // reuse the same function from 1st fun. to display Details
        getMealIdPlusGetDetails();
      });
    });
  });
}

function displayFilterdMealsByArea(mealsByAreaData) {
  var container = "";
  for (var i = 0; i < mealsByAreaData.meals.length; i++) {
    container += `
    <div class="moveUp col-lg-3 col-md-6 ">
                <div class=" position-relative rounded-4 overflow-hidden">
                    <div
                        class="slideUp bg-light bg-opacity-50 w-100 h-100  position-absolute top-0 start-0 d-flex justify-content-center align-items-center textShadow">
                        <p class="fs-4 px-2 text-center fw-bold ">${mealsByAreaData.meals[i].strMeal}</p>
                        <span class="visually-hidden">${mealsByAreaData.meals[i].idMeal}</span>
                    </div>
                    <img class="w-100" src="${mealsByAreaData.meals[i].strMealThumb}" alt="">
                </div>
            </div>
    `;

    $("#content").html(container);
  }
}
/////////////////////////////////////////////////////////////////
//! Contact
//* validation 
const nameReg = /^[a-z]{2,30}$/;
const emailReg =
  /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
const phoneReg = /^[0-9]{11,20}$/;
const ageReg = /^(1[0-9]|[2-9]\d)$/;
const passwordReg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/;

function testValidation() {
  const subBtn = document.getElementById("subBtn");
  if (
    nameReg.test($("#iname").val()) &&
    emailReg.test($("#iemail").val()) &&
    phoneReg.test($("#iphone").val()) &&
    ageReg.test($("#iage").val()) &&
    passwordReg.test($("#ipassword").val()) &&
    $("#ipassword").val() == $("#irepassword").val()
  ) {
    subBtn.removeAttribute("disabled");
  } else {
    subBtn.setAttribute("disabled", "");
  }
}
$("#ContactUs").click(function () {
  // to remove search fields in case the user clicke search then contactus directly
  $("#Home").html(
    `
    <div id="content" class="my-5 row ms-5 g-4 container w-75 d-flex justify-content-center"></div>
    `
  );
  resetLoading();
  $(document).ready(function () {
    $("#loading").fadeOut(1000, async function () {
      $("body").css("overflow", "visible");
      $("#content").html(
        `
        <div class="my-5 ms-5 w-75 row d-flex justify-content-between ">
                <div class="title">
                    <p class="text-center fs-2 fw-bold text-light">Contact Us</p>
                </div>
                <div class="col-md-6 mt-2">
                    <input type="text" name="" id="iname" placeholder="Enter Your Name..."
                        class="inputs  fs-6 py-2 mx-2 bg-black text-center form-control ">
                    <div id="alert1" class="alert alert-danger w-100 p-1 mt-3 mb-0 text-center d-none">
                        Special Characters and Numbers not allowed
                    </div>
                </div>

                <div class="col-md-6 mt-2">
                    <input type="email" name="" id="iemail" placeholder="Enter E-mail..."
                        class="inputs  fs-6 py-2 mx-2 bg-black text-center form-control ">
                    <div id="alert2" class="alert alert-danger w-100 p-1 mt-3 mb-0 text-center d-none">
                        Enter valid email. *Ex: xxx@yyy.zzz
                    </div>
                </div>

                <div class="col-md-6 mt-4">
                    <input type="text" name="" id="iphone" placeholder="Enter Phone..."
                        class="inputs  fs-6 py-2 mx-2 bg-black text-center form-control ">
                    <div id="alert3" class="alert alert-danger w-100 p-1 mt-3 mb-0 text-center d-none">
                        Enter valid Phone Number
                    </div>
                </div>

                <div class="col-md-6 mt-4">
                    <input type="text" name="" id="iage" placeholder="Enter Age..."
                        class="inputs  fs-6 py-2 mx-2 bg-black text-center form-control ">
                    <div id="alert4" class="alert alert-danger w-100 p-1 mt-3 mb-0 text-center d-none">
                        Enter valid Age
                    </div>
                </div>

                <div class="col-md-6 mt-4">
                    <input type="text" name="" id="ipassword" placeholder="Enter Password..."
                        class="inputs  fs-6 py-2 mx-2 bg-black text-center form-control ">
                    <div id="alert5" class="alert alert-danger w-100 p-1 mt-3 mb-0 text-center d-none">
                        Enter valid password *Minimum eight characters, at least one letter and one number:*
                    </div>
                </div>

                <div class="col-md-6 mt-4">
                    <input type="text" name="" id="irepassword" placeholder="Enter RePassword..."
                        class="inputs  fs-6 py-2 mx-2 bg-black text-center form-control ">
                    <div id="alert6" class="alert alert-danger w-100 p-1 mt-3 mb-0 text-center d-none">
                        Enter valid Repassword
                    </div>
                </div>

                <div class="col-12 mt-4 d-flex justify-content-center">
                    <button id="subBtn" disabled class="btn btn-outline-danger">Submit</button>
                </div>
        `
      );
      //*validation Test
      $("#iname").keyup(function () {
        // console.log($("#iname").val());
        if (nameReg.test($("#iname").val())) {
          $("#alert1").addClass("d-none");
          $("#iname").removeClass("is-invalid");
          $("#iname").addClass("is-valid");
        } else {
          $("#alert1").removeClass("d-none");
          $("#iname").addClass("is-valid");
          $("#iname").addClass("is-invalid");
        }
        testValidation();
      });

      $("#iemail").keyup(function () {
        if (emailReg.test($("#iemail").val())) {
          $("#alert2").addClass("d-none");
          $("#iemail").removeClass("is-invalid");
          $("#iemail").addClass("is-valid");
        } else {
          $("#alert2").removeClass("d-none");
          $("#iemail").addClass("is-valid");
          $("#iemail").addClass("is-invalid");
        }
        testValidation();
      });

      $("#iphone").keyup(function () {
        if (phoneReg.test($("#iphone").val())) {
          $("#alert3").addClass("d-none");
          $("#iphone").removeClass("is-invalid");
          $("#iphone").addClass("is-valid");
        } else {
          $("#alert3").removeClass("d-none");
          $("#iphone").addClass("is-valid");
          $("#iphone").addClass("is-invalid");
        }
        testValidation();
      });

      $("#iage").keyup(function () {
        if (ageReg.test($("#iage").val())) {
          $("#alert4").addClass("d-none");
          $("#iage").removeClass("is-invalid");
          $("#iage").addClass("is-valid");
        } else {
          $("#alert4").removeClass("d-none");
          $("#iage").addClass("is-valid");
          $("#iage").addClass("is-invalid");
        }
        testValidation();
      });

      $("#ipassword").keyup(function () {
        if (passwordReg.test($("#ipassword").val())) {
          $("#alert5").addClass("d-none");
          $("#ipassword").removeClass("is-invalid");
          $("#ipassword").addClass("is-valid");
        } else {
          $("#alert5").removeClass("d-none");
          $("#ipassword").addClass("is-valid");
          $("#ipassword").addClass("is-invalid");
        }
        testValidation();
      });

      $("#irepassword").keyup(function () {
        if ($("#ipassword").val() == $("#irepassword").val()) {
          $("#alert6").addClass("d-none");
          $("#irepassword").removeClass("is-invalid");
          $("#irepassword").addClass("is-valid");
        } else {
          $("#alert6").removeClass("d-none");
          $("#irepassword").addClass("is-valid");
          $("#irepassword").addClass("is-invalid");
        }
        testValidation();
      });
    });
  });
});
