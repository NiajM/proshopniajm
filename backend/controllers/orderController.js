import asyncHandler from 'express-async-handler'
import Order from '../models/orderModel.js'

//  @desc   Create new order
//  @route  POST /api/orders
//  @access Private
const addOrderItems = asyncHandler(async (req, res) => {

    const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body

    if (orderItems && orderItems.length === 0) {
        res.status(400)
        throw new Error('No order items')
        return
    } else {
        const order = new Order({
            user: req.user._id,
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        })
		
		// 5-> paymentResult itemsPrice is not in model user

        const createdOrder = await order.save()

        res.status(201).json(createdOrder) // 201 is for created something
    }
})

//  @desc   Get order by ID
//  @route  GET /api/orders/:id
//  @access Private
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email')

    if (order) {
        res.json(order)
    } else {
        res.status(404)
        throw new Error('Order not found')
    }
})

//  @desc   Update order to paid
//  @route  GET /api/orders/:id/pay
//  @access Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)

    if (order) {
        order.isPaid = true
        order.paidAt = Date.now()
        order.paymentResult = { // These data are coming from PayPal, that means money transfer to PayPal account is successful
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address  // since it's a payer object so payer is used
        }

        const updatedOrder = await order.save()
        res.json(updatedOrder)
    } else {
        res.status(404)
        throw new Error('Order not found')
    }
})

//  @desc   Get logged in user order
//  @route  GET /api/orders/myorders
//  @access Private
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }) // Finds all orders with this logged in user id

    res.json(orders)
})

//  @desc   Get all orders
//  @route  GET /api/orders
//  @access Private/Admin
const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name')  // giving empty object to find all orders

    res.json(orders)
})

//  @desc   Update order to delivered
//  @route  GET /api/orders/:id/deliver
//  @access Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)

    if (order) {
        order.isDelivered = true
        order.deliveredAt = Date.now()

        const updatedOrder = await order.save()
        res.json(updatedOrder)
    } else {
        res.status(404)
        throw new Error('Order not found')
    }
})

export { addOrderItems, getOrderById, updateOrderToPaid, getMyOrders, getOrders, updateOrderToDelivered }