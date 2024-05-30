import React from "react";
import PropTypes from "prop-types";
import { FaCashRegister } from "react-icons/fa";

const Product = ({ product, addToCart }) => {
  const [quantity, setQuantity] = React.useState(1);

  const handleQuantityChange = (e) => {
    setQuantity(Number(e.target.value));
  };

  return (
    <div className="p-4 bg-[#242424] rounded shadow-lg flex flex-col items-center justify-center space-y-2">
      <h3 className="text-lg text-white font-bold">{product.name}</h3>
      <p className="text-white">${product.price}</p>
      <button
        className="px-4 py-2 text-white font-bold cursor-pointer"
        onClick={() => addToCart(product.id, false)}
      >
        <img
          src={product.image}
          className="w-24 h-24 object-cover transition-transform duration-300 ease-in-out transform hover:scale-110 active:scale-90"
          alt={product.name}
        />
      </button>

      <div className="flex space-x-2">
        <input
          type="number"
          value={quantity}
          min="1"
          onChange={handleQuantityChange}
          className="mb-2 w-16 h-full bg-[#424242] text-white text-center border rounded"
        />
        <button
          className="px-4 py-2 bg-blue-700 text-white font-bold rounded hover:bg-blue-800 cursor-pointer  transition-transform duration-300 ease-in-out transform hover:scale-110 active:scale-90"
          onClick={() => addToCart(product.id, true, quantity)}
        >
          <FaCashRegister />
        </button>
      </div>
    </div>
  );
};

Product.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
  addToCart: PropTypes.func.isRequired,
};

export default Product;
