import React, { useCallback, useState } from "react";

const Search = ({ id, sendSearched, placeholder, list }) => {
    const [searched, setSearched] = useState('')

    const handleSearch = (e) => {
        setSearched(e.target.value)
        sendSearched(e.target.value)
    }

    return <>
        <input
            onChange={handleSearch}
            id={id === undefined ? null : id}
            list={placeholder}
            placeholder={placeholder}
            type="text"
            value={searched}
        />
        <datalist id={placeholder}>
            {list.sort((a, b) => a > b ? 1 : -1).map((i, index) =>
                <option key={index}>{i}</option>
            )}
        </datalist>
        <button
            value={''}
            onClick={handleSearch}
            className="clear"
            type="reset"
        >
            Clear
        </button>
    </>
}

export default Search;