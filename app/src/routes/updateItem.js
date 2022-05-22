const db = require('../persistence');

module.exports = async (req, res) => {
    await db.updateItem(req.params.id, {
        name: req.body.name,
        completed: req.body.completed,
        date: req.body.date,
        wind_direction: req.body.wind_direction,
        atmospheric_pressure: req.body.atmospheric_pressure,
        atmospheric_trend: req.body.atmospheric_trend,
        incoming_rain_cloud: req.body.incoming_rain_cloud,
        area: req.body.area,
    });
    const item = await db.getItem(req.params.id);
    res.send(item);
};
