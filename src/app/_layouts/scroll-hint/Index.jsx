"use client";

const ScrollHintModule = () => {
    const scrollToSection = (e) => {
        let topEl = document.querySelector('#tst-dynamic-content');
        let topPos = topEl.offsetTop - 140;

        window.scrollTo({top: topPos, behavior: 'smooth'});
        e.preventDefault();
    }
    return (
        <>
            {/* scroll hint */}
            <div className="container">
                <a href="#tst-dynamic-content" className="tst-scroll-hint-frame tst-anchor-scroll" onClick={ (e) => scrollToSection(e) }>
                    <div className="tst-scroll-hint"></div>
                </a>
            </div>
            {/* scroll hint end */}
        </>
    );
};

export default ScrollHintModule;