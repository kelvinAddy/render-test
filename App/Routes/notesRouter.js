const notesController = require('../controllers/notesController');
const router = require('express').Router();

router.get('/', notesController.displayAllNotes);
router.get('/:id', notesController.deleteNoteById);
router.put('/id', notesController.editNoteById);
router.delete('/:id', notesController.deleteNoteById);
router.post('/', notesController.addNote);

module.exports = router;
