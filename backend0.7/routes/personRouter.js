import { Router } from "express";
import * as personController from "../controllers/personController.js";
import verifyToken from "../middleware/verifyToken.js";

const personRouter = Router();

// GET ALL PERSON ENTRIES
personRouter.get("/", verifyToken, personController.getAll);

// // GET FAMILY TREE
// personRouter.get("/familytree", verifyToken, personController.buildFamilyTree);

// GET PERSON ENTRY BY ID
personRouter.get("/:id", verifyToken, personController.getOneByID);

// ADDING A PERSON WITHOUT CONNECTIONS
personRouter.post("/add", verifyToken, personController.addPerson);

// // UPDATING WHOLE PERSON PROFILE
// personRouter.put("/:id", verifyToken, personController.updatePersonProfile);

// DELETE PERSON ENTRY BY ID
personRouter.delete("/:id", verifyToken, personController.deleteByID);

// CLEAR DATABANK
personRouter.delete("/", verifyToken, personController.deleteAll);

// // ADDING RELATIONS FOR EXISTING PERSON ENTRIES
// personRouter.patch("/:id/addParent", verifyToken, personController.addParent);
// personRouter.patch("/:id/addChild", verifyToken, personController.addChild);

// // ADDING NEW PEOPLE AS X
// personRouter.post(
//   "/:id/addNewParent",
//   verifyToken,
//   personController.addNewParent
// );
// personRouter.post(
//   "/:id/addNewChild",
//   verifyToken,
//   personController.addNewChild
// );

export default personRouter;
