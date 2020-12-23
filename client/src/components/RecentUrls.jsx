import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faCalendar,
  faCut,
  faLink,
  faListAlt,
  faAngleLeft,
  faAngleRight,
} from '@fortawesome/free-solid-svg-icons';
import { Button, Form, Table } from 'react-bootstrap';
import { startGetUrls } from '../actions/urls';
import UrlItem from './UrlItem';
import EmptyUrls from './EmptyUrls';

const LimitButton = ({ className, onClick, children }) => (
  <Button
    variant="light"
    size="sm"
    className={className}
    onClick={onClick}
  >
    {children}
  </Button>
);

const NavigateButton = ({ className, onClick, children }) => (
  <Button
    className={`px-3 ${className}`}
    variant="light"
    size="sm"
    onClick={onClick}
  >
    {children}
  </Button>
);

const NavigateButtons = ({ onPreviousClick, onNextClick }) => (
  <>
    <NavigateButton
      className="ml-5"
      onClick={onPreviousClick}
    >
      <FontAwesomeIcon icon={faAngleLeft} />
    </NavigateButton>
    <NavigateButton
      className="ml-1"
      onClick={onNextClick}
    >
      <FontAwesomeIcon icon={faAngleRight} />
    </NavigateButton>
  </>
);

const RecentUrls = ({ urls, getUrls }) => {
  const [search, setSearch] = useState('');

  const limit = (lmt = 10) => getUrls(urls.offset, lmt, urls.search);

  const limitByTen = () => limit(10);

  const limitByTwenty = () => limit(20);

  const limitByFifty = () => limit(50);

  const nextPage = () => getUrls(urls.offset + urls.limit, urls.limit, urls.search);

  const previousPage = () => getUrls(urls.offset - urls.limit, urls.limit, urls.search);

  const onChangeSearch = (evt) => setSearch(evt.target.value);

  const onSubmit = (evt) => {
    evt.preventDefault();
    getUrls(urls.offset, urls.limit, search);
  };

  if (urls.urls.length === 0 && urls.search === '') {
    return <EmptyUrls />;
  }

  return (
    <div className="recent-urls px-3">
      <h2 className="recent-urls__title">
        <FontAwesomeIcon icon={faListAlt} />
        &nbsp;All shortened links
      </h2>
      <Table
        responsive
        bordered
        hover
      >
        <thead>
          <tr>
            <th colSpan="5">
              <Form
                className="form-search d-flex justify-content-between"
                onSubmit={onSubmit}
              >
                <Form.Control
                  className="bg-none w-auto"
                  placeholder="Search"
                  onChange={onChangeSearch}
                  value={search}
                  size="sm"
                />
                <div>
                  <LimitButton onClick={limitByTen}>
                    10
                  </LimitButton>
                  <LimitButton
                    className="mx-1"
                    onClick={limitByTwenty}
                  >
                    20
                  </LimitButton>
                  <LimitButton onClick={limitByFifty}>
                    50
                  </LimitButton>
                  <NavigateButtons
                    onPreviousClick={previousPage}
                    onNextClick={nextPage}
                  />
                </div>
              </Form>
            </th>
          </tr>
          <tr>
            <th scope="col">
              <FontAwesomeIcon icon={faLink} />
              &nbsp;Original URL
            </th>
            <th scope="col">
              <FontAwesomeIcon icon={faCut} />
              &nbsp;Short URL
            </th>
            <th scope="col">
              <FontAwesomeIcon icon={faEye} />
              &nbsp;Views
            </th>
            <th scope="col">
              <FontAwesomeIcon icon={faCalendar} />
              &nbsp;Created
            </th>
            <th scope="col">&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {urls.urls.map((url) => <UrlItem key={url.id} url={url} />)}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="5">
              <div className="d-flex justify-content-end">
                <NavigateButtons
                  onPreviousClick={previousPage}
                  onNextClick={nextPage}
                />
              </div>
            </td>
          </tr>
        </tfoot>
      </Table>
    </div>
  );
};

const mapSteteToProps = (state) => ({
  urls: state.urls,
});

const mapDispatchToProps = (dispatch) => ({
  getUrls: (offset = 0, limit = 0, search = '') => dispatch(startGetUrls(offset, limit, search)),
});

LimitButton.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

LimitButton.defaultProps = {
  className: '',
};

NavigateButton.propTypes = {
  className: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

NavigateButtons.propTypes = {
  onPreviousClick: PropTypes.func.isRequired,
  onNextClick: PropTypes.func.isRequired,
};

RecentUrls.propTypes = {
  urls: PropTypes.instanceOf(Object).isRequired,
  getUrls: PropTypes.func.isRequired,
};

export default connect(mapSteteToProps, mapDispatchToProps)(RecentUrls);
