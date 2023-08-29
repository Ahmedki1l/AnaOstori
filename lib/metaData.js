
const MetaData = (props) => {
    const router = props.router

    const defaultMetaTags = {
        title: 'Default Title',
        description: 'Default Description',
        keywords: 'Default Keywords',
    };

    const metaTagsByRoute = {
        '/': {
            title: 'Home Page',
            description: 'This is the home page of our website.',
            keywords: 'home, website, Next.js',
        },
        '/myProfile': {
            title: 'About Us',
            description: 'Learn more about our company.',
            keywords: 'about us, company, information',
        },
        '/tearms': {
            title: 'Contact Us',
            description: 'Get in touch with us.',
            keywords: 'contact, reach out, support',
        },
    };

    const currentRoute = router.pathname;
    const metaTags = metaTagsByRoute[currentRoute] || defaultMetaTags;

    return (
        <>
            {/* <title>{`${pageTitle} | أنا أسطوري`}</title>
            <link rel="icon" href="/favicon.png" className='rounded-full' /> */}
            <meta name="description" content={metaTags.description} />
            <meta name="keywords" content={metaTags.keywords} />
            <meta property="og:title" content={metaTags.title}></meta>
            <meta property="og:description" content={metaTags.description} />
            <meta property="og:url" content={`https://anaostori.com${router.asPath}`}></meta>
            <meta property="og:type" content={`https://anaostori.com}`}></meta>
            {/* <meta property="og:image" content={`https://${}`} /> */}
        </>
    )
}
export default MetaData