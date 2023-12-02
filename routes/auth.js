import {Router} from 'express'
import User from '../model/user.js'
import bcrypt from 'bcrypt'
import { generateJwtToken } from '../services/token.js'
import tokenes from '../middleware/tokenes.js'
const router = Router()

router.get('/login', tokenes, (req,res) =>{
  
    res.render('login', {
        title: 'Login | J',
        isLogin: true,
        loginError: req.flash('loginError')
    })
})

router.get('/register', tokenes, (req,res) =>{
   
    res.render('register', {
        title: 'Register | J',
        isRegister: true,
        registerError: req.flash('registerError')

    })
})
router.get('/logout', (req, res) =>{
    res.clearCookie('token')
    res.redirect('/')
})

router.post('/login', async(req, res)=>{
     const {email, password} = req.body
     if(!email || !password){
        req.flash('loginError', 'All fieldds is required')
        res.redirect('/login')
        return
     }
    

    const exisUser = await User.findOne({email})
    if(!exisUser){
        req.flash('loginError', 'User not found')
        res.redirect('/login')
        return
    }
    const isPassEqual = await bcrypt.compare(password, exisUser.password)
    if(!isPassEqual){
        req.flash('loginError', 'Password wrong')
        res.redirect('/login')
        return
    }
    
    const token = generateJwtToken(exisUser._id)
    res.cookie('token', token, {httpOnly: true, secure: true})
    res.redirect('/')
})

router.post('/register', async (req, res)=>{
    const {firstname, lastname, email, password, number} = req.body

    if(!firstname || !lastname || !email || !password || !number){
        req.flash('registerError', 'All filds is required')
        res.redirect('/register')
        return
    }
    const condidate = await User.findOne({email})
    if(condidate){
        req.flash('registerError', 'User already exist')
        res.redirect('/register')
        return
       
    }
    
    const hashpassword = await bcrypt.hash(password, 10)
    const userData = {
        firstName: firstname,
        lastName: lastname,
        email: email,
        password: hashpassword,
        number: number
    }

    const user = await User.create(userData)
    const token = generateJwtToken(user._id)

    res.cookie('token', token, {httpOnly: true, secure: true})
    res.redirect('/')
})

export default router