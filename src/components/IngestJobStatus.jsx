import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  getIngestStatus
} from '../actions';
import './IngestJobStatus.css';

class IngestJobStatus extends Component {
  constructor (props) {
    super(props);

    this.checkStatus = this.checkStatus.bind(this);
    this.checkStatusInterval = null;
  }

  checkStatus () {
    const { dispatch, accountId, videoId, ingestJob } = this.props;

    if (ingestJob && ingestJob.status && ingestJob.status.state === 'finished') {
      window.clearInterval(this.checkStatusInterval);
      this.checkStatus = null;
    } else if (ingestJob && ingestJob.jobId && !ingestJob.isRequestingStatus && accountId && videoId) {
      return dispatch(getIngestStatus(accountId, videoId, ingestJob.jobId));
    }
  }

  componentDidMount () {
    this.checkStatus();
    this.checkStatusInterval = window.setInterval(this.checkStatus, 1000 * 10);
  }

  render () {
    const { ingestJob } = this.props;
    let jobState;
    let errorMsg;

    if (ingestJob && ingestJob.status) {
      jobState = `status: ${ingestJob.status.state}`;
      errorMsg = ingestJob.status.error_message
        ? `error: ${ingestJob.status.error_message}`
        : '';
    }

    return (
      <div>
        ingestJobStatus
        {
          ingestJob && ingestJob.status &&
          <div>
            <p>
              {jobState}
            </p>
            <p>
              {errorMsg}
            </p>
          </div>
        }
      </div>
    );
  }
}

/**
 * see https://redux-docs.netlify.com/basics/usage-with-react#implementing-container-components
 */
const mapStateToProps = (state) => ({
  ingestJob: state.currentIngest,
  accountId: state.base.accountId,
  videoId: state.currentRemoteUpload.videoId
});

IngestJobStatus.propTypes = {
  accountId: PropTypes.number,
  videoId: PropTypes.string,
  dispatch: PropTypes.func,
  ingestJob: PropTypes.object
};

export default connect(mapStateToProps)(IngestJobStatus);