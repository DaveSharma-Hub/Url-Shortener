export const get_url= ({
    database
}) => async(req, res) => {
    const {shortUrl} = req.params;
    const longUrl = await database.get(shortUrl);
    res.send({
        longUrl: longUrl
    });
}