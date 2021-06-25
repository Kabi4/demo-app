import React, { useState } from 'react';
import './style.css';
import DatePicker from 'react-date-picker';
import { makeStyles } from '@material-ui/core/styles';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import axios from 'axios';

import { local_url } from '../../localUrl';
import { connect } from 'react-redux';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Edit';
import { CSSTransition } from 'react-transition-group';
import RemoveIcon from '@material-ui/icons/Remove';
const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));
const Index = ({ description, taskDeleted, toggleLoading, created, userid, id, assignedto, users, ...props }) => {
    const classes = useStyles();

    const [modal, setModal] = useState(false);
    const [value, onChange] = useState(
        `${new Date(created).getHours() < 10 ? '0' : ''}${new Date(created).getHours()}:${
            new Date(created).getMinutes() % 30 !== 0 ? '00' : new Date(created).getMinutes() % 30
        }`
    );
    const [taskDetails, setTaskDetails] = useState({
        date: new Date(created),
        assigendTo: userid + '1',
        description: description,
    });
    const changehanlder = (type, value) => {
        setTaskDetails((prev) => {
            const old = { ...prev };
            old[type] = value;
            return old;
        });
    };
    const onUpdateHandler = async (e) => {
        e.preventDefault();
        toggleLoading();
        await axios
            .put(
                `${local_url}/task/lead_6996a7dcdddc4af3b4f71ccb985cea38/${id}`,
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
                toggleLoading();
                alert(`Task with id ${id} updated!`);
            })
            .catch((err) => {
                toggleLoading();
                alert('Please try again!');
            });
    };
    const taskDelelteHandler = async () => {
        toggleLoading();
        await axios
            .delete(
                `${local_url}/task/lead_6996a7dcdddc4af3b4f71ccb985cea38/${id}`,

                {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${props.token}`,
                    },
                }
            )
            .then((res) => {
                toggleLoading();
                alert(`Task with id ${id} Deleted!`);
                taskDeleted();
            })
            .catch((err) => {
                toggleLoading();
                alert('Please try again!');
            });
    };
    return (
        <div className="add_task">
            <div className="add_task_header">
                <div style={{ textTransform: 'none', fontSize: '1rem' }} className="add_task_heading">
                    <p>{description}</p>
                    <p>{`${new Date(taskDetails.date).getFullYear()}-${
                        new Date(taskDetails.date).getMonth() + 1
                    }-${new Date(taskDetails.date).getDate()}`}</p>
                </div>

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
                        <div>
                            <p>Date</p>
                            <DatePicker
                                onChange={(value) => {
                                    changehanlder('date', value);
                                }}
                                value={taskDetails.date}
                            />
                        </div>
                        <div>
                            <p>Time</p>
                            <FormControl className={`${classes.formControl} task_select`}>
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
                                        <option key={i} value={ele.value}>
                                            {`${i < 20 ? '0' : ''}${i % 2 === 0 ? i / 2 : (i - 1) / 2}:${
                                                i % 2 === 0 ? '00' : '30'
                                            }`}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                    </div>
                    <div>
                        <p>Assign User:</p>

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
                                {users.findIndex((ele) => ele.value === userid && assignedto === ele.name) === -1 && (
                                    <option selected value={userid + '1'}>
                                        {assignedto}
                                    </option>
                                )}
                                {users.map((ele) => (
                                    <option key={ele.value} value={ele.value}>
                                        {ele.name}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                    <div className="btn-bottom">
                        <DeleteIcon onClick={taskDelelteHandler} className="delete_icon" />
                        <button
                            onClick={(e) => {
                                setModal((prev) => !prev);
                            }}
                            style={{ marginRight: '1rem' }}
                            className="btn-secondary"
                        >
                            Cancel
                        </button>
                        <button onClick={onUpdateHandler} className="btn-primary">
                            Update
                        </button>
                    </div>
                </div>
            </CSSTransition>
        </div>
    );
};
const mapStateToProps = (state) => {
    return {
        token: state.authReducer.token,
    };
};

export default connect(mapStateToProps, null)(Index);
