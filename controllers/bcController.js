const env = process.env.NODE_ENV || "development";
const BigCommerce = require("node-bigcommerce");
const axios = require("axios");
const crypto = require("crypto");
const db = require("../models/index");
const site = db.Site;
const bcSetting = {
  logLevel: "info",
  callback: process.env.BC_CALLBACK,
  responseType: "json"
};

//Get user by hash code.
const getClient = async (host, hashCode) => {
  try {
    const path = `${host}/api/client/get-by-hash/${hashCode}`;
    const client = await axios.get(path);
    if (client.data.count === 1) {
      //Client exist
      return client.data.rows[0];
    } else {
      //Client does not exist
      return false;
    }
  } catch (error) {
    //error
    console.log(error);
    return false;
  }
};

const appOptions = {
  root: __dirname + "/../public/"
};

const options = {
  root: __dirname + "/../client/build"
};

//auth
const auth = async (req, res, next) => {
  const host = `${req.headers["x-forwarded-proto"]}://${req.headers.host}`;
  //get the client
  const client = await getClient(host, req.params.hashCode);
  if (client) {
    //Set client specific parameters.
    bcSetting.clientId = client.bcClientId;
    bcSetting.secret = client.bcClientSecret;
    bcSetting.callback = `${host}/bc/auth/${req.params.hashCode}`;
  }
  try {
    // Create BigCommerce object
    const bigCommerce = new BigCommerce(bcSetting);
    // BigCommerce authorize
    const data = await bigCommerce.authorize(req.query);
    //Getting the store hash
    const storehash = data.context.split("/")[1];

    //Find of create site.
    const [clientSite, created] = await site.findOrCreate({
      where: {
        client_id: client.id,
        store_hash: storehash
      }
    });
    //Save store information as a encoded string - Start
    //Add salt
    const salt = process.env.SECRET_KEY;
    //Convert json to a string and add salt.
    const buf = Buffer.from(JSON.stringify(data));
    //Base 64 encode
    const encoded = buf.toString("base64");
    const result = await site.update(
        {site_info: encoded},
        {
          where: {
            client_id: client.id,
            store_hash: storehash
          }
        }
    );

    //Save store information as a encoded string - End
    const siteId = clientSite.id;

    //Set sessions
    req.session.access_token = data.access_token;
    req.session.site_id = siteId;

    //Injecting a javascript
    bcSetting.accessToken = data.access_token;
    bcSetting.storeHash = storehash;
    bcSetting.apiVersion = "v3";

    const bc = new BigCommerce({
      clientId: client.bcClientId,
      accessToken: data.access_token,
      storeHash: storehash,
      responseType: "json",
      apiVersion: "v3"
    });

    const scriptData = {
      name: "Ns CMS Block",
      description: "CMS Block load the content from the API",
      html: `<script>
        fetch("https://bc-ns-cms.herokuapp.com/api/cms/${storehash}")
            .then(function (res) { return res.json(); })
            .then(function (blocks) { 
              blocks.forEach(function (block) { 
                const pid = block.page_id;
                const sid = block.section_id;
                    var ele = document.querySelector("#cms-block-"+pid+"-"+sid); 
                    ele.innerHTML = block.content; }); 
        }).catch(function (err) {
            return console.log(err); 
        });
        </script>`,
      src: "",
      auto_uninstall: true,
      load_method: "default",
      location: "footer",
      visibility: "all_pages",
      kind: "script_tag"
    };
    try {
      const response = await bc.post("/content/scripts", scriptData);
    } catch (e) {
      console.log(e);
    }

    //Show installation success message.
    res.sendFile("images/success.png", appOptions);
  } catch (error) {
    console.log(error);
    //Show unsuccessful message.
    res.sendFile("images/error.png", appOptions);
  }
};
//load
const load = async (req, res, next) => {
  try {
    res.sendFile("index.html", options);
  } catch (error) {
    res.sendFile("images/error.png", appOptions);
  }
};

module.exports = { auth, load };