import React from "react";
import { Link } from "react-router-dom";
import { Book } from "lucide-react";
import { GiWhiteBook } from "react-icons/gi";


const CategoryContainer = (props) => {
  return (
    <div className="flex flex-col items-center justify-center p-1">
      <Link
        to={`/category/${props.category.title}/${props.category.id}`}
        className="flex items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-500 p-4 
        transition-all duration-300 ease-in-out 
        hover:ring-2 hover:ring-gray-800 
        hover:shadow-lg
        hover:brightness-110
        group"
      >
        <GiWhiteBook className="h-10 w-10 text-white transition-transform duration-300 group-hover:scale-125" />
      </Link>
      <h5 className="text-sm text-gray-800 font-bold mt-2">
        {props.category.title}
      </h5>
    </div>
  );
};

export { CategoryContainer };