import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { startAddUrl } from '../actions/urls';
import AuthButtons from './AuthButtons';

const BASE_URL = process.env.API_BASE_URL;

const NewUrl = ({ auth, urls, addUrl }) => {
  const [link, setLink] = useState('');
  const [address, setAddress] = useState('');
  const [showOptions, setShowOptions] = useState(false);

  const onUrlChange = (evt) => setLink(evt.target.value);

  const onAddressChange = (evt) => setAddress(evt.target.value);

  const onChangeOptions = (evt) => setShowOptions(evt.target.checked);

  const onSubmit = (e) => {
    e.preventDefault();

    addUrl({ link, short_code: address });
    setLink('');
    setAddress('');
  };

  if (!auth.isAuthenticated) {
    return (
      <div className="new-link text-center">
        <p>
          <img alt="log" src="/images/shrug-ir.png" />
        </p>
        <h1>
          Shrink your urls with a
          <code>shrug</code>
        </h1>
        <br />
        <AuthButtons />
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="new-link px-3"
    >
      <div className="row">
        <div className="col-12 form-group">
          <input
            type="text"
            id="url"
            className="form-control"
            name="url"
            onChange={onUrlChange}
            value={link}
            placeholder="Your loooooong URL"
            autoComplete="off"
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          />
        </div>
        <div className="col-12 form-group">
          <label htmlFor="more-options">
            <input
              type="checkbox"
              id="more-options"
              name="more-options"
              onChange={onChangeOptions}
            />
            &nbsp;Custom url
          </label>
        </div>
        <div
          className={`form-group col-6 more-options ${!showOptions && 'd-none'}`}
        >
          <label
            htmlFor="custom-address"
            className="w-100"
          >
            {`${BASE_URL}/`}
            <input
              type="text"
              name="custom-address"
              id="custom-address"
              placeholder="Custom url (optional)"
              autoComplete="off"
              size="sm"
              value={address}
              onChange={onAddressChange}
            />
          </label>
        </div>
      </div>
      <small>
        Press
        <code> Enter </code>
        to shorten the URL.
      </small>
      <p><code>{urls.addUrlError}</code></p>
      <input
        type="submit"
        className="d-none"
      />
    </form>
  );
};

const mapSteteToProps = (state) => ({
  auth: state.auth,
  urls: state.urls,
});

const mapDispatchToProps = (dispatch) => ({
  addUrl: (url) => dispatch(startAddUrl(url)),
});

NewUrl.propTypes = {
  auth: PropTypes.instanceOf(Object).isRequired,
  urls: PropTypes.instanceOf(Object).isRequired,
  addUrl: PropTypes.func.isRequired,
};

export default connect(mapSteteToProps, mapDispatchToProps)(NewUrl);

