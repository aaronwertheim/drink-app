import { useEffect, useState, useContext } from "react";
import {DrinksContext} from './Contexts/DrinksContext';

function Home() {

    
    const [searchQuery, setSearchQuery] = useState("");
    const [showDetails, setShowDetails] = useState([]);
    const [favoritesIds, setFavoritesIds] = useState([]);
    const { drinks, setDrinks } = useContext(DrinksContext);

    useEffect(() => {
      fetch('https://favorite-drinks.herokuapp.com/favorites')
      .then(r => r.json())
      .then(favoritesArr => setFavoritesIds(favoritesArr.map(fav => fav.idDrink)))
    },[])

    function handleSubmit(e){
        e.preventDefault();
        fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=' + searchQuery)
        .then(r => r.json())
        .then(drinksArray => setDrinks(drinksArray.drinks))
        setSearchQuery("");
        setShowDetails([]);
    }

    function getRandom(e){
      e.stopPropagation();
      fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php')
      .then(r => r.json())
      .then(d => {
        setDrinks(d.drinks)
        setShowDetails(d.drinks[0])
      })
    }

    function addToFavorites(drinkToAdd){
      if(favoritesIds.includes(drinkToAdd.idDrink)) return alert("This drink is already in your favorites.")
      fetch('https://favorite-drinks.herokuapp.com/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(drinkToAdd),
        })
          .then(() => {
            fetch('https://favorite-drinks.herokuapp.com/favorites')
            .then(r => r.json())
            .then(favoritesArr => setFavoritesIds(favoritesArr.map(fav => fav.idDrink)))
          })
    }

    return (
      <>
        <main>
          <form  onSubmit={handleSubmit}>
            <div class="flex flex-col md:flex-row items-center justify-start px-10 py-6 bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-500" >
              <div class="flex bg-gray-100 p-4 w-72 space-x-4 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input type="text" class="bg-gray-100 outline-none" placeholder="Drink name or keyword..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
              </div>  
              <div class="bg-gray-800 w-72 lg:w-fit py-3 px-5 m-1.5 text-white text-center font-semibold rounded-lg hover:shadow-lg hover:text-gray-400 transition duration-3000 cursor-pointer">
                <button>Search</button>
              </div>
              <div class="bg-gray-800 w-72 py-3 lg:w-fit px-5 text-white text-center font-semibold rounded-lg hover:shadow-lg hover:text-gray-400 transition duration-3000 cursor-pointer">
                <span onClick={getRandom}>Random</span>
              </div>
            </div>
          </form>
          <div class="flex my-5">
            <ul class=" mx-2 mt-2 lg:w-1/5">
              {drinks?.map((drink, index) => (
                <li class="bg-gray-200 border rounded-lg border-gray-800 mb-5 p-1 flex flex-col shadow-md" key={index}>
                  <div class="font-bold">{drink.strDrink}</div>
                  <div class="cursor-pointer underline hover:bg-white" onClick={() => showDetails === drink ? setShowDetails([]) : setShowDetails(drink)}>{showDetails === drink? "Hide Details" : "Details"}</div>
                  <div class="cursor-pointer hover:bg-white" onClick={() => addToFavorites(drink)}><span class="underline">Add to Favorites</span> <span class=" ">{ favoritesIds.includes(drink.idDrink) ? "✔️" : ""}</span> </div>
                </li>   
              ))}
            </ul>
            <div class="mr-2 w-2/3">
              <h2 class="text-2xl text-center underline font-bold">{showDetails.strDrink}</h2>
              <img src={showDetails.strDrinkThumb} alt="" class=" rounded-lg my-5 mx-auto shadow-2xl"/>
              <div class="flex flex-col md:flex-row lg:w-3/5 mx-auto">
                <table class="shadow-xl bg-gray-200">
                  <tr class="border border-gray-800">
                    <td class="border border-gray-800 empty:hidden p-1">{showDetails.strIngredient1}</td>
                    <td class="empty:hidden p-1">{showDetails.strMeasure1}</td>
                  </tr>
                  <tr class="border border-gray-800 ">
                    <td class="border border-gray-800 empty:hidden p-1">{showDetails.strIngredient2}</td>
                    <td class="empty:hidden p-1">{showDetails.strMeasure2}</td>
                  </tr>
                  <tr class="border border-gray-800">
                    <td class="border border-gray-800 empty:hidden p-1">{showDetails.strIngredient3}</td>
                    <td class="empty:hidden p-1">{showDetails.strMeasure3}</td>
                  </tr>
                  <tr class="border border-gray-800">
                    <td class="border border-gray-800 empty:hidden p-1">{showDetails.strIngredient4}</td>
                    <td class="empty:hidden p-1">{showDetails.strMeasure4}</td>
                  </tr>
                  <tr class="border border-gray-800">
                    <td class="border border-gray-800 empty:hidden p-1">{showDetails.strIngredient5}</td>
                    <td class="empty:hidden p-1">{showDetails.strMeasure5}</td>
                  </tr>
                  <tr class="border border-gray-800  ">
                    <td class="border border-gray-800 empty:hidden p-1">{showDetails.strIngredient6}</td>
                    <td class="empty:hidden p-1">{showDetails.strMeasure6}</td>
                  </tr>
                  <tr class="border border-gray-800">
                    <td class="border border-gray-800 empty:hidden p-1">{showDetails.strIngredient7}</td>
                    <td class="empty:hidden p-1">{showDetails.strMeasure7}</td>
                  </tr>
                </table>
                <p class="text-justify font-bold lg:w-2/3 mx-auto my-auto p-2 rounded-sm ">{showDetails.strInstructions}</p>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  export default Home;