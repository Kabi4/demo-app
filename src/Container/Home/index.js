import React, { useEffect, useState } from 'react';
// import { NavLink } from 'react-router-dom';
// import classes from './style.module.css';
import { local_url } from '../../localUrl';
import './style.css';
import Spinner from '../../Utils/Spinner/Index';
import Modal from '../../Utils/popupModal';

import { Task } from '../../Components/index';
import axios from 'axios';
import { connect } from 'react-redux';
import DatePicker from 'react-date-picker';

import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TimePicker from 'react-time-picker';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

const Index = ({ ...props }) => {
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [prevtasks, setPrevTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [value, onChange] = useState(`${new Date(Date.now()).getHours()}:${new Date(Date.now()).getMinutes()}`);
    const [taskDetails, setTaskDetails] = useState({
        date: new Date(Date.now()),
        assigendTo: '',
        description: '',
    });

    const classes = useStyles();

    const changehanlder = (type, value) => {
        setTaskDetails((prev) => {
            const old = { ...prev };
            old[type] = value;
            return old;
        });
    };

    useEffect(() => {
        (async () => {
            await axios
                .get(
                    `${local_url}/task/lead_6996a7dcdddc4af3b4f71ccb985cea38`,

                    {
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${props.token}`,
                        },
                    }
                )
                .then((res) => {
                    setPrevTasks([...res.data.results]);
                    setLoading(false);
                    return axios.get(`${local_url}/team`, {
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${props.token}`,
                        },
                    });
                })
                .then((res) => {
                    setUsers([
                        ...res.data.results.data
                            .filter((ele) => ele.user_status === 'accepted')
                            .map((ele) => {
                                return {
                                    name: ele.name,
                                    value: ele.user_id,
                                };
                            }),
                    ]);
                })
                .catch((err) => {
                    alert('Check Your network and reload!');
                });
        })();
    }, [props.token]);
    const onAddHandler = async (e) => {
        e.preventDefault();
        setLoading((prev) => !prev);
        if (taskDetails.description === '' || taskDetails.assigendTo === '') {
            alert('Assigned User and Description cannot be empty');
            setLoading((prev) => !prev);
            return;
        } else {
            await axios
                .post(
                    `${local_url}/task/lead_6996a7dcdddc4af3b4f71ccb985cea38`,
                    {
                        assigned_user: taskDetails.assigendTo,
                        task_date: `${new Date(taskDetails.date).getFullYear()}-${
                            new Date(taskDetails.date).getMonth() + 1
                        }-${new Date(taskDetails.date).getDate()}`,
                        task_time:
                            new Date(
                                `${new Date(taskDetails.date).getFullYear()}-${
                                    new Date(taskDetails.date).getMonth() + 1
                                }-${new Date(taskDetails.date).getDate()} ${value}:00`
                            ).getTime() / 1000,
                        is_completed: 0,
                        time_zone: 3000,
                        task_msg: taskDetails.description,
                    },
                    {
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${props.token}`,
                        },
                    }
                )
                .then((res) => {
                    setLoading((prev) => !prev);
                    console.log(res);
                    console.log({
                        assigned_user: taskDetails.assigendTo,
                        task_date: `${new Date(taskDetails.date).getFullYear()}-${
                            new Date(taskDetails.date).getMonth() + 1
                        }-${new Date(taskDetails.date).getDate()}`,
                        task_time:
                            new Date(
                                `${new Date(taskDetails.date).getFullYear()}-${
                                    new Date(taskDetails.date).getMonth() + 1
                                }-${new Date(taskDetails.date).getDate()} ${value}:00`
                            ).getTime() / 1000,
                        is_completed: 0,
                        time_zone: 3000,
                        task_msg: taskDetails.description,
                    });

                    if (res.data.code !== 500) {
                        setPrevTasks((prev) => {
                            return [
                                ...prev,
                                {
                                    description: taskDetails.description,
                                    userid: taskDetails.assigendTo,
                                    assignedto: 'Subi Sir',
                                    created: `${new Date(taskDetails.date).getMonth() + 1}/${new Date(
                                        taskDetails.date
                                    ).getDate()}/${new Date(taskDetails.date).getFullYear()} ${value}:00`,
                                    id: -1,
                                },
                            ];
                        });
                        alert(`Task Added!`);
                        setTaskDetails({
                            date: new Date(Date.now()),
                            assigendTo: '',
                            description: '',
                        });
                        setModal((prev) => !prev);
                    } else {
                        alert('Something went wrong please try again!');
                    }
                })
                .catch((err) => {
                    setLoading((prev) => !prev);
                    alert('Please try again!');
                });
        }
    };
    const taskDeleted = (index) => {
        setPrevTasks((prev) => {
            const old = [...prev];
            old.splice(index, 1);
            return old;
        });
    };
    return (
        <>
            <Modal
                style={{ maxWidth: '50rem' }}
                state={modal}
                setStateFalse={() => {
                    setModal(false);
                }}
            >
                <div style={{ backgroundColor: 'white', borderRadius: '1rem', border: '1px solid black' }}>
                    <h2 style={{ borderRadius: ' 1rem 1rem 0 0', padding: '1rem' }} className="heading_primary">
                        Add A Task
                    </h2>
                    <div style={{ maxWidth: '50rem', borderRadius: '0 0 1rem 1rem', border: 'none' }} className="task">
                        <p>Task Description</p>
                        <input
                            className="task_input"
                            value={taskDetails.description}
                            onChange={(e) => {
                                changehanlder('description', e.target.value);
                            }}
                        />
                        <p>Task Assigned Date & Time: </p>
                        <div className="date-time">
                            <DatePicker
                                onChange={(value) => {
                                    changehanlder('date', value);
                                }}
                                value={taskDetails.date}
                            />
                            <TimePicker onChange={onChange} value={value} />
                        </div>
                        <p>Task Assigned To: </p>
                        <FormControl className={`${classes.formControl} task_select`}>
                            <InputLabel htmlFor="user-native-simple">Assigned To: </InputLabel>
                            <Select
                                native
                                value={taskDetails.assigendTo}
                                onChange={(e) => {
                                    changehanlder('assigendTo', e.target.value);
                                }}
                                inputProps={{
                                    name: 'user',
                                    id: 'user-native-simple',
                                }}
                            >
                                <option aria-label="None" value="" />

                                {users.map((ele) => (
                                    <option key={ele.value} value={ele.value}>
                                        {ele.name}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>
                        <button onClick={onAddHandler} style={{ margin: '1rem auto' }} className="btn-primary">
                            Add Task
                        </button>
                    </div>
                </div>
            </Modal>
            {loading && <Spinner />}
            <button style={{ margin: '1rem auto' }} onClick={() => setModal((prev) => !prev)} className="btn-primary">
                Add Task
            </button>
            <div className="tasks">
                {prevtasks.map((ele, i) => (
                    <Task
                        toggleLoading={() => {
                            setLoading((prev) => !prev);
                        }}
                        description={ele.task_msg}
                        key={ele.id}
                        assignedto={ele.assigned_user}
                        created={ele.created}
                        id={ele.id}
                        userid={ele.user_id}
                        users={users}
                        taskDeleted={() => {
                            taskDeleted(i);
                        }}
                    />
                ))}
            </div>
        </>
    );
};

const mapStateToProps = (state) => {
    return {
        token: state.authReducer.token,
    };
};

export default connect(mapStateToProps, null)(Index);
