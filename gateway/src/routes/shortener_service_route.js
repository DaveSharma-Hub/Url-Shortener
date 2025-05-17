import axios from "axios";

const SHORTENER_SERVICE_ENDPOINT =
  process.env.SHORTENER_SERVICE_ENDPOINT || "http://localhost:5000";


export const shortener_service_route = async(req, res) => {
    const {path} = req;
    const endpoint = `${SHORTENER_SERVICE_ENDPOINT}${path}`;
    const output = await axios.post(endpoint, req.body);
    res.send(output.data);
}