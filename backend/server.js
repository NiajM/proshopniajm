import path from 'path'
import express from 'express'
import morgan from 'morgan'
import dotenv from 'dotenv'
import colors from 'colors' // Package for console
// import cors from 'cors'
// import fs from 'fs'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import connectDB from './config/db.js'  // Since we are in the backend here and for ES Modules we are adding .js


import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import imageUploadRoutes from './routes/imageUploadRoutes.js'
import pdfUploadRoutes from './routes/pdfUploadRoutes.js'

dotenv.config()

connectDB()

const app = express()

if (process.env.NODE_ENV === 'development') {  // It can be used also for 'production' mode
    app.use(morgan('dev'))
}

app.use(express.json()) // It will allow us to accept JSON data in the body

app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload/image', imageUploadRoutes)
app.use('/api/upload/pdf', pdfUploadRoutes)

app.get('/api/config/paypal', (req, res) => res.send(process.env.PAYPAL_CLIENT_ID))    // --PayPal--It's basically like a config route

// For uploading file section

const __dirname = path.resolve()

// console.log(`From Server.js-> ` + path.resolve())

// let options = {
//     dotfiles: 'ignore', // 'allow' 'deny' 'ignore'
//     etag: true,
//     extensions: ['htm', 'html'],
//     index: false,   // to disable directory indexing
//     maxAge: '70d',
//     redirect: false,
//     setHeaders: function (res, path, stat) {
//         res.set('x-timestamp', Date.now())
        
//         // res.set({
//         //     'Content-Type': 'text/plain',
//         //     'Content-Type': 'application/pdf',
//         //     'x-timestamp': Date.now()
//         // })
//     }
// }

// app.use(express.static('uploads', options))

// app.use('/uploads', express.static(path.join(__dirname, '/uploads'), options))

app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

if (process.env.NODE_ENV === 'production') { 

    app.use(express.static(path.join(__dirname, '/frontend/build')))

    app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html')))

} else {
    app.get('/', (req, res) => {
        res.send('API is running.....')
    })
}

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold))


////////////////////////-Test Later-////////-Ebd-/////////////

// http://localhost:port/uploads
// Making the uploads folder as static
// app.use(RouteParameters, Path for static directory)

// app.use('/uploads', (req, res) => {
//     console.log('in in')
//     res.sendFile(

//         'uploads/sample1.pdf',
//         //`${document.documentName}`,
//         (err) => {
//           if (err) {
//             console.log('in err')
//             res.status(500).send('error')
//           } else {
//             console.log('file was downloaded')
//           }
//         }
//       )
// })

// app.use('/uploads', function (req, res, next) {
//     const options = {
//         root: path.join(__dirname, 'uploads'),
//         dotfiles: 'deny',
//         headers: {
//             'x-timestamp': Date.now(),
//             'x-sent': true,
//             'Content-Type': 'application/pdf'
//         }
//     }
        
//         const fileName = req.originalUrl.split(req.baseUrl)[1]
//         console.log(fileName)
//         res.sendFile(fileName, options, function (err) {
//             if (err) {
//                 next(err)
//             } else {
//                 console.log('Sent:', fileName)
//             }
//         })
//     })


// For uploading file section

////////////////////////-Test Later-////////-Start-/////////////