import React, { useState } from 'react';
import './style.css';
import DatePicker from 'react-date-picker';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TimePicker from 'react-time-picker';
import axios from 'axios';

import { local_url } from '../../localUrl';
import { connect } from 'react-redux';
import DeleteIcon from '@material-ui/icons/Delete';

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
    const [value, onChange] = useState(`${new Date(created).getHours()}:${new Date(created).getMinutes()}`);
    const [taskDetails, setTaskDetails] = useState({
        date: new Date(created),
        assigendTo: userid,
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
        <div style={{ position: 'relative' }} className="task">
            <DeleteIcon onClick={taskDelelteHandler} className="task_delete" />
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
                    <option value={userid}>{assignedto}</option>
                    {users.map((ele) => (
                        <option key={ele.value} value={ele.value}>
                            {ele.name}
                        </option>
                    ))}
                </Select>
            </FormControl>
            <button onClick={onUpdateHandler} style={{ margin: '1rem auto' }} className="btn-primary">
                Update
            </button>
        </div>
    );
};
const mapStateToProps = (state) => {
    return {
        token: state.authReducer.token,
    };
};

export default connect(mapStateToProps, null)(Index);
