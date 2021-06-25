import React, { useEffect, useRef, useState } from 'react';
// import { NavLink } from 'react-router-dom';
// import classes from './style.module.css';
import { local_url } from '../../localUrl';
import './style.css';
import Spinner from '../../Utils/Spinner/Index';
import DateRangeIcon from '@material-ui/icons/DateRange';
import { Task } from '../../Components/index';
import axios from 'axios';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import { makeStyles } from '@material-ui/core/styles';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import AddIcon from '@material-ui/icons/Add';
import { CSSTransition } from 'react-transition-group';
import RemoveIcon from '@material-ui/icons/Remove';
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';
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
    const [value, onChange] = useState(`07:00`);
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
                        task_time: value,
                        is_completed: 0,
                        time_zone: 3000,
                        task_msg: taskDetails.description,
                    });

                    if (res.data.code !== 500) {
                        setPrevTasks((prev) => {
                            return [
                                ...prev,
                                {
                                    task_msg: taskDetails.description,
                                    user_id: taskDetails.assigendTo,
                                    assigned_user: 'Subi Sir',
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
                        setPrevTasks((prev) => {
                            return [
                                ...prev,
                                {
                                    task_msg: taskDetails.description,
                                    user_id: taskDetails.assigendTo,
                                    assigned_user: 'Subi Sir',
                                    created: `${new Date(taskDetails.date).getMonth() + 1}/${new Date(
                                        taskDetails.date
                                    ).getDate()}/${new Date(taskDetails.date).getFullYear()} ${value}:00`,
                                    id: -1,
                                },
                            ];
                        });
                        setTaskDetails({
                            date: new Date(Date.now()),
                            assigendTo: '',
                            description: '',
                        });
                        alert('Since the api is not properly working!We added the task in front end!');
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
            {loading && <Spinner />}

            <div className="add_task">
                <div className="add_task_header">
                    <p className="add_task_heading">
                        Tasks &nbsp;<span style={{ color: '#cdcdcd' }}>{prevtasks.length}</span>
                    </p>
                    {modal ? (
                        <RemoveIcon
                            onClick={(e) => {
                                setModal((prev) => !prev);
                            }}
                            className="task_head_icon"
                        />
                    ) : (
                        <AddIcon
                            onClick={(e) => {
                                setModal((prev) => !prev);
                            }}
                            className="task_head_icon"
                        />
                    )}
                </div>
                <CSSTransition
                    in={modal}
                    mountOnEnter
                    unmountOnExit
                    timeout={{
                        enter: 50,
                        exit: 200,
                    }}
                    classNames="open"
                >
                    <div className="add_task_body">
                        <div>
                            <p>Task Description</p>
                            <input
                                className="task_input"
                                value={taskDetails.description}
                                onChange={(e) => {
                                    changehanlder('description', e.target.value);
                                }}
                                placeholder="Enter Task"
                            />
                        </div>
                        <div className="display_flex">
                            <div style={{ position: 'relative' }}>
                                <p>Date</p>
                                <label>
                                    <DatePicker
                                        className="filter_date_picker"
                                        placeholderText="Start Date"
                                        selected={taskDetails.date}
                                        onChange={(date) => {
                                            changehanlder('date', date);
                                            return;
                                        }}
                                    />
                                    <DateRangeIcon className="date-cion" />
                                </label>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <p>Time</p>
                                <label>
                                    <FormControl className={`${classes.formControl} time task_select`}>
                                        <Select
                                            native
                                            value={value}
                                            onChange={(e) => {
                                                onChange(e.target.value);
                                            }}
                                            inputProps={{
                                                name: 'user',
                                                id: 'user-native-simple',
                                            }}
                                        >
                                            {Array.from(Array(48).keys()).map((ele, i) => (
                                                <option
                                                    key={i}
                                                    value={`${i < 20 ? '0' : ''}${i % 2 === 0 ? i / 2 : (i - 1) / 2}:${
                                                        i % 2 === 0 ? '00' : '30'
                                                    }`}
                                                >
                                                    {`${i < 20 ? '0' : ''}${
                                                        (i % 2 === 0 ? i / 2 : (i - 1) / 2) > 12
                                                            ? (i % 2 === 0 ? i / 2 : (i - 1) / 2) - 12
                                                            : i % 2 === 0
                                                            ? i / 2
                                                            : (i - 1) / 2
                                                    }:${i % 2 === 0 ? '00' : '30'} ${
                                                        (i % 2 === 0 ? i / 2 : (i - 1) / 2) > 12 ? 'PM' : 'AM'
                                                    }`}
                                                </option>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <AccessTimeIcon className="time-cion" />
                                </label>
                            </div>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <p>Assign User:</p>

                            <label>
                                <FormControl className={`${classes.formControl} task_select`}>
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
                                        <option aria-label="None" value="">
                                            Please Select a user
                                        </option>

                                        {users.map((ele) => (
                                            <option key={ele.value} value={ele.value}>
                                                {ele.name}
                                            </option>
                                        ))}
                                    </Select>
                                </FormControl>
                                <UnfoldMoreIcon className="time-cion" />
                            </label>
                        </div>
                        <div className="btn-bottom">
                            <button
                                onClick={(e) => {
                                    setModal((prev) => !prev);
                                }}
                                style={{ marginRight: '1rem' }}
                                className="btn-secondary"
                            >
                                Cancel
                            </button>
                            <button onClick={onAddHandler} className="btn-primary">
                                Save
                            </button>
                        </div>
                    </div>
                </CSSTransition>
            </div>

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
