import React, {Component} from 'react';

/* Widgets */
import WeatherWidget from './components/WeatherWidget/WeatherWidget.react';
import ClockWidget from './components/clock/ClockWidget.react';
import PackageTracker from './components/packageTracker/PackageTracker.react';
import TodoWidget from './components/todoWidget/TodoWidget.react';
import ScheduleWidget from './components/schedule/ScheduleWidget.react';

export default class HomeContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
    <div>
      <section className="slide-container">
        <div className="slide">
          <ClockWidget />
          <WeatherWidget />
        </div>
      </section>
      <section className="slide-container">
        <div className="slide">
          <PackageTracker />
        </div>
      </section>
      <section className="slide-container">
        <div className="slide">
          <TodoWidget />
        </div>
      </section>
    </div>
    );
  }
}
