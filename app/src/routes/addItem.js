const db = require('../persistence');
const uuid = require('uuid/v4');

module.exports = async (req, res) => {
    const item = {
        id: uuid(),
        name: req.body.name,
        completed: false,
        date: req.body.date,
        wind_direction: req.body.wind_direction,
        atmospheric_pressure: req.body.atmospheric_pressure,
        atmospheric_trend: req.body.atmospheric_trend,
        incoming_rain_cloud: req.body.incoming_rain_cloud,
        area: req.body.area,
    };

    await db.storeItem(item);
    res.send(item);
};
