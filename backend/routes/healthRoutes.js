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
import { uploadDocuments, verifyDocumentUpload } from '../middleware/upload.js';

const router = express.Router();

router.use(protect);

router.get('/my', getMyPetRecords);
router.get('/timeline/:petId', generateTimeline);

router.get('/:id', getRecordById);
router.put('/:id', uploadDocuments.single('document'), verifyDocumentUpload, updateRecord);
router.delete('/:id', deleteRecord);

router.get('/pet/:petId', getRecordsForPet);
router.post('/pet/:petId', uploadDocuments.single('document'), verifyDocumentUpload, createRecord);

router.get('/vet/:petId', getVetRecords);

export default router;