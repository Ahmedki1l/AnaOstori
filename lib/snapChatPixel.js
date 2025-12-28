import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const SnapchatPixel = () => {
    const storeData = useSelector((state) => state?.globalStore);

    useEffect(() => {
        // Your Snapchat Pixel code

        (function (e, t, n) {
            if (e.snaptr) return; var a = e.snaptr = function () { a.handleRequest ? a.handleRequest.apply(a, arguments) : a.queue.push(arguments) };
            a.queue = []; var s = 'script'; r = t.createElement(s); r.async = !0;
            r.src = n; var u = t.getElementsByTagName(s)[0]; u.parentNode.insertBefore(r, u);
        })(window, document, 'https://sc-static.net/scevent.min.js');

        window.snaptr('init', '662c5563-9431-4706-a60f-0a6aa3d3d111', {
            'user_email': `${storeData.viewProfileData.email || '_INSERT_USER_EMAIL_'}`
        });
        window.snaptr('track', 'PAGE_VIEW');


        return () => {
            window.snaptr('remove');
        };
    }, [storeData.viewProfileData]);

    return null;
};

export default SnapchatPixel;