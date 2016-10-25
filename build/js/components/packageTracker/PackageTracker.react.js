import React, {Component} from 'react';
import classNames from 'classnames';
import Input from '../inputs/input.react.js';
import Dropdown from '../inputs/select.react.js';

/* Redux */
import {connect} from 'react-redux';
import { fetchPackagesIfNeeded, addPackage, deletePackage } from '../../actions/PackageActions.redux';


import './packageTracker.css';
class Package extends Component {
  constructor(props) {
    super(props);
  }

  deletePackage = () => {
    this.props.updatePackage('delete', this.props.package.id)
  }

  updatePackage = () => {
    //this.props.setupUpdatePackage(this.props.package);
  }

  receivedPackge = () => {
    console.log('receivedPackge')
  }

  render = () => {
    let serviceLink;
    let hover;
    let url;
    let orderNum = this.props.package.orderNum;
    if (this.props.package.service ==="FEDEX"){
      hover = "FEDEX: #" + orderNum;
      url = "https://www.fedex.com/apps/fedextrack/?action=track&action=track&language=english&cntry_code=us&tracknumbers="+orderNum;
    }
    else if (this.props.package.service ==="UPS"){
      hover = "UPS: #" + orderNum;
      url = "https://wwwapps.ups.com/WebTracking/track?loc=en_US&tbifl=1&hiddenText=&track.x=Track&tracknum="+orderNum;
    }
    else if (this.props.package.service ==="USPS"){
      hover = "USPS: #" + orderNum;
      url = "https://tools.usps.com/go/TrackConfirmAction.action?tRef=fullpage&tLc=1&text28777=&tLabels="+orderNum;
    }
    serviceLink =
      (<a title={hover} href={url} >
        <h1>{this.props.package.title}</h1>
        <h2>{this.props.package.status}</h2>
        <h3>{this.props.package.date}</h3>
      </a>);

    return (
      <li className="trackPackage_template">
        <div className="package_tracking_info">
          <button className="closeButton" onClick={this.deletePackage}><img src="/img/ic_close_black_48dp_2x.png" alt="x"></img></button>
          {serviceLink}
          <div className="card__action-bar">
            <button className="card__button" onClick={this.updatePackage}>EDIT</button>
            <button className="card__button" onClick={this.receivedPackge}>RECEIVED</button>
          </div>
        </div>
      </li>
    );
  }

}

const mapStateToProps = (state) => {
  return {
    packages: state.packageReducer.packages
  }
}

const mapDispatchToProps = (dispatch => {
  return {
    fetchPackages: () => {
      dispatch(fetchPackagesIfNeeded())
    },
    addPackage: (pkg) => {
      dispatch(addPackage(pkg))
    },
    deletePackage: (pkgId) => {
      dispatch(deletePackage(pkgId))
    }
  }
});

class PackageTracker extends Component {
  constructor(props) {
    super(props);

    const services = [
      {label: 'UPS', value: 'UPS'},
      {label: 'USPS', value: 'USPS'},
      {label: 'FEDEX', value: 'FEDEX'}];

    this.state = {
      addingPackage: false,
      editing: false,
      package_title: '',
      package_order_number:'',
      package_service: services[0].value,
      services: services,
      showMore: false
    }
  }
  componentDidMount = () => {
    this.props.fetchPackages();
  }
  revertState = () => {
    this.setState({
      package_title: '',
      package_order_number:'',
      package_service: 'UPS'
    });
  }

  closeNewPackage = () => {
    this.revertState();
    this.setState({addingPackage: false});
    this.revertState();
  }

  createNewPackage = () => {
    if (this.state.package_title && this.state.package_title.trim() &&
      this.state.package_order_number && this.state.package_order_number.trim() &&
      this.state.package_service && this.state.package_service.trim() ) {
      const my_package = {
        title: this.state.package_title,
        orderNum: this.state.package_order_number,
        service: this.state.package_service,
        status: 'No Status Update',
        date: 'No Estimated Date',
        timestamp: new Date(),
        deleted: false,
        received: false,
        receivedAt: ''
      };

      this.closeNewPackage();
      this.props.addPackage(my_package)
      this.revertState();
    }
  }

