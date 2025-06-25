"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from 'next/navigation';

import { OnePageMenu } from '@common/onepageMenu';

import AppData from "@data/app.json";
import CartData from "@data/cart.json";

import MiniCart from "@layouts/cart/MiniCart";
import ReservationForm from "@components/forms/ReservationForm";

const DefaultHeader = () => {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(false);
  const [miniCart, setMiniCart] = useState(false);
  const [reservationPopup, setReservationPopup] = useState(false);
  const asPath = usePathname();

  const isPathActive = (path) => {
    return (asPath.endsWith(path) == 1 && path !== '/') || asPath === path;
  };

  const handleSubMenuClick = (index, e) => {
    if ( window !== undefined ) {
        if ( window.innerWidth <= 992 ) {
            e.preventDefault();
            setOpenSubMenu(openSubMenu === index ? false : index);
        }
    }
  };

  useEffect(() => {
    // close mobile menu
    setMobileMenu(false);
    setMiniCart(false);
    setReservationPopup(false);
    setOpenSubMenu(false);
  }, [asPath]);

  useEffect(() => {
    if ( isPathActive("onepage") ) {
        OnePageMenu();
    }
  }, []);

  return (
    <>
        {/* top bar frame */}
        <div className="tst-menu-frame">
            {/* top bar */}
            <div className="tst-dynamic-menu" id="tst-dynamic-menu">
                <div className="tst-menu">
                {/* logo */}
                <Link href="/">
                    <img src={AppData.header.logo.image} className="tst-logo" alt={AppData.header.logo.alt} />
                </Link>
                {/* menu */}
                <nav className={`${mobileMenu ? "tst-active" : ""}`}>
                    {isPathActive("onepage") ? (
                    <ul>
                        {AppData.header.onepage.map((item, index) => (
                        <li key={`header-menu-onepage-item-${index}`} className={index == 0 ? "current-menu-item": ""}><a data-no-swup href={item.link}>{item.label}</a></li>
                        ))}
                    </ul>
                    ) : (
                    <ul>
                        {AppData.header.menu.map((item, index) => (
                        <li className={`${item.children !== 0 ? "menu-item-has-children" : ""} ${isPathActive(item.link) ? "current-menu-item" : ""}`} key={`header-menu-item-${index}`}>
                            <Link href={item.link} onClick={(item.children.length > 0)  ? (e) => handleSubMenuClick(index, e) : null}>
                                {item.label}
                            </Link>
                            {item.children.length > 0 && (
                            <ul className={openSubMenu === index ? 'tst-active' : ''}>
                                {item.children.map((subitem, subIndex) => (
                                <li key={`header-submenu-item-${subIndex}`} className={isPathActive(subitem.link) ? "tst-active" : ""}>
                                    {subitem.link == '/onepage' ? (
                                    <a href={subitem.link} target="_blank">
                                        {subitem.label}
                                    </a>
                                    ) : (
                                    <Link href={subitem.link}>
                                        {subitem.label}
                                    </Link>
                                    )}
                                </li>
                                ))}
                            </ul>
                            )}
                        </li>
                        ))}
                    </ul>
                    )}
                </nav>
                {/* menu end */}
                {/* top bar right */}
                <div className="tst-menu-right">
                    {/* reservation button */}
                    {/* <a href="#." className={`tst-btn tst-res-btn ${reservationPopup ? "tst-active" : "" }`} onClick={(e) => { setReservationPopup(!reservationPopup); e.preventDefault(); }} data-no-swup>Reservation</a>
                    <div className="tst-minicart"> */}
                    {/* minicart button */}
                    {/* <a href="#." className={`tst-cart ${miniCart ? "tst-active" : ""}`} onClick={(e) => { setMiniCart(!miniCart); e.preventDefault(); }}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
                        <path
                            d="M87.7,33.1l-0.8-10.8C86,10.4,76,1,64,1s-22.1,9.4-22.9,21.3l-0.8,10.8H28.8c-4.7,0-8.6,3.7-9,8.4l-5.4,75.9c0,0,0,0,0,0 c-0.2,2.5,0.7,5,2.4,6.8s4.1,2.9,6.6,2.9h81.3c2.5,0,4.9-1,6.6-2.9c1.7-1.8,2.6-4.3,2.4-6.8l-5.4-75.2c-0.4-5.1-4.6-9-9.7-9H87.7z M47.1,22.7C47.7,13.9,55.1,7,64,7s16.3,6.9,16.9,15.7l0.7,10.4H46.3L47.1,22.7z M102.3,42.6l5.4,75.2c0.1,0.8-0.2,1.6-0.8,2.3 c-0.6,0.6-1.4,1-2.2,1H23.4c-0.8,0-1.6-0.3-2.2-1s-0.9-1.4-0.8-2.3h0l5.4-75.9c0.1-1.6,1.4-2.8,3-2.8h11.1l-0.6,8 c-0.1,1.7,1.1,3.1,2.8,3.2c0.1,0,0.1,0,0.2,0c1.6,0,2.9-1.2,3-2.8l0.6-8.4h36.2l0.6,8.4c0.1,1.7,1.5,2.9,3.2,2.8 c1.7-0.1,2.9-1.5,2.8-3.2l-0.6-8h10.5C100.5,39.1,102.1,40.6,102.3,42.6z" />
                        </svg>
                        <div className="tst-cart-number">{CartData.total}</div>
                    </a> */}
                    {/* minicart button end */}
                    {/* minicart */}
                    {/*  <div className={`tst-minicart-window ${miniCart ? "tst-active" : "" }`}>
                        <MiniCart />
                    </div>
                    </div> */}
                    {/* minicart end */}
                    {/* menu button */}
                    <div className="tst-menu-button-frame">
                        <div className={`tst-menu-btn ${mobileMenu ? "tst-active" : ""}`} onClick={() => setMobileMenu(!mobileMenu)}>
                            <div className="tst-burger">
                                <span></span>
                            </div>
                        </div>
                    </div>
                    {/* menu button end */}
                </div>
                {/* top bar right end  */}
                </div>
            </div>
            {/* top bar end */}
        </div>
        {/* top bar frame */}

        {/* popup */}
        <div className={`tst-popup-bg ${reservationPopup ? "tst-active" : "" }`}>
            <div className="tst-popup-frame">
                <div className="tst-popup-body">
                    <div className="tst-close-popup" onClick={() => setReservationPopup(!reservationPopup)}><i className="fas fa-times"></i></div>

                    {/* title */}
                    <div className="text-center">
                        <div className="tst-suptitle tst-suptitle-center"></div>
                        <h4 className="tst-mb-60">Table Reservation</h4>
                    </div>
                    {/* title end */}
                    
                    <ReservationForm />
                </div>
            </div>
        </div>
        {/* popup end */}
    </>
  );
};
export default DefaultHeader;
