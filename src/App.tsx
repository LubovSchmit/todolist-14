import React, {useCallback, useEffect} from 'react'
import './App.css';
import {Todolist} from './Todolist';
import {AddItemForm} from './AddItemForm';
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from '@material-ui/core';
import {Menu} from '@material-ui/icons';
import {
    addTodolistAC,
    changeTodolistFilterAC,
    changeTodolistTitleAC, fetchTodolistsTC,
    FilterValuesType,
    removeTodolistAC,
    TodolistDomainType
} from './state/todolists-reducer'
import {
    addTaskAC,
    addTaskTC,
    changeTaskStatusAC,
    changeTaskTitleAC,
    removeTaskAC,
    removeTaskTC, updateTaskStatusTC
} from './state/tasks-reducer';
import {useDispatch, useSelector} from 'react-redux';
import {AppRootStateType} from './state/store';
import {TaskStatuses, TaskType, todolistsAPI} from './api/todolists-api'


export type TasksStateType = {
    [key: string]: Array<TaskType>
}


function App() {

    useEffect(() => {
        dispatch(fetchTodolistsTC())

    }, [])

    const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
    const dispatch = useDispatch();
    const removeTask = useCallback(function (id: string, todolistId: string) {
        /*const action = removeTaskAC(id, todolistId);*/
        dispatch(removeTaskTC(id, todolistId));
    }, []);
    const addTask = useCallback(function (title: string, todolistId: string) {
        dispatch(addTaskTC(todolistId, title));
    }, []);
    const changeStatus = useCallback(function (id: string, status: TaskStatuses, todolistId: string) {
        /*const action = changeTaskStatusAC(id, status, todolistId);*/
        dispatch(updateTaskStatusTC(todolistId, id, status));
    }, []);
    const changeTaskTitle = useCallback(function (id: string, newTitle: string, todolistId: string) {
        const action = changeTaskTitleAC(id, newTitle, todolistId);
        dispatch(action);
    }, []);
    const changeFilter = useCallback(function (value: FilterValuesType, todolistId: string) {
        const action = changeTodolistFilterAC(todolistId, value);
        dispatch(action);
    }, []);
    const removeTodolist = useCallback(function (id: string) {
        const action = removeTodolistAC(id);
        dispatch(action);
    }, []);
    const changeTodolistTitle = useCallback(function (id: string, title: string) {
        const action = changeTodolistTitleAC(id, title);
        dispatch(action);
    }, []);
    const addTodolist = useCallback((title: string) => {
        const action = addTodolistAC(title);
        dispatch(action);
    }, [dispatch]);

    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            <Container fixed>
                <Grid container style={{padding: "20px"}}>
                    <AddItemForm addItem={addTodolist}/>
                </Grid>
                <Grid container spacing={3}>
                    {
                        todolists.map(tl => {
                            let allTodolistTasks = tasks[tl.id];

                            return <Grid item key={tl.id}>
                                <Paper style={{padding: "10px"}}>
                                    <Todolist
                                        id={tl.id}
                                        title={tl.title}
                                        tasks={allTodolistTasks}
                                        removeTask={removeTask}
                                        changeFilter={changeFilter}
                                        addTask={addTask}
                                        changeTaskStatus={changeStatus}
                                        filter={tl.filter}
                                        removeTodolist={removeTodolist}
                                        changeTaskTitle={changeTaskTitle}
                                        changeTodolistTitle={changeTodolistTitle}
                                    />
                                </Paper>
                            </Grid>
                        })
                    }
                </Grid>
            </Container>
        </div>
    );
}

export default App;
