import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

export interface ClassFormData {
  id?: string;
  course_name: string;
  studentEnrolledCount: number;
  avg_rating: number;
  join_code: number;
  quizCreated: number;
}

interface ClassFormDialogProps {
  open: boolean;
  classData?: ClassFormData;
  onClose: () => void;
  onSubmit: (data: ClassFormData) => void;
}

export const ClassFormDialog: React.FC<ClassFormDialogProps> = ({ open, classData, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<ClassFormData>({
    course_name: '',
    studentEnrolledCount: 0,
    avg_rating: 0,
    join_code: 0,
    quizCreated: 0,
  });

  useEffect(() => {
    // If classData is provided (editing), populate the form with existing data
    if (classData) {
      setFormData(classData);
    }
  }, [classData, open]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    // If the input is for a number field, convert the value to a number.
    const isNumeric = ['studentEnrolledCount', 'avg_rating', 'join_code', 'quizCreated'].includes(name);
    setFormData(prev => ({ ...prev, [name]: isNumeric ? Number(value) : value }));
  };

  const handleFormSubmit = () => {
    // Ensure that the form data has an ID if we are editing
    if (classData && classData.id) {
      onSubmit({ ...formData, id: classData.id }); // Include the ID during an update
    } else {
      onSubmit(formData); // ID will be undefined here, indicating a new class
    }
    onClose(); // Close the dialog after submission
  };
  

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel}>
      <DialogTitle>{classData ? 'Edit Class' : 'Add New Class'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="course_name"
          label="Course Name"
          type="text"
          fullWidth
          variant="outlined"
          value={formData.course_name}
          onChange={handleChange}
          style={{ padding: '5px' }}
        />
        {/* Repeat TextField components for each field you have in the form */}
        {/* Example for studentEnrolledCount */}
        <TextField
          margin="dense"
          name="studentEnrolledCount"
          label="Enrolled Students"
          type="number"
          fullWidth
          variant="outlined"
          value={formData.studentEnrolledCount}
          onChange={handleChange}
          style={{ padding: '5px' }}
        />
        <TextField
          autoFocus
          margin="dense"
          name="avg_rating"
          label="Reviews"
          type="text"
          fullWidth
          variant="outlined"
          value={formData.avg_rating}
          onChange={handleChange}
          style={{ padding: '5px' }}
        />
        <TextField
          autoFocus
          margin="dense"
          name="join_code"
          label="Class Join Code"
          type="text"
          fullWidth
          variant="outlined"
          value={formData.join_code}
          onChange={handleChange}
          style={{ padding: '5px' }}
        />
        <TextField
          autoFocus
          margin="dense"
          name="quizCreated"
          label="No Of Quizzes"
          type="text"
          fullWidth
          variant="outlined"
          value={formData.quizCreated}
          onChange={handleChange}
          style={{ padding: '5px' }}
        />
      </DialogContent>
      <DialogActions style={{paddingRight: '25px'}}>
        <Button onClick={handleCancel} style={{backgroundColor: 'red', color: 'white'}}>Cancel</Button>
        <Button onClick={handleFormSubmit} style={{backgroundColor: 'green', color: 'white'}}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
};
