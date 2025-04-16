// SimulationExamComponent.jsx

import React, { useState, useEffect } from 'react';
import { Modal } from 'antd'; // or use open if your version supports it
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ModelForAddQuestion from './ModelForAddQuestion'; // Reuse your question modal component
import AllIconsComponent from '../../Icons/AllIconsComponenet'; // Make sure the path and name match your project
import styles from './SimulationExamComponent.module.scss';
import { toast } from 'react-toastify';
import { postRouteAPI } from '../../services/apisService';
import { getNewToken } from '../../services/fireBaseAuthService';

const SimulationExamComponent = () => {
  // Modal state to open the exam/folder form
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  // Toggle between adding a folder or an exam:
  // For example, if true we’re in “folder mode” (just grouping exams), if false then “exam mode” (with questions)
  const [isFolderMode, setIsFolderMode] = useState(false);
  const [examName, setExamName] = useState('');
  // When in exam mode, you may want to select a folder in which the exam is stored – adjust as needed.
  const [selectedFolder, setSelectedFolder] = useState(null);
  // This list simulates fetching available questions from your bank.
  const [availableQuestions, setAvailableQuestions] = useState([]);
  // The list of questions selected (or added) to be included in the exam.
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  // State for controlling the “create new question” modal
  const [isAddQuestionModalOpen, setIsAddQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  // Simulate fetching available questions when the component mounts.
  useEffect(() => {
    // Replace this with a real API call if needed.
    setAvailableQuestions([
      { id: 'q1', text: 'What is React?' },
      { id: 'q2', text: 'Explain the useState hook.' },
      { id: 'q3', text: 'What is Redux used for?' },
      // Add more questions as required...
    ]);
  }, []);

  // Drag-and-drop handler for reordering the selected questions
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(selectedQuestions);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setSelectedQuestions(reordered);
  };

  // Add an available question to the exam (ignores duplicates)
  const addQuestionToExam = (question) => {
    if (!selectedQuestions.find(q => q.id === question.id)) {
      setSelectedQuestions([...selectedQuestions, question]);
      toast.success('Question added.');
    } else {
      toast.info('This question is already selected.');
    }
  };

  // Remove a question from the exam by its ID.
  const removeQuestionFromExam = (questionId) => {
    setSelectedQuestions(selectedQuestions.filter(q => q.id !== questionId));
    toast.info('Question removed.');
  };

  // Handler for saving the exam or folder.
  const handleCreateExam = async () => {
    // Build your payload – adjust the fields to match your API.
    const examPayload = {
      name: examName,
      type: isFolderMode ? 'folder' : 'exam',
      folderId: selectedFolder ? selectedFolder._id : null,
      questions: !isFolderMode ? selectedQuestions.map(q => q.id) : []  // Only exams have questions
    };

    try {
      await postRouteAPI({ routeName: 'createExamHandler', ...examPayload });
      toast.success(isFolderMode ? 'Folder created successfully!' : 'Exam created successfully!');
      // Reset states after success
      setExamName('');
      setSelectedQuestions([]);
      setIsExamModalOpen(false);
    } catch (error) {
      if (error?.response?.status === 401) {
        await getNewToken();
        await postRouteAPI({ routeName: 'createExamHandler', ...examPayload });
        toast.success(isFolderMode ? 'Folder created successfully after token refresh!' : 'Exam created successfully after token refresh!');
        setExamName('');
        setSelectedQuestions([]);
        setIsExamModalOpen(false);
      } else {
        toast.error('An error occurred while creating the exam/folder.');
      }
    }
  };

  // Handler for when a new question is created in the modal.
  // You can optionally update your available questions list as needed.
  const handleNewQuestionCreated = (newQuestion) => {
    setAvailableQuestions(prev => [...prev, newQuestion]);
    addQuestionToExam(newQuestion);
    setIsAddQuestionModalOpen(false);
  };

  return (
    <div className={styles.simulationExamWrapper}>
      <h1>Simulation Exams</h1>
      <div className={styles.toolbar}>
        <button onClick={() => {
          setIsFolderMode(true);
          setIsExamModalOpen(true);
        }}>
          Add Folder
        </button>
        <button onClick={() => {
          setIsFolderMode(false);
          setIsExamModalOpen(true);
        }}>
          Add Exam
        </button>
      </div>

      {/* Exam/Folder Form Modal */}
      <Modal
        visible={isExamModalOpen}
        onCancel={() => setIsExamModalOpen(false)}
        footer={null}
        width={800}
      >
        <div className={styles.examForm}>
          <h2>{isFolderMode ? 'Add Folder' : 'Add Exam'}</h2>
          <div className={styles.formGroup}>
            <label>Name:</label>
            <input 
              type="text"
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              placeholder="Enter name"
            />
          </div>

          { !isFolderMode && (
            <>
              {/* Section for selecting an existing question */}
              <div className={styles.formGroup}>
                <h3>Available Questions</h3>
                <ul className={styles.availableQuestions}>
                  {availableQuestions.map((q) => (
                    <li key={q.id} className={styles.questionItem}>
                      <span>{q.text}</span>
                      <button onClick={() => addQuestionToExam(q)}>Add</button>
                    </li>
                  ))}
                </ul>
                <button 
                  className={styles.createQuestionButton}
                  onClick={() => {
                    setEditingQuestion(null);
                    setIsAddQuestionModalOpen(true);
                  }}
                >
                  Create New Question
                </button>
              </div>

              {/* Section for reordering the exam questions */}
              <div className={styles.formGroup}>
                <h3>Selected Questions (Drag to reorder)</h3>
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="selectedQuestions">
                    {(provided) => (
                      <ul
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={styles.selectedQuestionsList}
                      >
                        {selectedQuestions.map((question, index) => (
                          <Draggable key={question.id} draggableId={question.id} index={index}>
                            {(provided) => (
                              <li
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={styles.selectedQuestionItem}
                              >
                                <span>{question.text}</span>
                                <button 
                                  className={styles.removeQuestionButton}
                                  onClick={() => removeQuestionFromExam(question.id)}
                                >
                                  <AllIconsComponent iconName="cross" height={16} width={16} />
                                </button>
                              </li>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </ul>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
            </>
          )}

          <div className={styles.modalActions}>
            <button onClick={() => setIsExamModalOpen(false)}>Cancel</button>
            <button onClick={handleCreateExam}>
              {isFolderMode ? 'Create Folder' : 'Create Exam'}
            </button>
          </div>
        </div>
      </Modal>

      {/* The model for adding a new question */}
      {isAddQuestionModalOpen && (
        <ModelForAddQuestion
          isModelForAddQuestionOpen={isAddQuestionModalOpen}
          selectedQuestion={editingQuestion}
          selectedFolder={selectedFolder}
          // Optionally adjust getQuestionsList if required in your use-case
          getQuestionsList={() => {}}
          onCloseModal={() => setIsAddQuestionModalOpen(false)}
          existingItemName={availableQuestions.map(q => q.text)}
          // You can pass a callback for when a new question is created
          onSaveNewQuestion={handleNewQuestionCreated}  
        />
      )}
    </div>
  );
};

export default SimulationExamComponent;
