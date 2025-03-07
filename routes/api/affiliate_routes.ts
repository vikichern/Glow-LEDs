import express from "express";
import { affiliate_controller } from "../../controllers";
// const affiliate_controller = require("../../controllers/affiliate_controller");
const { isAuth, isAdmin } = require("../../util");
const router = express.Router();

router.route("/id/:id").get(affiliate_controller.findById_affiliates_c);
router.route("/:pathname/pathname").get(affiliate_controller.findByPathname_affiliates_c);

router.route("/create_rave_mob_affiliates").put(affiliate_controller.create_rave_mob_affiliates_affiliates_c);
// router.route('/code_usage').get(affiliate_controller.create_rave_mob_affiliates_affiliates_c);
router.route("/").get(affiliate_controller.findAll_affiliates_c).post(isAuth, affiliate_controller.create_affiliates_c);

router
  .route("/:pathname")
  // .get(affiliate_controller.findByPathname_affiliates_c)
  .put(isAuth, affiliate_controller.update_affiliates_c)
  .delete(isAuth, isAdmin, affiliate_controller.remove_affiliates_c);

export default router;
