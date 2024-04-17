import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

export interface QuestionFormData {
  id?: string;
  question: String;
  answer: String;
  label: String;
  true_grade: Number;
}

interface QuestionFormDialogProps {
  open: boolean;
  questionData?: QuestionFormData;
  onClose: () => void;
  onSubmit: (data: QuestionFormData) => void;
}

export const QuestionFormDialog: React.FC<QuestionFormDialogProps> = ({ open, questionData, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<QuestionFormData>({
    question: '',
    answer: '',
    label: '',
    true_grade: 0,
  });

  useEffect(() => {
    // If classData is provided (editing), populate the form with existing data
    if (questionData) {
      setFormData(questionData);
    }
  }, [questionData, open]);

  // Yeh sahi karna hai!!!!!!!!
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    // If the input is for a number field, convert the value to a number.
    const isNumeric = ['studentEnrolledCount', 'avg_rating', 'join_code', 'quizCreated'].includes(name);
    setFormData(prev => ({ ...prev, [name]: isNumeric ? Number(value) : value }));
  };

  const handleFormSubmit = () => {
    // Ensure that the form data has an ID if we are editing
    if (questionData && questionData.id) {
      onSubmit({ ...formData, id: questionData.id }); // Include the ID during an update
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
      <DialogTitle>{questionData ? 'Edit Question' : 'Add New Question'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="question"
          label="Question"
          type="text"
          fullWidth
          variant="outlined"
          value={formData.question}
          onChange={handleChange}
          style={{ padding: '5px' }}
        />
        {/* Repeat TextField components for each field you have in the form */}
        {/* Example for studentEnrolledCount */}
        <TextField
          autoFocus
          margin="dense"
          name="answer"
          label="Answer"
          type="text"
          fullWidth
          variant="outlined"
          value={formData.answer}
          onChange={handleChange}
          style={{ padding: '5px' }} 
        />
        {/* <TextField
          autoFocus
          margin="dense"
          name="label"
          label="Label"
          type="text"
          fullWidth
          variant="outlined"
          value={formData.label}
          onChange={handleChange}
          style={{ padding: '5px' }}  
        /> */}
      </DialogContent>
      <DialogActions style={{paddingRight: '25px'}}>
        <Button onClick={handleCancel} style={{backgroundColor: 'red', color: 'white'}}>Cancel</Button>
        <Button onClick={handleFormSubmit} style={{backgroundColor: 'green', color: 'white'}}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
};
