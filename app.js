const cors = require("cors");
const logger = require("morgan");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");

// Routes
const BcRoutes = require("./routes/bcRoute");
const CMSRoutes = require("./routes/cmsRoute");
const SiteRoutes = require("./routes/siteRoute");
const PageRoutes = require("./routes/pageRoute");
const ClientRoute = require("./routes/clientRoute");
const SectionRoutes = require("./routes/sectionRoute");
const ProductsRoutes = require("./routes/productRoute");

//Initialize the express application
const app = express();

//Middle Wares
app.use(cors());
app.use(bodyParser.json());
app.use(logger("dev"));

//Session
app.use(cookieParser());
app.set("trust proxy", 1); // trust first proxy

app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"]
  })
);

//Routes
app.use("/bc", BcRoutes);
app.use("/product", ProductsRoutes);
app.use("/api/cms", CMSRoutes);
app.use("/api/page", PageRoutes);
app.use("/api/site", SiteRoutes);
app.use("/api/client", ClientRoute);
app.use("/api/section", SectionRoutes);
//app.use("/api/block", BlockRoutes);

//Static files
//app.use(express.static("public"));
app.use(express.static("client/build"));

//Catch 404 Errors and forwards them to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

//Error handler
app.use((err, req, res) => {
  const error = app.get("env") === "development" ? err : {};
  const status = err.status;
  //Respond to client
  res.status(status).json({
    error: {
      message: error.message
    }
  });
  //Respond to server
  console.error(err);
});

//Port
const PORT = process.env.PORT || 4000;

//Start the server
app.listen(PORT, console.log(`Application is running on port ${PORT}`));