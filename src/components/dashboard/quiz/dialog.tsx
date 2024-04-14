import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, FormControlLabel, Checkbox, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

export interface QuizFormData {
  id: string;
  title: String;
  questions: String[];
  start_time: Date;
  end_time: Date;
  is_active: boolean;
  is_relesead: boolean;
  class_id: String;
}

interface QuestionFormDialogProps {
  open: boolean;
  quizData?: QuizFormData;
  onClose: () => void;
  onSubmit: (data: QuizFormData) => void;
}

export const QuizFormDialog: React.FC<QuestionFormDialogProps> = ({ open, quizData, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<QuizFormData>({
    id: '',
    title: 'Sample Quiz',
    questions: ['Question 1', 'Question 2'],
    start_time: new Date(),
    end_time: new Date(),
    is_active: false,
    is_relesead: false,
    class_id: 'Sample Class ID',
  });

  useEffect(() => {
    // If classData is provided (editing), populate the form with existing data
    if (quizData) {
      setFormData(quizData);
    }
  }, [quizData, open]);

  // Yeh sahi karna hai!!!!!!!!
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    // If the input is for a number field, convert the value to a number.
    const isNumeric = ['studentEnrolledCount', 'avg_rating', 'join_code', 'quizCreated'].includes(name);
    setFormData(prev => ({ ...prev, [name]: isNumeric ? Number(value) : value }));
  };

  const handleFormSubmit = () => {
    // Ensure that the form data has an ID if we are editing
    if (quizData && quizData.id) {
      onSubmit({ ...formData, id: quizData.id }); // Include the ID during an update
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
      <DialogTitle>{quizData ? 'Edit Question' : 'Add New Question'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="title"
          label="Title"
          type="text"
          fullWidth
          variant="outlined"
          value={formData.title}
          onChange={handleChange}
          style={{ padding: '5px' }}
        />
        {/* Repeat TextField components for each field you have in the form */}
        <TextField
          autoFocus
          margin="dense"
          name="start_time"
          label="Start Time"
          type="datetime-local"
          fullWidth
          variant="outlined"
          value={formData.start_time.toISOString().substring(0, 16)}
          onChange={handleChange}
          style={{ padding: '5px' }} 
        />
        <TextField
          autoFocus
          margin="dense"
          name="end_time"
          label="End Time"
          type="datetime-local"
          fullWidth
          variant="outlined"
          value={formData.start_time.toISOString().substring(0, 16)}
          onChange={handleChange}
          style={{ padding: '5px' }} 
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.is_active}
              onChange={handleChange}
              name="is_active"
              color="primary"
            />
          }
          label="Is Active"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.is_relesead}
              onChange={handleChange}
              name="is_relesead"
              color="primary"
            />
          }
          label="Is Released"
        />
        <FormControl
          margin="dense"
          fullWidth
          variant="outlined"
          style={{ padding: '5px' }}
        >
          <InputLabel>Questions</InputLabel>
          <Select
            multiple
            value={formData.questions}
            onChange={(event) => {
              const { value } = event.target;
              setFormData(prev => ({ ...prev, questions: value as string[] }));
            }}
          >
            {/* Replace 'Question 1', 'Question 2' with your actual options */}
            <MenuItem value="Question 1">Question 1</MenuItem>
            <MenuItem value="Question 2">Question 2</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions style={{paddingRight: '25px'}}>
        <Button onClick={handleCancel} style={{backgroundColor: 'red', color: 'white'}}>Cancel</Button>
        <Button onClick={handleFormSubmit} style={{backgroundColor: 'green', color: 'white'}}>Create</Button>
      </DialogActions>
    </Dialog>
  );
};
