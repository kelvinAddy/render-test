const notesController = require('../Controllers/notesController');
const middleware = require('../Middlewares/middleware');
const router = require('express').Router();

router.get('/', notesController.getAllNotes);
router.get('/:id', notesController.getNoteById);

router.use(middleware.userExtractor);

router.put('/:id', notesController.putNoteById);
router.delete('/:id', notesController.deleteNoteById);
router.post('/', notesController.postNote);

module.exports = router;
