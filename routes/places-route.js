const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const placesControllers = require("../controllers/places-controllers");
const fileUpload = require("../middleware/file-upload");
const chekAuth =require('../middleware/check-auth') ;

router.get("/:pid", placesControllers.getPlaceById);

router.get("/user/:uid", placesControllers.getPlacesByUserId);

router.use(chekAuth) ;

router.post(
  "/",
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
    check("latitude").not().isEmpty(),
    check("longitude").not().isEmpty(),
    // check("creator").not().isEmpty() ,
  ],
  placesControllers.createPlace
);

router.patch(
  "/:pid",
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
  ],
  placesControllers.updatePlace
);

router.delete("/:pid", placesControllers.deletePlace);

module.exports = router;
