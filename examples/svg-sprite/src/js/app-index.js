import React from 'react';
import ReactDOM from 'react-dom';

import {default as EditSymbol, symbolData} from '../images/edit.svg?__sprite';
import GearSymbol from '../images/gear.svg?__sprite';
import InfoSymbol from '../images/info.svg?__sprite';
import SearchSymbol from '../images/search.svg?__sprite';

console.dir(EditSymbol);
console.dir(symbolData);

class Container extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <EditSymbol className="icon-edit" width="150" />
                <GearSymbol width="100" style={{width:"100vw"}} />
                <InfoSymbol width="150" data-role="info" />
                <SearchSymbol width="150" />
            </div>
        );
    }
}

ReactDOM.render(<Container />, document.getElementById('js-root'));

console.log('svg sprite done.');
