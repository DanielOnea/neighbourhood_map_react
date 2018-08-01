import React from 'react'
import './App.css'

class Filter extends React.Component {

    state = {
        searchStr: '',
        markers: []
    };

    componentDidMount() {
        this.setState({markers: this.props.marker})
    }

    // Filter list items according to user input
    findLoc = (loc) => {
        let self = this;
        let markers = this.props.marker;
        let newMarkers = [];
        this.props.infoWindows.close();

        // Hide/Show markers according to user inputs
        markers.forEach(function (e) {
            if (e.title.toUpperCase().indexOf(loc.toUpperCase()) >= 0) {
                e.setVisible(true);
                newMarkers.push(e);
            }
            else {
                e.setVisible(false)
            }

        });
        self.setState({markers: newMarkers})
    };

    render() {
        let current,
            setmark = this.props.showInfo,
            locs = this.props.locations;
        return (

            <div id='searchContainer'>

                <input type="text" id="searchInput" className="search" placeholder="Filter"
                       tabIndex={0}
                       onChange={e => this.findLoc(e.target.value)}/>
                <div className="filterList">

                    <ul role="list" aria-label='Venues'>
                        {this.state.markers.length > 0 ?
                            this.state.markers.map(function (mark, i) {
                                let current = locs.find(function (e) {
                                    return mark.title === e.name
                                });
                                return (<li role="listitem" key={i}
                                            tabIndex={0}
                                            onClick={e => setmark(mark, current)}> {mark.title} </li>)
                            })
                            : (<span> <li>No places Found </li></span>)
                        }
                    </ul>
                </div>
            </div>
        )
    }
}

export default Filter