  updatePackage = () => {

  }

  addNewPackage = () => {
    this.setState({addingPackage: true, editing: false});
  }

  inputOnChange = (name, val) => {
    let newState = this.state;
    newState[name] = val;
    this.setState(newState);
  }

  dropdownOnChange = (name, val) => {
    let newState = this.state;
    newState[name] = val;
    this.setState(newState);
  }

  toggleShowMore = () => {
    this.setState({showMore: !this.state.showMore});
  }

  updatePackage = (action, pkgId, newInfo) => {
    if (action) {
      if (action === 'update') {

      }
      else if (action === 'received') {

      }
      else if (action === 'delete') {
        this.props.deletePackage(pkgId)
      }
    }
  }

  render = () => {
    const packagesList = (this.props.packages || []);

    const showAmount = this.state.showMore ? 5 : 3;

    const maxListSize = Math.min(showAmount, packagesList.length);
    let PackageNodes = [];
    for (let i = 0; i < maxListSize; i++) {
      const package_ = packagesList[i];
      if (package_.deleted === false) {
        PackageNodes.push(
          <Package
             updatePackage={this.updatePackage}
             package={package_}
             id={package_.id}
             key={package_.id}
         />
        );
      }
    }

    const addContainerClass = classNames('todoAddContainer', {'hide': !this.state.addingPackage});
    const trackerContainerClasses = classNames('packageTrackerContainer', {'hide': this.state.addingPackage});

    let expandedHeight = 148 * ( (maxListSize > 0 ? maxListSize : 1) - 1);
    if (this.state.addingPackage)
      expandedHeight = 0;
    if (PackageNodes.length < 3)
      expandedHeight = -48;

    const ctrStyle = {
      height: 292 + expandedHeight + 'px'
    };

    return (
      <div className="bookmark schedule package packageTracker" style={ctrStyle}>
        <h1>Packages</h1>
        <div className={addContainerClass}>
          <div className="todoAddInnerContainer">
            <div className="labelgroup">
              <h1 id="todo_package_Title">Track A Package</h1>
            </div>
            <button className="closeButton" onClick={this.closeNewPackage}><img src="/img/ic_close_black_48dp_2x.png"  alt="x"></img></button>

            <Input
              placeholder={'Name'}
              name={'package_title'}
              inputVal={this.state.package_title}
              type={'text'}
              onChange={this.inputOnChange}
            />

            <Input
              placeholder={'Tracking Number'}
              name={'package_order_number'}
              inputVal={this.state.package_order_number}
              type={'text'}
              onChange={this.inputOnChange}
            />

            <Dropdown
              label={'Service'}
              name={'package_service'}
              options={this.state.services}
              dropdownVal={this.state.package_service}
              onChange={this.dropdownOnChange}
            />

            <div className={classNames({'hide': this.state.editing})}>
              <button id="package_overlay_fab" className="fab" onClick={this.createNewPackage}><img src="/img/ic_check_white_48dp_2x.png" alt="plus"></img></button>
            </div>
            <div className={classNames({'hide': !this.state.editing})}>
              <button id="package_actionfab" className="fab" onClick={this.updatePackage}><img src="/img/ic_check_white_48dp_2x.png" alt="update"></img></button>
            </div>
          </div>
        </div>

        <div className={trackerContainerClasses}>
          <ul id="package_packageList">
            {PackageNodes}
          </ul>
          <div onClick={this.toggleShowMore} className={classNames('moreweatheraddButton', {'hide': PackageNodes.length < 3 })}>
            <span> {this.state.showMore ? ' View Less' : 'View More'}</span>
          </div>
          <h2 id="nopackagelabel" className={classNames({'hide': packagesList.length > 0})} >No Packages Tracked</h2>

          <button id="package_actionfab" className="fab" onClick={this.addNewPackage}><img src="/img/ic_add_white_48dp_2x.png" alt="add"></img></button>

        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(PackageTracker);
