const {Schema, model} = require('mongoose')

const schema = new Schema({

	title: {
		type: String,
		required: true
	},
	weightInKilos: {
		type: Number,
		required: true
	},
	priceInUAH: {
		type: Number,
		required: true
	}
})

module.exports = model('Exercise', schema)
