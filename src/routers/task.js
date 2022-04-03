const express = require('express')
const Task = require('../models/task.js')
const auth = require('../Middleware/Auth.js')


const router = new express.Router()

router.post('/tasks',auth,async(req,res)=>{
    const owner = req.user
    const task = new Task({
        ...req.body,
        owner:owner
    })
    
    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(400).send(e)
    }
})

router.get('/tasks',auth,async(req,res)=>{
    const query = req.query
    const queryarr = Object.keys(query)
    
    const owner = req.user
    const match = {}
    const sort = {}
    
    if(queryarr.length !== 0){
       queryarr.forEach((field)=>{
           console.log(req.query[field])

           switch(field){
               case 'completed':
                   match[field] = req.query[field]
                   
                   break
               case 'sort':
                   const parts = req.query[field].split(':')
                   if(parts[1] === 'des'){
                       parts[1] = -1
                   }else if (parts[1]==='asc'){
                       parts[1] = 1
                   }else{
                       return sort
                   }
                   sort[parts[0]] = parseInt(parts[1])       
           }

       })
    }else{}
    try{
        
        await req.user.populate({
            path:'tasks',
            match,
            options:{
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort

            },
            
        })
        
        res.send(owner.tasks)
    }catch(e){
        console.log(e)
        res.send(e)
    }
    
})

router.get('/tasks/:id',auth,async(req,res)=>{
    
    
    try{
        
        const task = await Task.findOne({_id:req.params.id,owner:req.user.id})
        if (!task){
           return res.send('no task found')
        }
        res.send(task)
    }catch(e){
        res.send(e)
    }

})

router.patch('/tasks/:id',auth,async(req,res)=>{

    const updates = Object.keys(req.body)
    const Validupdate = ['description','completed']
    const validop = updates.every((value)=>{
        return Validupdate.includes(value)
        
    })
    if (!validop){
        return res.send('Invalid update provided')
    }
    try{
        const task = await Task.findOne({_id:req.params.id,owner:req.user.id})
        if(!task){
            res.status(404).send('Invalid Id')
        }
        updates.forEach((field)=>{
            task[field] = req.body[field]
        })
        
        await task.save()
        
        res.send(task)
    }
    catch(e){   
        console.log(e)
        res.status(404).send(e)
    }
})

router.delete('/tasks/:id',async(req,res)=>{
    try{
        const taskdeleted  = await Task.findByIdAndDelete({_id:req.params.id,owner:req.user.id})
        if(!taskdeleted){
            return res.send('No task found')
        }
        res.send('Task deleted:'+taskdeleted)
    }catch(e){
        res.send(e)
    }
})

module.exports = router