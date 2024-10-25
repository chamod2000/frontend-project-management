import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CBadge, CButton, CCol, CContainer, CFormInput, CFormSelect, CModal, CModalBody, CModalHeader, CModalTitle, CNavbar, CSpinner, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react';
import './TaskList.css';
import { Link } from 'react-router-dom';
import { cilPencil, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react';
import '@coreui/coreui/dist/css/coreui.min.css'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const TaskList = () => {
  const [tasksData, setTasksData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [id, setId] = useState(null);
  const [task, setTask] = useState({});

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('');
  const [deadline, setDeadline] = useState(task ? new Date(task.deadline) : new Date());

  const [visibleRegistration, setVisibleRegistration] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: '',
    status: '',
    deadline: new Date()

  });


  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    setLoading(true);
    axios.get('http://127.0.0.1:8000/api/tasks')
      .then(response => {
        console.log(response.data.tasks)
        if (Array.isArray(response.data.tasks)) {
          setTasksData(response.data.tasks);
        } else {
          console.error('Unexpected data format:', response.data);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Something went wrong', error);
        setLoading(false);
      });
  }

  const handleEdit = (item) => {
    setVisible(true);
    console.log(item.id);
    setTask(item);
    setTitle(item.title);
    setDescription(item.description);
    setPriority(item.priority);
    setStatus(item.status);
    setDeadline(item.deadline);

  }

  const handleDelete = (id) => {
    setVisibleDelete(true);
    console.log(id);
    setId(id);
  }

  const handleDeleteTask = (id) => {
    if (id) {
      console.log(id);
      axios.delete(`http://127.0.0.1:8000/api/tasks/5`)
        .then(response => {
          console.log(response.data);
          loadTasks();
        })
        .catch(error => {
          console.error('Something went wrong', error);
          alert('Something went wrong');
          setVisibleDelete(true);
        });
    } else {
      alert('Task not id found');
    }
  }

  const handleUpdateTask = (id) => {
    if (id) {
      console.log(id);
      if(!title || !description || !priority || !status || !deadline) {
        alert('All fields are required');
      }else{
        const formattedDeadline = new Date(deadline).toISOString().split('T')[0];
        const data = {
          title: title,
          description: description,
          priority: priority,
          status: status,
          deadline: formattedDeadline
        };
        console.log(data);
          axios.put(`http://127.0.0.1:8000/api/tasks/${id}`, data)
            .then(response => {
              console.log(response.data);
              loadTasks();
            })
            .catch(error => {
              console.error('Something went wrong', error);
              alert('Something went wrong');
            });
      }
     
    } else {
      alert('Task not id found');
    }
  }

  const handleRegistration = () => {
    setVisibleRegistration(true);
  };

  const handleAddTask = () => {
    if(!newTask.title || !newTask.description || !newTask.priority || !newTask.status || !newTask.deadline) {
      alert('All fields are required');
    }else{
      const formattedDeadline = new Date(newTask.deadline).toISOString().split('T')[0];
      const data = {
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        status: newTask.status,
        deadline: formattedDeadline
      };

      axios.post('http://127.0.0.1:8000/api/tasks', data)
      .then((response) => {
        if (response.status === 201) {
          alert('Task added successfully');
          loadTasks();
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 422) {
          alert('Validation failed: ' + JSON.stringify(error.response.data.message));
        } else {
          alert('An error occurred while adding the task.');
        }
      });
    }
    
  }

  return (
    <CContainer>
      <CNavbar style={{ marginTop: '1%' }} className="bg-body-tertiary">
        <h5>Project Management Dashboard</h5>
        <CButton onClick={()=>{handleRegistration()}} style={{backgroundColor:"#ff4d4d", color:"white", marginRight:"1%"}}>Add New Task</CButton>
      </CNavbar>

      {loading ? (
        <CSpinner />
      ) : (
        <CTable>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">Id</CTableHeaderCell>
              <CTableHeaderCell scope="col">Title</CTableHeaderCell>
              <CTableHeaderCell scope="col">Description</CTableHeaderCell>
              <CTableHeaderCell scope="col">Deadline</CTableHeaderCell>
              <CTableHeaderCell scope="col">Priority</CTableHeaderCell>
              <CTableHeaderCell scope="col">Status</CTableHeaderCell>
              <CTableHeaderCell scope="col">Edit</CTableHeaderCell>
              <CTableHeaderCell scope="col">Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {tasksData.map((item, index) => (
              <CTableRow key={index}>
                <CTableDataCell>{item.id}</CTableDataCell>
                <CTableDataCell>{item.title}</CTableDataCell>
                <CTableDataCell>{item.description}</CTableDataCell>
                <CTableDataCell>{item.deadline}</CTableDataCell>
                <CTableDataCell>{item.priority === 'Medium' ? <CBadge color="warning">{item.priority}</CBadge> : item.priority === 'High' ? <CBadge color="danger">{item.priority}</CBadge> : <CBadge color="info">{item.priority}</CBadge>}</CTableDataCell>
                <CTableDataCell><CBadge color="secondary">{item.status}</CBadge></CTableDataCell>
                <CTableDataCell>
                  <Link>
                    <CIcon icon={cilPencil} size='xl' onClick={() => { handleEdit(item) }} />
                  </Link>
                </CTableDataCell>
                <CTableDataCell>
                  <CButton size='sm' style={{ backgroundColor: '#ff4d4d' }} variant="outline" onClick={() => { handleDelete(item.id) }}>
                    <CIcon icon={cilTrash} size='lg' style={{ color: 'white' }} />
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      )}

      <CModal visible={visible} scrollable size="lg" onClose={() => setVisible(false)} transition="fade">
        <CModalHeader closeButton>
          <CModalTitle>Edit Task Information</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="row g-3 align-items-center">
            <CCol md={6}>
              <CFormInput
                id="title"
                label="Title"
                defaultValue={title}
                required
                onChange={(e) => setTitle(e.target.value)}
              />
            </CCol>
            <CCol md={6}>
              <CFormInput
                id="description"
                label="Description"
                defaultValue={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </CCol>

            <CCol md={6}>
              <CFormSelect
                id="status"
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option>Not Started</option>
                <option>In Progress</option>
                <option>Completed</option>
              </CFormSelect>
            </CCol>
            <CCol md={6}>
              <CFormSelect
                id="priority"
                label="Priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </CFormSelect>
            </CCol>
            <CCol md={6}>
              <DatePicker
                selected={new Date(deadline)}
                onChange={(date) => setDeadline(date)}
                dateFormat="yyyy-MM-dd"
              />
            </CCol>
            <CCol xs={12}>
              <CButton style={{ marginBottom: '3%', width: '200px', backgroundColor: '#ff4d4d', color: 'white' }} onClick={() => handleUpdateTask(task.id)}>
                Update Task
              </CButton>
            </CCol>
          </div>
        </CModalBody>
      </CModal>

      <CModal alignment="center" visible={visibleDelete} scrollable size='sm' onClose={() => setVisibleDelete(false)}>
        <CModalHeader>
          <CModalTitle>Confirmation</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>Are you sure you want to delete this task?</p>
          <div style={{ display: "flex", justifyContent: 'center' }}>
            <CButton onClick={() => handleDeleteTask(id)} style={{ backgroundColor: '#ff4d4d', color: 'white', marginRight: '10px' }} >Yes</CButton>
            <CButton onClick={() => setVisibleDelete(false)} style={{ backgroundColor: '#ff4d4d', color: 'white', marginLeft: '10px' }} >No</CButton>
          </div>
        </CModalBody>
      </CModal>


      <CModal visible={visibleRegistration} scrollable size="lg" onClose={() => setVisibleRegistration(false)} transition="fade">
        <CModalHeader closeButton>
          <CModalTitle>Add Task</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="row g-3 align-items-center">
            <CCol md={6}>
              <CFormInput
                id="title"
                label="Title"
                defaultValue={newTask.title}
                required
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
            </CCol>
            <CCol md={6}>
              <CFormInput
                id="description"
                label="Description"
                defaultValue={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
            </CCol>

            <CCol md={6}>
              <CFormSelect
                id="status"
                label="Status"
                value={newTask.status}
                onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
              >
                <option>Not Started</option>
                <option>In Progress</option>
                <option>Completed</option>
              </CFormSelect>
            </CCol>
            <CCol md={6}>
              <CFormSelect
                id="priority"
                label="Priority"
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </CFormSelect>
            </CCol>
            <CCol md={6}>
              <DatePicker
                selected={new Date(newTask.deadline)}
                onChange={(date) => setNewTask({ ...newTask, deadline: date })}
                dateFormat="yyyy-MM-dd"
              />
            </CCol>
            <CCol xs={12}>
              <CButton style={{ marginBottom: '3%', width: '200px', backgroundColor: '#ff4d4d', color: 'white' }} onClick={() => handleAddTask()}>
                Add Task
              </CButton>
            </CCol>
          </div>
        </CModalBody>
      </CModal>


    </CContainer>
  );
};

export default TaskList
