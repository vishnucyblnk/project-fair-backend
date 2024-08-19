// import user model
const users = require('../Models/userSchema');
const jwt = require('jsonwebtoken');
const githubController = require('../Controllers/githubController');

// register
    exports.register = async (req,res)=>{
        console.log('Inside register function');
        const {username,email,password} = req.body
        console.log(`Username: ${username},Email : ${email}, Password : ${password}`);
        try{
            // check already existing user - findone()
            const existingUser = await users.findOne({email})
            console.log(existingUser);
            if(existingUser){
                res.status(406).json('User already exist... Please Login!!!')
            }else{
                // register user
                const newUser = new users({
                    username,email,password,github:"",linkedin:"",profImg:"https://www.pngkey.com/png/full/233-2332677_ega-png.png"
                })
                await newUser.save()  
                res.status(200).json(newUser)
            }
        }catch(err){
            res.status(401).json(`Error!!! Transaction failed: ${err}`)
        }
        // res.status(200).json('Register request Recieved...')
    }

// Login
    exports.login = async (req,res)=>{
        console.log("Inside login function");
        const {email,password} = req.body
        try{
            // check user exist
            const existingUser = await users.findOne({email,password})
            if(existingUser){
                // generate token
                const token =jwt.sign({userId:existingUser._id},"superSecretKey123")
                res.status(200).json({
                    existingUser,
                    role:"user",
                    token
                })
            }else{
                res.status(404).json("Incorrect email / password")
            }

        }catch(err){
            res.status(401).json(`Error!!! Transaction failed: ${err}`)
        }
    }

// edit profile
    exports.editProfile = async(req,res)=>{
        console.log("inside editing profile function");
        const userId = req.payload
        const {username,email,password,github,linkedin,profImg} = req.body
        const uploadedImage = req.file ? req.file.filename : profImg
        const {id} = req.params 
        try{

            const existingProfile = await users.findOne({ _id: id });
            if (!existingProfile) {
                return res.status(404).json('User Profile not found');
            }
            const prevImg = existingProfile.profImg;

            const updateProfile = await users.findByIdAndUpdate({_id:id},{
                username,email,password,github,linkedin,profImg:uploadedImage
            },{new:true})
            await updateProfile.save()
            res.status(200).json({updateProfile,role:"user"})

            githubController.editInGitHub(prevImg,uploadedImage,'image');

        }catch(err){
            res.status(401).json(`Error!!! Transaction failed: ${err}`)
        }

        
    }

