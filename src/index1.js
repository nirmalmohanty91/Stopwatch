import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

//1.Default model
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
//3. Update function applies that intent to make the modification to the model
const update = (model = { running: false, time: 0 }, intent) => {
    //console.log('udpate'+intent);
    const updates = {
        'START': (model) => Object.assign(model, { running: true }),
        'STOP': (model) => Object.assign(model, { running: false }),
        'TICK': (model) => Object.assign(model, { time: model.time + (model.running ? 1 : 0) })
    }
    return updates[intent](model);
};

let view = (m) => {
 //console.log(m)
    let minutes = Math.floor(m.time / 60);
    let seconds = m.time - (minutes * 60);
    let secondsFormatted = `${seconds < 10 ? '0' : ''}${seconds}`;
    let handler = (event) => {
        //model = update(model, m.running ? 'STOP' : 'START');
        container.dispatch(m.running ? 'STOP' : 'START')
    }
    return <div><p>{minutes}:{secondsFormatted}</p>
        <button onClick={handler}>{m.running ? 'Stop' : 'Start'}</button>
    </div>
};

const createStore = (reducer) => {
    //console.log(reducer);
    let internalState;
    let handlers = [];
    return {
        dispatch: (intent) => {
            console.log(intent+':'+JSON.stringify(internalState));
            internalState = reducer(internalState, intent);
            handlers.forEach(h => { h() });
        },
        subscribe: (handler) => {
            handlers.push(handler);
        },
        getState: () => internalState
    }
};

let container = createStore(update);


//4. Which cause the appliation to be rerendered using the view function based on the updated model
const render = () => {
    // ReactDOM.render(view(model), document.getElementById('root'));
    ReactDOM.render(view(container.getState()), document.getElementById('root'));
}

container.subscribe(render);

//2. We publish an intent
setInterval(() => {
    // model = update(model, 'TICK');
    // render();
    container.dispatch('TICK');
}, 1000);

serviceWorker.unregister();
