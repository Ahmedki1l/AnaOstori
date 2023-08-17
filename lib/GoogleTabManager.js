import { useEffect } from 'react';
import TagManager from 'react-gtm-module';

const GoogleTabManager = ({ pathName }) => {
    useEffect(() => {
        TagManager.initialize({ gtmId: 'G-DXRRV0FNGE' });
    }, []);

    return null;
};

export default GoogleTabManager;