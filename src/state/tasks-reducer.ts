import {TasksStateType} from '../App';
import {AddTodolistActionType, RemoveTodolistActionType, setTodolistsAC} from './todolists-reducer';
import {TaskStatuses, TaskType, todolistsAPI, TodolistType, UpdateTaskModelType} from '../api/todolists-api'
import {Dispatch} from "redux";
import {AppRootStateType} from "./store";

export type RemoveTaskActionType = {
    type: 'REMOVE-TASK',
    todolistId: string
    taskId: string
}
export type AddTaskActionType = {
    type: 'ADD-TASK',
    task: TaskType
}
export type ChangeTaskStatusActionType = {
    type: 'CHANGE-TASK-STATUS',
    todolistId: string
    taskId: string
    status: TaskStatuses
}
export type ChangeTaskTitleActionType = {
    type: 'CHANGE-TASK-TITLE',
    todolistId: string
    taskId: string
    title: string
}
export type SetTodolistsActionType = {
    type: 'SET-TODOLISTS'
    todolists: Array<TodolistType>
}

export type SetTasksActionType = ReturnType<typeof setTasksAC>;


type ActionsType = RemoveTaskActionType | AddTaskActionType
    | ChangeTaskStatusActionType
    | ChangeTaskTitleActionType
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistsActionType
    | SetTasksActionType


const initialState: TasksStateType = {}


export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
    switch (action.type) {

        case 'SET-TASKS': {
            const stateCopy2 = {...state}
            stateCopy2[action.todolistId] = action.tasks
            return stateCopy2
        }
        case 'SET-TODOLISTS': {
            const stateCopy1 = {...state};
            action.todolists.forEach((tl) => {
                stateCopy1[tl.id] = []
            })
            return stateCopy1;
        }
        case 'REMOVE-TASK': {
            const stateCopy = {...state}
            const tasks = stateCopy[action.todolistId];
            const newTasks = tasks.filter(t => t.id !== action.taskId);
            stateCopy[action.todolistId] = newTasks;
            return stateCopy;
        }
        case 'ADD-TASK': {
            debugger
            const stateCopy = {...state}
            const tasks = stateCopy[action.task.todoListId];
            const newTasks = [action.task, ...tasks];
            stateCopy[action.task.todoListId] = newTasks;
            return stateCopy;
        }
        case 'CHANGE-TASK-STATUS': {
            let todolistTasks = state[action.todolistId];
            let newTasksArray = todolistTasks
                .map(t => t.id === action.taskId ? {...t, status: action.status} : t);

            state[action.todolistId] = newTasksArray;
            return ({...state});
        }
        case 'CHANGE-TASK-TITLE': {
            let todolistTasks = state[action.todolistId];
            // найдём нужную таску:
            let newTasksArray = todolistTasks
                .map(t => t.id === action.taskId ? {...t, title: action.title} : t);

            state[action.todolistId] = newTasksArray;
            return ({...state});
        }
        case 'ADD-TODOLIST': {
            return {
                ...state,
                [action.todolistId]: []
            }
        }
        case 'REMOVE-TODOLIST': {
            const copyState = {...state};
            delete copyState[action.id];
            return copyState;
        }
        default:
            return state;
    }
}

export const removeTaskAC = (taskId: string, todolistId: string): RemoveTaskActionType => {
    return {type: 'REMOVE-TASK', taskId: taskId, todolistId: todolistId}
}
export const addTaskAC = (task: TaskType): AddTaskActionType => {
    return {type: 'ADD-TASK', task}
}
export const changeTaskStatusAC = (taskId: string, status: TaskStatuses, todolistId: string): ChangeTaskStatusActionType => {
    return {type: 'CHANGE-TASK-STATUS', status, todolistId, taskId}
}
export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string): ChangeTaskTitleActionType => {
    return {type: 'CHANGE-TASK-TITLE', title, todolistId, taskId}
}

export const setTasksAC = (tasks: Array<TaskType>, todolistId: string) => {
    return {type: 'SET-TASKS', tasks, todolistId} as const
}


//THUNK
export const fetchTasksTC = (todolistId: string) => {
    return (dispatch: Dispatch) => {
        todolistsAPI.getTasks(todolistId).then((res) => {
            dispatch(setTasksAC(res.data.items, todolistId))

        })
    }
}

export const removeTaskTC = (taskId: string, todolistId: string) => (dispatch: Dispatch) => {
    todolistsAPI.deleteTask(todolistId, taskId)
        .then((res) => {
            dispatch(removeTaskAC(taskId, todolistId))
        })
}

export const addTaskTC = (todolistId: string, taskTitle: string) => (dispatch: Dispatch) => {
    todolistsAPI.createTask(todolistId, taskTitle).then((res) => {
        let task = res.data.data.item;
        dispatch(addTaskAC(task))

    })
}

export const updateTaskStatusTC = (todolistId: string, taskId: string, status: TaskStatuses) => (dispatch: Dispatch, getState: () => AppRootStateType) => {
    const appState = getState();
    const allTasks = appState.tasks;
    const tasksForClickedTodo = allTasks[todolistId];
    const clickedTask = tasksForClickedTodo.find((t) => {
        return t.id === taskId
    })
    if (clickedTask) {
        const model: UpdateTaskModelType = {
            title: clickedTask.title,
            status,
            priority: clickedTask.priority,
            description: clickedTask.description,
            startDate: clickedTask.startDate,
            deadline: clickedTask.deadline
        }
        todolistsAPI.updateTask(todolistId, taskId, model).then((res) => {
            dispatch(changeTaskStatusAC(taskId, status, todolistId));

        })
    }
}

