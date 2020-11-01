const {Router} = require('express');
const bodyParser = require('body-parser');
const Exercise = require('../models/exercise')

const router = Router();
const jsonParser = bodyParser.json();


router.get('/', async (req, res) => {
	const exercises = await Exercise.find({});
	let exercisesString = JSON.stringify(exercises);

	res.render('index', {
		title: 'lab_5',
		exercisesString: exercisesString
	});
});

//post exercise
router.post('/', jsonParser, async function (req, res) {
	try {
		res.sendStatus(200);
		const exerciseJson = req.body;
		
		const exercise = new Exercise({
			title: exerciseJson.title,
	        weightInKilos: exerciseJson.weightInKilos,
	        priceInUAH: exerciseJson.priceInUAH   
		});
		await exercise.save();

	} catch (error) {
		res.sendStatus(500);
		console.error(error);
	}
});

//delete exercise
router.delete('/' , jsonParser, async function (req, res) {
	try {
		res.sendStatus(200);
		const exerciseJson = req.body;
		const exercise = await Exercise.findById(exerciseJson.id);
		await exercise.delete();
	} catch (error) {
		res.sendStatus(500);
		console.error('500: ', error);
	}
});

// edit exercise
router.put('/', jsonParser, async function (req, res) {
	try {
		res.sendStatus(200);
		const exerciseJson = req.body;
		const exercise = await Exercise.findById(exerciseJson.id);

		if (exerciseJson.title != ''){
			exercise.title = exerciseJson.title;
		}
		if (exerciseJson.weightInKilos != ''){
			exercise.weightInKilos = exerciseJson.weightInKilos;
		}
		if (exerciseJson.priceInUAH != ''){
			exercise.priceInUAH = exerciseJson.priceInUAH;
		}

		await exercise.save();
	} catch (error) {
		res.sendStatus(500);
		console.error(error);
	}
});

module.exports = router