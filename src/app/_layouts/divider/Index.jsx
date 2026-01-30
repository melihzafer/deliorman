// Server Component - pure UI with no interactivity

const DividerModule = ( { onlyBottom = 1 } ) => {
    return (
        /* divider */
        <div className={onlyBottom ? "tst-spacer tst-spacer-only-bottom-space" : "tst-spacer"}></div>
        /* divider end */
    );
};

export default DividerModule;