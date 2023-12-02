import {Router} from 'express'
import Product from '../model/products.js'
import authMiddleware from '../middleware/auth.js'
import userMiddleware from '../middleware/user.js'

const router = Router()

router.get('/', async (req,res) =>{
    const products = await Product.find().lean()
    res.render('index', {
        title: 'Boox | J',
        products: products.reverse(),
        userId: req.userId ? req.userId.toString() : null,
    })
})

router.get('/product', async (req, res) =>{
    const user = req.userId ? req.userId.toString() : null
    const myProduct = await Product.find({user: user}).populate('user').lean()
    res.render('product', {
        title: 'Product | J',
        isProduct: true,
        myProduct: myProduct
    })
})
router.get('/edit-product/:id', async (req, res) => {
    const id = req.params.id
    const product = await Product.findById(id).populate('user').lean()
	
    res.render('edit-product',{
        product: product,
        errorEditProduct: req.flash('errorEditProduct')
    })
})

router.get('/add',authMiddleware, (req,res) =>{  
    res.render('add', {
        title: 'Add | J',
        isAdd: true,
        errorAddProduct: req.flash('errorAddProduct')
    
    })
})

router.post('/add-products', userMiddleware, async (req,res) =>{
    const {title, description, image, price} = req.body
    if(!title || !description || !image || !price){
        req.flash('errorAddProduct', 'All filds is required')
        res.redirect('/add')
        return
    } 
 await Product.create({...req.body, user: req.userId})
    res.redirect('/')
})

router.post('/edit-product/:id', async(req, res) =>{
    const {title, description, image, price} = req.body
    const id = req.params.id
    if(!title || !description || !image || !price){
        req.flash('errorEditProduct', 'All filds is required')
        res.redirect(`/edit-product/${id}`)
        return
    } 

    await Product.findByIdAndUpdate(id, req.body, {new: true})
    res.redirect('/product')
})

router.post('/delete-product/:id', async (req, res) => {
    const id = req.params.id
    await Product.findByIdAndRemove(id)
	
    res.redirect('/')
})

export default router