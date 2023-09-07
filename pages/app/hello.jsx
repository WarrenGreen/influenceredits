import React from "react";
import _ from "lodash";
import RGL, { WidthProvider } from "react-grid-layout";

import { createMedia, getProjectMedia } from '@/helpers/media'
import {getSegments, getProjectSegments} from '@/helpers/segment'

const ReactGridLayout = WidthProvider(RGL);

export const getServerSideProps = async ({ params }) => {
  const projectId = "d255a934-406a-11ee-b0d8-1fd09dc5b06d"
  let projectVideos = await getProjectMedia(projectId)
  let projectSegments = await getProjectSegments(projectId);
  return {
    props: {projectVideos, projectSegments, projectId},
  }
  
}

export default class Horizontal extends React.PureComponent {
  static defaultProps = {
    className: "layout",
    items: 5,
    rowHeight: 5,
    onLayoutChange: function() {},
    cols: 12,
    maxRows: 1,
    allowOverlap: false
  };

  constructor(props) {
    super(props);
    
    const layout = this.generateLayout();
    this.state = { layout };
  }

  generateDOM() {
    return this.props.projectSegments.map((segment, i) => {
      return (
        <div key={i}>
          <span className="text">{segment.text}</span>
        </div>
      );
    });
  }

  generateLayout() {
    const p = this.props;
    return _.map(new Array(p.items), function(item, i) {
      const y = 5;
      return {
        x: (i * 2) % 12,
        y: Math.floor(i / 6) * y,
        w: 2,
        h: y,
        i: i.toString()
      };
    });
  }

  onLayoutChange(layout) {
    this.props.onLayoutChange(layout);
  }

  render() {
    return (
      <ReactGridLayout
        layout={this.state.layout}
        onLayoutChange={this.onLayoutChange}
        useCSSTransforms={true}
        cols={12}
        allowOverlap={true}
        style={{backgroundColor: "blue"}}

        {...this.props}
      >
        {this.generateDOM()}
      </ReactGridLayout>
    );
  }
}
