import express from 'express';
import {
  getRecordsForPet,
  getRecordById,
  createRecord,
  updateRecord,
  deleteRecord,
  getVetRecords,
  generateTimeline,
  getMyPetRecords,
} from '../controllers/healthController.js';
import { protect } from '../middleware/auth.js';
<<<<<<< HEAD
import { uploadDocuments, verifyDocumentUpload } from '../middleware/upload.js';
=======
import { uploadDocuments } from '../middleware/upload.js';
>>>>>>> 01afc2f9df72d62b0b541616512cc04cfcf4d2a4

const router = express.Router();

router.use(protect);

router.get('/my', getMyPetRecords);
router.get('/timeline/:petId', generateTimeline);

router.get('/:id', getRecordById);
<<<<<<< HEAD
router.put('/:id', uploadDocuments.single('document'), verifyDocumentUpload, updateRecord);
router.delete('/:id', deleteRecord);

router.get('/pet/:petId', getRecordsForPet);
router.post('/pet/:petId', uploadDocuments.single('document'), verifyDocumentUpload, createRecord);
=======
router.put('/:id', uploadDocuments.single('document'), updateRecord);
router.delete('/:id', deleteRecord);

router.get('/pet/:petId', getRecordsForPet);
router.post('/pet/:petId', uploadDocuments.single('document'), createRecord);
>>>>>>> 01afc2f9df72d62b0b541616512cc04cfcf4d2a4

router.get('/vet/:petId', getVetRecords);

export default router;