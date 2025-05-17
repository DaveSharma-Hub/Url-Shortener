import 'dotenv/config';
import { v4 as uuid } from 'uuid';
const DOMAIN = process.env.GATEWAY_DOMAIN || 'http://localhost:3000';
const MACHINE_ID = process.env.MACHINE_ID;

const isHttps = (url) => true;
const isMaliciousUrl = (url) => false;

const isValidUrl = (url) => isHttps(url) && !isMaliciousUrl(url)

const generateGloballyUniqueShortId = () => {
    return Buffer.from(uuid().replace('-', '')).toString('base64url');
}

export const add_url = ({
    database
}) => async(req, res) => {
    const { url } = req.body;
    if(isValidUrl(url)){
        const shortId = generateGloballyUniqueShortId();
        await database.add(shortId, url);
        const shortUrl = `${DOMAIN}/api/urls/${shortId}`;
        res.send({
            shortUrl: shortUrl
        });
        return;
    }
    res.send({
        message: "Invalid Url - Try with a different url"
    });
}