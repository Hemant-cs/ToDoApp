import axios from 'axios';
import {useEffect, useState} from "react"

const ToDoApp = ()=>{
    const [toDoList, settoDoList] = useState([]);
    const [editableId, setEditableId] = useState(''); //remove later
    const [editedTask, setEditedTask] = useState('');
    const [editedStatus, setEditedStatus] = useState('');
    const [editedDeadline, setEditedDeadline] = useState('');
    const [newTask, setNewTask] = useState('');
    const [newStatus, setNewStatus] = useState('');
    const [newDeadline, setNewDeadline]= useState('');

    //hooks
    useEffect(()=>{
        fetchToDoList();
    },[])

    //fetch list of to do
    const fetchToDoList = async () =>{
        try {
            let toDoList = await axios.get("http://localhost:8000"); //will return JSON Data
            // console.log(toDoList.data); //not needed
            settoDoList(toDoList.data);            
        } catch (error) {
            console.log("error occured while fetching list of to-do : "+error);
        }
    }

    //toDeleteTask
    const deleteTask = async (id)=>{
        try {
            let userAns = window.prompt("Type 'yes' to confirm your action");
            if(userAns.toLowerCase()== 'yes'){
                let deleteTask = await axios.delete(`http://localhost:8000/removeTask/${id}`);
                console.log(deleteTask);
                if(deleteTask.status) {
                    window.alert(deleteTask.data.message);
                    await fetchToDoList();
                }
            }else{
                userAns = window.alert("kindly! Type 'yes' to confirm your action or Click on cancel");
            }
        } catch (error) {
            console.log("Error while Deleting Task : "+error);
        }
    }

    //for Edit details
    const editDetails = (data) =>{
        if(data._id == ''){
            setEditedTask('');
            setEditedStatus('');
            setEditedDeadline('');
        }else{
            setEditableId(data._id);
            setEditedTask(data.task);   
            setEditedStatus(data.status);  
            setEditedDeadline(data.deadline);
        } 
    }

    //for updating details
    const updateDetails = async(data)=>{
        try {
            const payload = {
                task : editedTask ? editedTask : data.task,
                status : editedStatus ? editedStatus : data.status ,
                deadline : editedDeadline ? editedDeadline : data.deadline
            }
            console.log("EndPoint : "+`http://localhost:8000/update/${data._id}`+" payload : "+JSON.stringify(payload));
            let updatedData = await axios.put(`http://localhost:8000/update/${data._id}`,payload);
            if(updatedData.status == 200){
                window.alert(updatedData.data.message);
                editDetails('');
                await fetchToDoList();
            }
            console.log(updatedData);
        } catch (error) {
            console.log("Error while updating data : "+error);
        }
    }

    //for adding new details

    const addNewDetails = async (event) =>{
        try {
            const payload = {
                task : newTask,
                status : newStatus,
                deadline : newDeadline
            }
            console.log("payload for add details : "+ JSON.stringify(payload));
            const addDetails = await axios.post("http://localhost:8000/addTask",payload);
            if(addDetails.status == '200'){
                window.alert(addDetails.data.message);
                await fetchToDoList();
            }
        } catch (error) {
            console.log("Error while updating data : "+error);
        }
    }

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-7">
                    <h2 className="text-center">Todo List</h2>
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead className="table-primary">
                                <tr>
                                    <th>Task</th>
                                    <th>Status</th>
                                    <th>Deadline</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            {Array.isArray(toDoList) ? (
                                <tbody>
                                    {toDoList.map((data) => (
                                        <tr key={data._id}>
                                            <td>
                                                {editableId === data._id ? (
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={editedTask}
                                                        onChange={(e) => setEditedTask(e.target.value)}
                                                    />
                                                ) : (
                                                    data.task
                                                )}
                                            </td>
                                            <td>
                                                {editableId === data._id ? (
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={editedStatus}
                                                        onChange={(e) => setEditedStatus(e.target.value)}
                                                    />
                                                ) : (
                                                    data.status
                                                )}
                                            </td>
                                            <td>
                                                {editableId === data._id ? (
                                                    <input
                                                        type="datetime-local"
                                                        className="form-control"
                                                        value={editedDeadline}
                                                        onChange={(e) => setEditedDeadline(e.target.value)}
                                                    />
                                                ) : (
                                                    data.deadline ? new Date(data.deadline).toLocaleString() : ''
                                                )}
                                            </td>

                                            <td>
                                                {editableId === data._id ? (
                                                    <>
                                                        <button className="btn btn-success btn-sm" onClick={()=>updateDetails(data)}>
                                                            Save
                                                        </button>
                                                        <button className="btn btn-danger btn-sm ml-1" onClick={()=>editDetails('')} >
                                                            cancel
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button className="btn btn-primary btn-sm" onClick={()=>editDetails(data)} >
                                                            Edit
                                                        </button>
                                                        <button className="btn btn-danger btn-sm ml-1"  onClick={()=>deleteTask(data._id)}>
                                                            Delete
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            ) : (
                                <tbody>
                                    <tr>
                                        <td colSpan="4">Loading products...</td>
                                    </tr>
                                </tbody>
                            )}


                        </table>
                    </div>
                </div>
                <div className="col-md-5">
                    <h2 className="text-center">Add Task</h2>
                    <form className="bg-light p-4">
                        <div className="mb-3">
                            <label>Task</label>
                            <input
                                className="form-control"
                                type="text"
                                placeholder="Enter Task"
                                onChange={(e) => setNewTask(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label>Status</label>
                            <input
                                className="form-control"
                                type="text"
                                placeholder="Enter Status"
                                onChange={(e) => setNewStatus(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label>Deadline</label>
                            <input
                                className="form-control"
                                type="datetime-local"
                                onChange={(e) => setNewDeadline(e.target.value)}
                            />
                        </div>
                        <button className="btn btn-success btn-sm" disabled = {!newTask} onClick={e=>addNewDetails(e)}> 
                            Add Task
                        </button>
                    </form>
                </div>

            </div>
        </div>
    )
}

export default ToDoApp;