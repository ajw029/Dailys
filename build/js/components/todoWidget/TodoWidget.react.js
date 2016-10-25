import React, {Component} from 'react';
import classNames from 'classnames';
import uuid from 'uuid';

import Input from '../inputs/input.react.js';
import Dropdown from '../inputs/select.react.js';

/* Redux */
import {connect} from 'react-redux';
import { fetchTodosIfNeeded, addTodo, deleteTodo, checkTodo } from '../../actions/TodoActions.redux';

import './todo.css';

class Todo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    }
  }

  checkOffTodo = (event) =>{
    this.props.checkTodo(this.props.id, !this.props.isComplete);
  }
  expandTodoInfoEdit = () =>{
    this.props.editTodo(this.props);
  }
  render = () => {
    return (
      <li className="todoObject">
        <div className="labelContainer">
          <label className="label--checkbox">
            <input type="checkbox" autoComplete="off" className="checkbox" value={this.props.isComplete==true} onChange={this.checkOffTodo}></input>
            <span>{this.props.title}</span>
          </label>
        </div>
        <div className="todo_actionContainer">
          <button className="settings" onClick={this.expandTodoInfoEdit}><i className="fa fa-cog" aria-hidden="true"></i></button>
          <button className="settings" onClick={this.expandTodoInfoEdit}><i className="fa fa-trash-o" aria-hidden="true"></i></button>
        </div>
      </li>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    todos: state.todoReducer.todos
  }
}

const mapDispatchToProps = (dispatch => {
  return {
    fetchTodos: () => {
      dispatch(fetchTodosIfNeeded())
    },
    addTodo: (todo) => {
      dispatch(addTodo(todo));
    },
    deleteTodo: () => {
      dispatch(deleteTodo());
    },
    checkTodo: (todoID, val) => {
      dispatch(checkTodo(todoID, val));
    }
  }
});

class TodoWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: [],
      week: [0, 0 ,0 ,0 ,0 ,0 ,0],
      title: '',
      isEveryday: false,
      addingTodo: false,
      editting: false,
      isEveryday: false
    }
  }

  componentDidMount = () => {
    this.props.fetchTodos();
  }

  handleChange = (name, event) => {
    const value = event.target.value;
    let state = this.state;
    state[name] = value;
    this.setState(state);
  }

  handleCheck = (index, event) => {
    const week = this.state.week;
    week[index] = week[index] === 0 ? 1 : 0;
    let everyday = true;
    for (let i = 0; i < week.length; i++) {
      everyday = week[i] === 1 && everyday
    }
    this.setState({week: week, isEveryday: everyday});
  }

  handleEveryday = () => {
    const newVal = this.state.isEveryday ? 0 : 1;

    const week = this.state.week;
    let everyday = true;
    for (let i = 0; i < week.length; i++) {
      week[i] = newVal;
    }
    this.setState({week: week, isEveryday: newVal});
  }

  toggleAddTodo = () => {
    this.setState({addingTodo: true});
  }

  closeAddTodo = () => {
    this.setState({addingTodo: false, editting: false});
  }

  checkTodo = (id, value) => {
    this.props.checkTodo(id, value)
  }

  checkButtonClick = () => {
    let todoObj = {
      title: this.state.title,
      week: this.state.week,
      deleted: false,
      isComplete: false,
      uuid: uuid.v4()
    }
    if (this.state.editting) {

    }
    else {
      todoObj.timestamp = new Date();
      this.props.addTodo(todoObj);
    }
    console.log(this.state)
  }

  render = () => {
    let i = 0;
    const todos = (this.props.todos || []);


    let TodoNodes = todos.map(function(todo_) {
      return (
        <Todo
        title={todo_.title}
        week={todo_.week}
        isComplete={todo_.isComplete}
        editTodo={this.editTodo}
        checkTodo={this.checkTodo}
        id={todo_.id}
        key={todo_.id}
        />)
      }.bind(this));
      let center_style = {'textAlign':'center'};
    return (
      <div className="bookmark todo">
        <h1>Todos</h1>

        <div className={classNames({'hide': !this.state.addingTodo})}>
          <div id="todo_todoListAddEditContainer" className="todoAddContainer">
            <div className="todoAddInnerContainer">
              <div className="labelgroup">
                <div>
                  <h1 style={center_style}>{this.state.editting ? 'Editting Todo' : 'Add A Todo'}</h1>
                </div>
              </div>
              <button className="closeButton" onClick={this.closeAddTodo}><img src="/img/ic_close_black_48dp_2x.png" alt="x"></img></button>
              <div className="inputgroup">
                <input id="todo_title" onChange={this.handleChange.bind(this, 'title')} value={this.state.title} type="text" maxLength="25" required/>
                <span className="bar"></span>
                <label>Title</label>
              </div>
              <div className="labelgroup">
                <label>Repeat</label>
                <label className="label--checkbox">
                  <input id="todo_everydaySelector" type="checkbox" autoComplete="off" className="checkbox" onChange={this.handleEveryday} checked={this.state.isEveryday==true}></input> Every Day
                </label>
              </div>
              <div id="todo_repeat_days" className="editDaysOfWeekTodo">
                <label className="label--checkbox">
                  <input type="checkbox" autoComplete="off" className="checkbox" onChange={this.handleCheck.bind(this, 0)} checked={this.state.week[0]==1}></input>S
                </label>
                <label className="label--checkbox">
                  <input type="checkbox" autoComplete="off" className="checkbox" onChange={this.handleCheck.bind(this, 1)} checked={this.state.week[1]==1}></input>M
                </label>
                <label className="label--checkbox">
                  <input type="checkbox" autoComplete="off" className="checkbox" onChange={this.handleCheck.bind(this, 2)} checked={this.state.week[2]==1}></input>T
                </label>
                <label className="label--checkbox">
                  <input type="checkbox" autoComplete="off" className="checkbox" onChange={this.handleCheck.bind(this, 3)} checked={this.state.week[3]==1}></input>W
                </label>
                <label className="label--checkbox">
                  <input type="checkbox" autoComplete="off" className="checkbox" onChange={this.handleCheck.bind(this, 4)} checked={this.state.week[4]==1}></input>Th
                </label>
                <label className="label--checkbox">
                  <input type="checkbox" autoComplete="off" className="checkbox" onChange={this.handleCheck.bind(this, 5)} checked={this.state.week[5]==1}></input>F
                </label>
                <label className="label--checkbox">
                  <input type="checkbox" autoComplete="off" className="checkbox" onChange={this.handleCheck.bind(this, 6)} checked={this.state.week[6]==1}></input>S
                </label>
              </div>
              <div className={classNames({'hide': !this.state.editting})}>
              <div id="deleteTodoContainer" className="flatButtonContainer" style={center_style}>
                <button className="flatSquareButton deleteSquare" onClick={this.deleteTodo}>Delete</button>
              </div>
              </div>
              <input id="todo_hidden_id" name="todoid" type="hidden"/>
              <div>
                <button id="todo_overlay_fab" className="fab" onClick={this.checkButtonClick}><img src="/img/ic_check_white_48dp_2x.png" alt="plus"></img></button>
              </div>
            </div>
          </div>
        </div>

        <div>
              <div id="todo_today_tab_container" className="todoListContainer">
                <ul id="todo_todoUL" className={classNames('list', {'hide': TodoNodes.length === 0})}>
                  {TodoNodes}
                </ul>
                <h2 className={classNames({'hide': TodoNodes.length > 0})} style={center_style}>All Todos Complete</h2>
              </div>
        </div>

        <button id="todo_actionfab" className="fab" onClick={this.toggleAddTodo}><img src="/img/ic_add_white_48dp_2x.png" alt="plus"></img></button>
      </div>

    );
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(TodoWidget);
