'use client'

import { useCallback, useState, useEffect, useRef } from "react";
import { useSearchParams } from 'next/navigation'
import { useTranslations } from "next-intl";
import { useRouter } from '@/src/i18n/navigation'

const SearchBarModule = () => {
    const t = useTranslations("searchPage");
    const router = useRouter()
    const searchParams = useSearchParams()
    
    const query = searchParams.get('key') || '';
    const [search, setSearch] = useState(query);
    const inputRef = useRef(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const createQueryString = useCallback(
        (name, value) => {
            const params = new URLSearchParams(searchParams)
            const normalizedValue = value.trim()

            if (normalizedValue) {
                params.set(name, normalizedValue)
            } else {
                params.delete(name)
            }
        
            return params.toString()
        },
        [searchParams]
    )

    const searchChangeHandler = event => {
        setSearch(event.target.value);
    };

    const searchPressHandler = event => {
        if (event.key === 'Enter' || event.keyCode === 13) {
            const queryString = createQueryString('key', search)
            router.push(queryString ? `/search?${queryString}` : "/search")
        }
    };

    const handleSubmit = () => {
        const queryString = createQueryString('key', search)
        router.push(queryString ? `/search?${queryString}` : "/search")
    };

    return (
        <div className="tst-group-input tst-group-with-btn">
            <input 
                ref={inputRef}
                type="text"
                value={search}
                onChange={searchChangeHandler}
                onKeyDown={searchPressHandler}
                required
                id="searchField"
                placeholder={t("inputPlaceholder")}
            />
            <button 
                onClick={handleSubmit}
                aria-label={t("submitLabel")}
            >
                <i className="fas fa-search"></i>
            </button>
        </div>
    )
}
export default SearchBarModule;