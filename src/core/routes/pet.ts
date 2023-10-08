import express, { Request, Response, NextFunction, Router } from "express";
import { insertNewPet, getPetById, removePet, getAllPets, getAllPetsbyUser, updatePet} from "../mongo/pet";
import { BadRequestError, UnauthorizedError } from "../errors/user";
import { isAdmin, isLoggedIn } from "../middleware/auth";
import { ensureObjectID } from "../config/utils/mongohelper";

const router: Router = express.Router();

//add new pet
router.post(
  "/new",
  isLoggedIn,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let name = req.body.name;
      let type = req.body.type;
      let userId = req.session.Me ? req.session.Me._id : null;
      if (name && name.length > 0) {
        if (type && type.length > 0 && userId) {
          let newPet = await insertNewPet(name, userId, type);
          if (newPet) {
            res.json(newPet);
          } else {
            throw new BadRequestError("Something went wrong");
          }
        } else {
          throw new BadRequestError("You need to send a type");
        }
      } else {
        throw new BadRequestError("You need to send a name");
      }
    } catch (err) {
      next(err);
    }
  }
);
//get all pets
router.get("/mypets", isLoggedIn, async (req: Request, res: Response, next: NextFunction) => {
    try {
        let userId = req.session.Me ? req.session.Me._id : null;
        if(userId){
        let pets = await getAllPetsbyUser(userId);
        res.json(pets);
        }
    } catch (err) {
        next(err);
    }
});

//remove a pet they added
router.delete(
  "/remove",
  isLoggedIn,
  async (req: Request, res: Response, next: NextFunction) => {
    let petId = req.body.petId; 
    let userId = req.session.Me ? req.session.Me._id : null;
    if (petId && petId.length > 0 && userId) {
        //convert to object id
        petId = ensureObjectID(petId);
      let pet = await getPetById(petId);
      if (pet?.userId == userId) {
        let result = await removePet(petId);
        if (result) {
          res.json("Pet removed");
        } else {
          throw new BadRequestError("Something went wrong");
        }
      } else {

        throw new UnauthorizedError(
          "You are not authorized to remove this pet"
        );
      }
    } else {
      throw new BadRequestError("You need to send a petId");
    }
  }
);




//ADMIN ROUTES
//change users to admin
router.get("/edituser", isLoggedIn, isAdmin, async (req: Request, res: Response, next: NextFunction) => {

});
//all pets
router.get("/all", isLoggedIn, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
    try {
        let userId = req.session.Me ? req.session.Me._id : null;
        if(userId){
        let pets = await getAllPets();
        res.json(pets);
        }
    } catch (err) {
        next(err);
    }
});

//remove any pet
router.delete("/delete", isLoggedIn, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
    let petId = req.body.petId; 
    if (petId && petId.length > 0) {
        //convert to object id
        petId = ensureObjectID(petId);
      let pet = await getPetById(petId);
      if (pet) {
        let result = await removePet(petId);
        if (result) {
          res.json("Pet removed");
        } else {
          throw new BadRequestError("Something went wrong");
        }
      } else {

        throw new UnauthorizedError(
          "You are not authorized to remove this pet"
        );
      }
    } else {
      throw new BadRequestError("You need to send a petId");
    }
  }
);

//user edit pet name, admins not allowed
router.patch('/edit-pet-name', isLoggedIn, async (req: Request, res: Response, next: NextFunction) => {
    try {
        let petId = req.body.petId;
        let name = req.body.name;
        let userId = req.session.Me ? req.session.Me._id : null;
        //check if user is not admin
        if(req.session.Me?.isAdmin){
            throw new UnauthorizedError("Admins are not allowed to change pet names");
        } else{
            if(petId && petId.length > 0 && name && name.length > 0 && userId){
                petId = ensureObjectID(petId);
                let pet = await getPetById(petId);
                if(pet?.userId == userId){
                    let result = await updatePet (petId, name);
                    if(result){
                        res.json("Pet name updated");
                    } else {
                        throw new BadRequestError("Something went wrong");
                    }
                } else {
                    throw new UnauthorizedError("You are not authorized to edit this pet");
                }
            } else {
                throw new BadRequestError("You need to send a petId and name");
            }
        }
       
    } catch (err){
        next(err);
    }
});

export default router;

