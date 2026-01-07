
import { Router } from 'express';
import * as taskController from '../controllers/task_contr.js';

const router = Router();

router.get('/', taskController.getTasks);
router.post('/', taskController.createTask);
router.patch('/:id', taskController.updateTaskStatus);
router.delete('/:id', taskController.deleteTask);

export default router;
