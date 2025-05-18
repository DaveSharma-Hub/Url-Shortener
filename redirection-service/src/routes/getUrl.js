export const get_url= ({
    database
}) => async(req, res) => {
    const {shortId} = req.params;
    const longUrl = await database.get(shortId);
    res.send({
        longUrl: longUrl
    });
}