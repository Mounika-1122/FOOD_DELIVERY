import React, { useContext } from 'react';
import './FoodDisplay.css';
import { StoreContext } from '../../context/StoreContext';
import FoodItem from '../FoodItem/FoodItem';

const FoodDisplay = ({ category }) => {
  const { food_list } = useContext(StoreContext);

  // Normalize all item categories
  const normalizedFoodList = food_list.map(item => ({
    ...item,
    category: item.category
  }));
console.log(normalizedFoodList);

  const filteredFood = normalizedFoodList.filter(
    (item) =>
      category === "All" || category === item.category
  );

  return (
    <div className="food-display" id="food-display">
      <h2>Top dishes near you</h2>
      <div className="food-display-list">
        {filteredFood.length > 0 ? (
          filteredFood.map((item) => (
            <FoodItem
              key={item._id}
              id={item._id}
              name={item.name}
              description={item.description}
              price={item.price}
              image={item.image}
            />
          ))
        ) : (
          <p style={{ padding: "1rem" }}>No items in this category.</p>
        )}
      </div>
    </div>
  );
};

export default FoodDisplay;
