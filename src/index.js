import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { createStore } from 'redux';
import { connect, Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';

let model = {
    running: false,
    time: 0
};

let intents = {
    TICK: 'TICK',
    START: 'START',
    STOP: 'STOP',
    RESET: 'RESET'
};

const update = (model = { running: false, time: 0 }, action) => {
    const updates = {
        'START': (model) => Object.assign({}, model, { running: true }),
        'STOP': (model) => Object.assign({}, model, { running: false }),
        'TICK': (model) => Object.assign({}, model, { time: model.time + (model.running ? 1 : 0) })
    }
    return (updates[action.type] || (() => model))(model);
};

function mapStateToProps(state) {
    return state;
}

function mapDispatchToProps(dispatch) {
    return {
        onStart: () => { dispatch({ type: 'START' }); },
        onStop: () => { dispatch({ type: 'STOP' }); },
    };
}



//This is a function from a Model(m) to JSX. By definition view is there for a React component.
//And since it is a React component it can be wrapped in the connect function from react-redux.
let Stopwatch = connect(mapStateToProps, mapDispatchToProps)((props) => {
    let minutes = Math.floor(props.time / 60);
    let seconds = props.time - (minutes * 60);
    let secondsFormatted = `${seconds < 10 ? '0' : ''}${seconds}`;

    return <div><p>{minutes}:{secondsFormatted}</p>
        <button onClick={props.running ? props.onStop : props.onStart}>{props.running ? 'Stop' : 'Start'}</button>
    </div>
});

let container = createStore(update);

ReactDOM.render((<Provider store={container}>
    <Stopwatch />
</Provider>), document.getElementById('root'));



setInterval(() => {
    container.dispatch({ type: 'TICK' });
}, 1000);

serviceWorker.unregister();
