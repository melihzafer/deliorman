'use client'

import { useCallback, useState } from "react";
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'

const SearchBarModule = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    
    const query = searchParams.get('key') || '';

    const [search, setSearch] = useState(query);

    const createQueryString = useCallback(
        (name, value) => {
            const params = new URLSearchParams(searchParams)
            params.set(name, value)
        
            return params.toString()
        },
        [searchParams]
    )

    const searchChangeHandler = event => {
        setSearch(event.target.value);
    };

    const searchPressHandler = event => {
        if (event.key === 'Enter' || event.keyCode === 13) {
            router.push("/search" + '?' + createQueryString('key', search))
        }
    };

    return (
        <div className="tst-group-input tst-group-with-btn">
            <input 
                type="text"
                value={search}
                onChange={searchChangeHandler}
                onKeyDown={searchPressHandler}
                required
                id="searchField"
                placeholder="Какво търсите?"
            />
            <button 
                onClick={() => {
                    router.push("/search" + '?' + createQueryString('key', search))
                }}
            >
                <img src="/img/ui/icons/search.svg" alt="search" />
            </button>
        </div>
    )
}
export default SearchBarModule;