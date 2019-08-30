const router = require("express-promise-router")();
const BcController = require("../controllers/bcController");
const axios = require("axios");
const BigCommerce = require("node-bigcommerce");
const db = require("../models/index");
const site = db.Site;

router.get("/auth/:hashCode", BcController.auth);
router.get("/load/:clientId",
  async (req, res, next) => {
    try {
      //Middleware
      const clientId = req.params.clientId;
      const host = `${req.headers["x-forwarded-proto"]}://${req.headers.host}`;
      //Get the client by id.
      let client = await axios.get(`${host}/api/client/${clientId}`);
      //Set client specific parameters.
      client = client.data.rows[0];
      const bcSetting = {
        logLevel: "info",
        responseType: "json",
        clientId: client.bcClientId,
        secret: client.bcClientSecret
      };
      // Create BigCommerce object
      const bigCommerce = new BigCommerce(bcSetting);
      // BigCommerce Verification
      const data = bigCommerce.verify(req.query["signed_payload"]);
      //Store hash
      const storeHash = data.store_hash;
      //Get the site id by store hash
      const clientSite = await site.findOne({
        where: {
          client_id: req.params.clientId,
          store_hash: storeHash
        }
      });

      req.session.site_id = clientSite.id;
      req.session.store_hash = storeHash;
    } catch (error) {
      console.log(error);
      next(error);
    }

    next();
  },
  BcController.load
);

module.exports = router;