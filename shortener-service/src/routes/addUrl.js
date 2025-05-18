import 'dotenv/config';
import URL from 'url';
const DOMAIN = process.env.GATEWAY_DOMAIN || 'http://localhost:3000';

const isTLS = (url) => {
    const endpoint = URL.parse(url);
    const protocol = endpoint.protocol;
    return protocol === 'https:' || protocol === 'wss:';
};
const isMaliciousUrl = (url) => false;

const isValidUrl = (url) => isTLS(url) && !isMaliciousUrl(url)

const generateGloballyUniqueShortId = (machine_number, getNextLocalNumber) => {
    return Buffer.from(`${machine_number}_${getNextLocalNumber()}`).toString('base64url');
}

export const add_url = ({
    database,
    machine_number,
    getNextLocalNumber
}) => async(req, res) => {
    const { url } = req.body;
    if(isValidUrl(url)){
        const existingShortUrl = await database.get(url);
        console.log(existingShortUrl);
        if(existingShortUrl){
            res.send({
                shortUrl: existingShortUrl
            });
            return;
        }
        const shortId = generateGloballyUniqueShortId(machine_number, getNextLocalNumber);
        const shortUrl = `${DOMAIN}/api/urls/${shortId}`;
        await Promise.all([
            database.add(shortId, url),
            database.add(url, shortUrl),
        ]);
        res.send({
            shortUrl: shortUrl
        });
        return;
    }
    res.send({
        message: "Invalid Url - Try with a different url"
    });
}