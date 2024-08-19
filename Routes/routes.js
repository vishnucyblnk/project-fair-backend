
// import express
    const express = require('express')
// importuserController js file
    const userController = require('../Controllers/userController')
    const projectController = require('../Controllers/projectController')
    const multerConfig = require('../Middlewares/multerMiddleware')
    const jwtMiddleware = require('../Middlewares/jwtMiddleware')


// create router for express app using Router object
    const router = new express.Router()

// define different routes for server app
    // register
        router.post('/user/register',userController.register)
    // login 
        router.post('/user/login' ,userController.login)
    // addproject
        router.post('/projects/add',jwtMiddleware,multerConfig.single('projectImage'),projectController.addProject)
    // getuserProjects
        router.get('/user/all-projects',jwtMiddleware,projectController.getAllUserProjects)
    // gethomeprojects
        router.get('/home/projects',projectController.getHomeProjects)
    // getallprojects
        router.get('/projects/all',jwtMiddleware,projectController.getAllProjects)
    // editproject - path parameter is id
        router.put('/project/edit/:id',jwtMiddleware,multerConfig.single('projectImage'),projectController.editProject)
    // deleteproject
        router.delete('/project/remove/:id',jwtMiddleware,projectController.deleteProject) 
    // editprofile - path parameter is id
        router.put('/profile/edit/:id',jwtMiddleware,multerConfig.single('profImg'),userController.editProfile)


// export router 
    module.exports = router