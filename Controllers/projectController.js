// import project model
const projects = require('../Models/projectSchema');
const githubController = require('../Controllers/githubController');

// add project 
    exports.addProject = async (req,res)=>{
        console.log("Inside add project function");
        const {title,languages,github,website,overview,userId} = req.body
        const projectImage = req.file.filename
        // console.log(`${title}, ${languages}, ${github}, ${website}, ${overview}, ${projectImage}, ${userId}`);
        try{
            const existingProject = await projects.findOne({github})
            if(existingProject){
                res.status(406).json("Project already exists...")
            }else{
                const newProject = new projects({
                    title,languages,github,website,overview,projectImage,userId
                })
                await newProject.save()
                res.status(200).json(newProject)
                githubController.uploadImages(req,res);
            }
        }catch(err){
            res.status(401).json(`Error!!! Transaction failed: ${err}`)
        }
    }

    
// get user all projects
exports.getAllUserProjects = async (req,res)=>{
    console.log("Inside get user all projects function");
    const userId = req.payload
    try{
        const userProjects = await projects.find({userId})
        res.status(200).json(userProjects)
    }catch(err){
        res.status(401).json(`Error!!! Transaction failed: ${err}`)
    }
}

// get home projects
exports.getHomeProjects = async(req,res)=>{
    console.log("Inside get home projects function");
    try{
        const homeProjects = await projects.find().limit(3)
        res.status(200).json(homeProjects)
    }catch(err){
        res.status(401).json(`Error!!! Transaction failed: ${err}`)
    }
}

// get all projects
exports.getAllProjects = async(req,res)=>{
    console.log("get all projects");
    const searchKey = req.query.search
    const query = {
        languages:{$regex:searchKey, $options:"i"} 
    }
    try{
        const allProjects = await projects.find(query)
        res.status(200).json(allProjects)
    }catch(err){
        res.status(401).json(`Error!!! Transaction failed: ${err}`)
    }
}

// edit project
exports.editProject = async(req,res)=>{
    const userId = req.payload
    const {title,languages,github,website,overview,projectImage} = req.body
    const uploadedImage = req.file ? req.file.filename : projectImage
    const {id} = req.params 
    try{

        const existingProject = await projects.findOne({ _id: id });
        if (!existingProject) {
            return res.status(404).json('Project not found');
        }
        const prevImg = existingProject.projectImage;

        const updateProject = await projects.findByIdAndUpdate({_id:id},{
            title,languages,github,website,overview,projectImage:uploadedImage,userId
        },{new:true})
        await updateProject.save()
        res.status(200).json(updateProject)

        githubController.editInGitHub(prevImg,uploadedImage,'image');

    }catch(err){
        res.status(401).json(`Error!!! Transaction failed: ${err}`)
    }

    
}

// delete Project
    exports.deleteProject = async(req,res)=>{
        const {id} = req.params
        try{

            const existingProject = await projects.findOne({ _id: id });
            if (!existingProject) {
                return res.status(404).json('Project not found');
            }

            const removeProject = await projects.findByIdAndDelete({_id:id})
            res.status(200).json(removeProject)

            githubController.deleteFromGitHub(existingProject?.projectImage, 'image');
            
        }catch(err){
            res.status(401).json(`Error!!! Transaction failed: ${err}`)
        }
    }