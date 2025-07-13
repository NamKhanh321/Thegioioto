"use client"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

export default function SearchForm(){
    return (
        <form className="flex items-center justify-center sm:justify-start">
            <input type="text" placeholder="Từ khóa" className="grow max-w-1/3 min-w-40 px-3 py-2 h-8 focus:outline-none focus:border-blue-400"></input>
            <button type="submit" className="p-2 bg-blue-500 text-white hover:bg-blue-600 transition-transform duration-200 hover:scale-110"><FontAwesomeIcon icon={faSearch}/></button>
        </form>
    )
}