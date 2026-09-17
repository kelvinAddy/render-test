const notesController = require('../controllers/notesController');
const router = require('express').Router();

router.get('/', notesController.getAllNotes);
router.get('/:id', notesController.getNoteById);
router.put('/id', notesController.putNoteById);
router.delete('/:id', notesController.deleteNoteById);
router.post('/', notesController.postNote);

module.exports = router;
