const express = require('express');
const router = express.Router();
const User = require('../models/user')
const sendToken = require('../utils/jwtToken')
const catchAsyncError = require('../middlewares/catchAsyncError')

const ErrorHandler = require('../utils/ErrorHandler')

const {
    isAuthenticatedUser,
    authorizeRoles
} = require('../middlewares/auth');
const { route } = require('../app');


router.route('/register').post(catchAsyncError( async (req,res,next)=>{

    const { name , email , password , role } = req.body ;

    const user = await User.create({
        name ,
        email ,
        password ,
        role
    })

    sendToken(user , 200 , res);

})); //DONE

router.route('/login').post(catchAsyncError( async (req,res,next )=>{
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler('Please enter a password & email',400))
    }

    const user = await User.findOne({email}).select('+password')

    const passwordIsMatched = await user.comparePassword(password)

    if(!passwordIsMatched){
        return next(new ErrorHandler('Invalid password & email' ,401 ))
    }

    sendToken(user,200,res)
})) //DONE


router.route('/me').get(isAuthenticatedUser,catchAsyncError(async (req,res,next)=>{

    const user = await User.findById(req.user.id);

    res.status(200).send({
        success : true ,
        user
    })
} )) //DONE

router.route('/password/update').put( isAuthenticatedUser,catchAsyncError( (req,res,next)=>{

    const user = User.findById(req.user.id).select('+password')
    .then(
        user => {
            if(!user){
                return next(new ErrorHandler('user not found',400))
            }
            const isMatched = user.comparePassword(req.body.oldPassword).then(
                isMatched => {
                    if(!isMatched){
                        return next(new ErrorHandler('Old password is incorrect'));
                    }

                    user.password = req.body.newPassword ;

                    user.save().then(user => sendToken(user,200,res))
                }
            )
            
        }
    ).catch(err=> console.log(err))
    
})) // DONE

router.route('/logout').get( catchAsyncError( async (req,res,next)=>{

    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: 'Logged out'
    })
}))// DONE

router.route('/admin/users').get(isAuthenticatedUser , authorizeRoles('admin') , catchAsyncError( async (req,res,next)=>{

    const users = await User.find();

    if(!users) return next(new ErrorHandler('users not found',400));

    res.status(200).send({
        success:true,
        users
    })
})) // DONE

router.route('/admin/users/students').get(isAuthenticatedUser , authorizeRoles('admin'),catchAsyncError( async (req,res,next)=>{
    const students = await User.findOne({ role : 'student'}) 

    if(!students) return next(new ErrorHandler(" there's no students",400));

    res.status(200).send({
        success : true ,
        students
    })
})) //DONE

router.route('/admin/users/teachers').get(isAuthenticatedUser , authorizeRoles('admin') ,catchAsyncError( async (req,res,next)=>{
    const students = await User.findOne({ role : 'teacher'}) 

    if(!students) return next(new ErrorHandler(" there's no students",400));

    res.status(200).send({
        success : true ,
        students
    })
})) //DONE

router.route('/admin/users/admins').get(isAuthenticatedUser , authorizeRoles('admin') ,catchAsyncError( async (req,res,next)=>{
    const students = await User.findOne({ role : 'admin'}) 

    if(!students) return next(new ErrorHandler(" there's no students",400));

    res.status(200).send({
        success : true ,
        students
    })
}))//DONE

router.route('/admin/user/:id')
.get(isAuthenticatedUser , authorizeRoles('admin') ,catchAsyncError( async (req,res,next)=>{
    const user = await User.findById(req.params.id);

    if(!user) return next(new ErrorHandler('There\'s no user with given ID')) ;

    return res.status(200).send({
        success : true ,
        user
    })
})) //DONE
.put(isAuthenticatedUser , authorizeRoles('admin'),catchAsyncError( async (req,res,next)=>{

    const newUserData = {
        name : req.body.name,
        email : req.body.email,
        role : req.body.role
    }

    if(! req.body.name && ! req.body.email && ! req.body.role) 
        return next(new ErrorHandler('Verify the form fileds',400))

    const user = await User.findByIdAndUpdate(req.params.id,newUserData, 
        {
            runValidators : true ,
            new : true,
            useFindAndModify: false
        });

    res.status(200).send({
        success : true 
    })


})) // DONE
.delete(isAuthenticatedUser , authorizeRoles('admin')  ,catchAsyncError( async (req,res,next)=>{
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`User does not found with id: ${req.params.id}`))
    }

    await user.remove();

    return res.status(200).json({
        success: true,
    })
})) // DONE


module.exports = router ; 





