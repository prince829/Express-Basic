import { Request,Response } from "express";
import { config } from "../config/config.js";
import passport from "passport";
import { ExtractJwt, Strategy } from 'passport-jwt'
import mongoose, { Types } from "mongoose";
import { userModel } from "../modules/users/models/User.model.js";
const params = {
    secretOrKey: config.server.jwtSecret,
    jwtFromRequest: ExtractJwt.fromHeader('token')
};


//to remove mongoose strict query warning
mongoose.set('strictQuery', true);

const authMiddleware = () => {
    const strategy = new Strategy(params, (payload, done) => {
      userModel.aggregate([
            { $match: { _id: new Types.ObjectId(payload.id as string) } },
            {
                $lookup: {
                    from: 'roles',
                    let: { role: '$role' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$_id", "$$role"] }
                                    ]
                                }
                            }
                        },
                        {
                            $project: {
                                isDeleted: 0
                            }
                        }
                    ],
                    as: 'role'
                }
            },
            { $unwind: "$role" },
            {
                $project:{
                    first_name:1,
                    last_name:1,
                    email:1,
                    profile_image:1,
                    status:1,
                    isDeleted:1,
                    role:{
                        _id:"$role._id",
                        role:"$role.role"
                    }
                }
            },
        ]).exec()
            .then(result => {
                
                if (result && result.length) {
                    return done(null, result[0]);
                } else {
                    return done(null, false);
                }
            })
            .catch(error => {
                console.log(error,'errr');
                
                return done(error, false);
            });
    });
    passport.use(strategy);
    return {
        initialize: () => {
            return passport.initialize();
        },
        authenticate: (req:Request, res:Response, next:any) => {
            passport.authenticate("jwt", {session:false}, async (err:any, user:any) => {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    if(req.session){
                        req.session = null;
                    }
                   
                    return res.redirect('/');
                   
                }
                if (user) {
                    if((user.role && user.role.role !="admin")|| (user.status=="Inactive")||(user.isDeleted==true)){
                        if(req.session){
                            req.session = null;
                        }
                        
                        return res.redirect('/');
                    }else{
                        req.user=user;
                        return next();
                    }
                } else {
                    return res.redirect('/');
                }

            })(req, res, next);
        },
        // This is for webservice jwt token check //
        authenticateAPI: (req: Request, res: Response, next: any) => {
            // check for nonsecure path like login //
            passport.authenticate("jwt", { session: false }, (err: any, user: any) => {
                if (err) {
                    return {
                        status: 401,
                        auth: false,
                        message: 'Failed to authenticate token.'
                    }
                }
                if (!user) {

                    return {
                        status: 401,
                        auth: false,
                        message: "There was a problem finding the user."
                    }

                }else if ((user.status && user.status == "Inactive") || (user.isDeleted == true)) {
                    return {
                        status: 403,
                        auth: false,
                        message: "Not a valid user"
                    }
                }else{
                    req.user = user;
                    return next();
                };

            })(req, res, next);
        }
    };
};
export default authMiddleware;