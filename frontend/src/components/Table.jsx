import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { FaPlus, FaTrash, FaCheck, FaX } from "react-icons/fa6";
import { AiFillEdit } from "react-icons/ai";
import Loading from './Loading';

const property = {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "light",
}
export default function Table() {
    const [todo, setTodo] = useState("");
    const [listTodo, setListTodo] = useState([]);
    const [perPage, setPerPage] = useState(4);
    const [isEdit, setIsEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [valueId, setValueId] = useState(null);
    const fetchData = () => {
        try {
            setLoading(true);
            setTimeout(async () => {
                let res = await axios.get(`http://localhost:8000/api/v1/todos?per_page=${perPage}`);
                setListTodo(res.data.data);
                setLoading(false)
            }, 2000)
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        fetchData();
    }, [])
    const handleAdd = async () => {
        if (todo.length <= 0) {
            toast.error("You must write anything", property);
        } else {
            try {
                let res;
                if (!isEdit) {
                    res = await axios.post("http://localhost:8000/api/v1/todos", {
                        title: todo,
                        id: Math.floor(Math.random() * 999),
                        completed: false
                    });
                } else {
                    let userById = listTodo.find(e => e.id == valueId);
                    res = await axios.put(`http://localhost:8000/api/v1/todos/${valueId}`, {
                        ...userById,
                        title: todo
                    })
                    setIsEdit(false);
                }
                setListTodo(res.data.data);
                toast.success(res.data.message, property);
                setTodo('');

            } catch (error) {
                toast.error(error.response.data.message, property);
            }
        }
    }
    const handleComplete = async (id) => {
        try {
            let userById = listTodo.find(e => e.id == id);
            let res = await axios.put(`http://localhost:8000/api/v1/todos/${id}`, {
                ...userById,
                completed: !userById.completed
            });
            setListTodo(res.data.data);
            toast.success("Change status successfully", property);
        } catch (error) {
            console.log(error);
        }
    }
    const handleEdit = (value) => {
        setTodo(value.title);
        setIsEdit(true);
        setValueId(value.id);
    }
    const handleDelete = async (id) => {
        try {
            let res = await axios.delete(`http://localhost:8000/api/v1/todos/${id}`);
            setListTodo(res.data.data);
            toast.success(res.data.message, property);
        } catch (error) {
            console.log(error);
        }
    }
    const handleDeleteAll = async () => {
        let confirm = window.confirm("Delete all data ?");
        if (confirm && listTodo.length > 0) {
            try {
                let res = await axios.delete('http://localhost:8000/api/v1/todos');
                setListTodo(res.data.data);
                toast.success(res.data.message, property);
            } catch (error) {
                console.log(error);
            }
        } else if (!confirm) {

        } else {
            toast.warning('Not having any data to delete', property);
        }
    }
    return (
        <>
            <div className='bg-indigo-200' style={{ minHeight: '732px' }}>
                <div className='flex justify-center items-center py-12'>
                    <div className='bg-white p-4 '>
                        <strong className='text-2xl'>Todo App</strong>
                        <div className='flex mt-6 gap-1.5 mb-3 w-full'>
                            <input type="text" className='border border-slate-400 rounded px-2 py-1 w-10/12' placeholder='Add your new todo' value={todo} onChange={(e) => setTodo(e.target.value)} />
                            <button className=' bg-violet-500 rounded w-2/12 flex justify-center' onClick={handleAdd}><FaPlus className='text-white' /></button>
                        </div>
                        <div className='flex flex-col gap-y-2'>
                            {listTodo.length > 0 && listTodo.slice(0, perPage).map((e, i) => (
                                <div className='flex justify-between bg-slate-200 gap-10' key={e.id}>
                                    <div className='py-2 px-3' style={{ textDecoration: e.completed ? 'line-through' : '' }} >{e.title}</div>
                                    <div className='flex'>
                                        <button onClick={() => handleComplete(e.id)} className={!e.completed ? 'bg-green-400' : 'bg-slate-50'}>{e.completed ? <FaX /> : <FaCheck />}</button>
                                        <button onClick={() => handleEdit(e)} className='bg-yellow-200' style={{ display: e.completed ? 'none' : 'block' }}  ><AiFillEdit /></button>
                                        <button onClick={() => handleDelete(e.id)} className='bg-red-500'><FaTrash className='text-white' /></button>
                                    </div>
                                </div>
                            ))}
                            {loading && <div>
                                <div className='mb-4 text-center'>Data is loading...</div>
                                <Loading />
                            </div>}
                        </div>
                        <div className='flex justify-between mt-4 items-center'>
                            <div>You have {listTodo.filter(e => !e.completed).length} pending tasks</div>
                            <button className='bg-violet-500 text-white' onClick={handleDeleteAll}>Clear All</button>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    )
}
