import axios from "axios";

const REDIRECTION_SERVICE_ENDPOINT =
  process.env.REDIRECTION_SERVICE_ENDPOINT || "http://localhost:4000";

export const redirection_service_route = async (req, res) => {
    const {path} = req;
    const endpoint = `${REDIRECTION_SERVICE_ENDPOINT}${path}`;
    const output = await axios.get(endpoint);
    const {longUrl} = output.data;
    console.log(longUrl);
    res.redirect(longUrl);
};
