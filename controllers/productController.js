const BigCommerce = require("node-bigcommerce");
const crypto = require("crypto");
const db = require("../models/index");
const site = db.Site;
const client = db.Client;

module.exports = {
  findByCategoryId: async (req, res, next) => {
    const storeHash = req.params.storehash;
    //Get the site info
    const siteInfo = await site.findOne({
      where: {
        store_hash: storeHash
      }
    });

    //console.log(siteInfo.site_info);
    const decoded = Buffer.from(siteInfo.site_info, "base64").toString();
    const objx = JSON.parse(decoded);

    //Getting the access token from the site.
    const accessToken = objx.access_token;

    const clientInfo = await client.findOne({
      where: {
        id: siteInfo.client_id
      }
    });
    //Getting the Client id from the Client.
    const clientId = clientInfo.bcClientId;
    //Big commerce API
    const bigCommerce = new BigCommerce({
      clientId: clientId,
      accessToken: accessToken,
      storeHash: storeHash,
      responseType: "json",
      apiVersion: "v3"
    });
    const categoryId = escape(req.params.id);
    const limit = typeof req.params.limit !== "undefined" && req.params.limit !== null ? req.params.limit : 6;

    //Getting the category By ID
    bigCommerce
      .get(`/catalog/products/?limit=${limit}&categories:in=${categoryId}&include=images,primary_image,custom_fields`)
      .then(data => { res.json(data); })
      .catch(err => { res.json(err); });
  }
};