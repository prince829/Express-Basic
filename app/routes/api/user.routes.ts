import express,{Request} from "express";
import { UserController } from "../../modules/webservices/User.controller.js";
import { existsSync, mkdirSync } from "fs";
const router = express()
import multer from "multer"

const storage = multer.diskStorage({
    destination: function (_req:Request, _file, callback) {
      if (!existsSync('./public/uploads/profile_pic')) {
        mkdirSync('./public/uploads/profile_pic');
      }
  
      callback(null, "./public/uploads/profile_pic")
    },
    filename: function (_req, file, callback) {
      callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname.replace(/\s/g, '_'));
    }
  });
  const uploadFile = multer({
    storage: storage
  })

const userController = new UserController()

/**
 * @swagger
 * /user/signup:
 *   post:
 *     summary: Signup/ Register
 *     tags:
 *       - User
 *     produces:
 *       - application/json
 *     parameters:
 *         - name: body
 *           in: body
 *           description: Signup
 *           required: true
 *           schema:
 *             type: object
 *             required:
 *                 - email
 *                 - first_name
 *                 - last_name
 *                 - confirm_password
 *                 - password
 *             properties:
 *                 email:
 *                      type: string
 *                 first_name:
 *                      type: string
 *                 last_name:
 *                      type: string
 *                 password:
 *                      type: string
 *                 confirm_password:
 *                      type: string
 *     responses:
 *        200:
 *          description: Registration Successful
 *        
 */

router.post('/user/signup', async (req, res) => {

    try {
        const success = await userController.signup(req, res);
        res.status(success.status).send(success);
    }
    catch (error: any) {
        res.status(error.status).send(error);
    }
});
router.post('/user/signin', async (req, res) => {

    try {
        const success = await userController.signIn(req, res);
        res.status(success.status).send(success);
    }
    catch (error: any) {
        res.status(error.status).send(error);
    }
});
router.all('/user*', global.auth.authenticateAPI)
router.get('/user/details', async (req, res) => {

    try {
        const success = await userController.profileDetails(req, res);
        res.status(success.status).send(success);
    }
    catch (error: any) {
        res.status(error.status).send(error);
    }
});
router.post('/user/update',uploadFile.any(), async (req, res) => {

    try {
        const success = await userController.updateProfile(req, res);
        res.status(success.status).send(success);
    }
    catch (error: any) {
        res.status(error.status).send(error);
    }
});

export default router