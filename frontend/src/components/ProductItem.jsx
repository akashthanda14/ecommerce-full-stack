import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom';

const ProductItem = ({ id, image, name, price }) => {
  //  console.log('ProductItem props:', { id, image, name, price });



  const { currency } = useContext(ShopContext);

  return (
    <Link to={`/product/${id}`} onClick={() => window.scrollTo(0, 0)} className='text-gray-700 cursor-pointer'>

<div className="overflow-hidden w-56 h-64 flex items-center justify-center"> {/* Increased height */}
    <img
      className="hover:scale-105 transition ease-in-out w-full h-full object-cover"
      src={image[0]}
      alt=""
    />
  </div>

      <p className='pt-3 pb-1 text-sm'>{name}</p>
      <p className='text-sm font-medium'>{currency}{price}</p>
      
    </Link>
  )
}

export default ProductItem
