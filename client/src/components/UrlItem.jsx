import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Form, Button } from 'react-bootstrap';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faTrashAlt,
  faChartBar,
  faQrcode,
  faClone,
  faEdit,
} from '@fortawesome/free-solid-svg-icons';
import copy from 'copy-to-clipboard';
import { startRemoveUrl, startUpdateUrl } from '../actions/urls';
import { withComma } from '../utils';
import { addData } from '../actions/qrcode';

const { API_BASE_URL } = process.env;
const { confirm } = window;

const ActionButton = ({ onClick, children }) => (
  <Button
    className="btn-action"
    variant="link"
    onClick={onClick}
  >
    {children}
  </Button>
);

const LinkButton = ({ href, children }) => (
  <Button
    href={href}
    variant="link"
    target="_blank"
    rel="noreferrer"
  >
    {children}
  </Button>
);

const UrlItem = ({
  url,
  removeUrl,
  updateUrl,
  addLinkData,
}) => {
  const [copied, setCopied] = useState(false);
  const [onEdit, setOnEdit] = useState(false);
  const [link, setLink] = useState(url.link);
  const [shortCode, setShorCode] = useState(url.shortCode);

  const onCopied = (evt) => {
    evt.preventDefault();
    copy(`${API_BASE_URL}/${url.shortCode}`);
    setCopied(true);
    setTimeout(() => { setCopied(false); }, 1000);
  };

  const removeItem = () => {
    const status = confirm('Would you like to delete this?');
    if (status) { removeUrl(url.id); }
  };

  const editLink = () => setOnEdit(true);

  const updateLink = () => {
    updateUrl({
      id: url.id, link, short_code: shortCode,
    });
    setOnEdit(false);
  };

  const addLinkHandler = () => addLinkData(`${API_BASE_URL}/${url.shortCode}`);

  const onLinkChange = (evt) => setLink(evt.target.value);

  const onShortCodeChange = (evt) => setShorCode(evt.target.value);

  const shortIt = (str) => {
    if (str.length > 33) {
      return `${str.substr(0, 30)}...`;
    }
    return str;
  };

  return (
    <tr>
      <td>
        {
          onEdit
            ? (
              <Form.Control
                size="sm"
                className="mw-100 w-auto"
                value={link}
                onChange={onLinkChange}
              />
            )
            : (
              <LinkButton href={link}>
                {shortIt(link)}
              </LinkButton>
            )
        }
      </td>
      <td>
        {
          onEdit
            ? (
              <Form.Control
                size="sm"
                value={shortCode}
                className="mw-100 w-auto"
                onChange={onShortCodeChange}
              />
            ) : (
              <>
                <Button
                  variant="light"
                  className="btn-copy px-1 py-0 mr-1"
                  onClick={onCopied}
                >
                  <FontAwesomeIcon
                    className={copied ? 'text-success' : 'theme-color'}
                    icon={copied ? faCheck : faClone}
                  />
                </Button>
                <LinkButton href={`${API_BASE_URL}/${url.shortCode}`}>
                  <code>{`${API_BASE_URL}/${url.shortCode}`}</code>
                </LinkButton>
              </>
            )
        }
      </td>
      <td>
        {withComma(url.visitsCount)}
      </td>
      <td>
        {formatDistanceToNow(new Date(url.createdAt))}
        &nbsp;ago
      </td>
      <td className="text-center">
        {
          onEdit
            ? (
              <ActionButton onClick={updateLink}>
                <FontAwesomeIcon
                  className="text-success"
                  icon={faCheck}
                />
              </ActionButton>
            )
            : (
              <ActionButton onClick={editLink}>
                <FontAwesomeIcon icon={faEdit} />
              </ActionButton>
            )
        }
        <ActionButton onClick={addLinkHandler}>
          <FontAwesomeIcon icon={faQrcode} />
        </ActionButton>
        <ActionButton>
          <Link
            className="btn-action"
            to={`/stats/${url.id}`}
          >
            <FontAwesomeIcon icon={faChartBar} />
          </Link>
        </ActionButton>
        <ActionButton onClick={removeItem}>
          <FontAwesomeIcon icon={faTrashAlt} />
        </ActionButton>
      </td>
    </tr>
  );
};

const mapSteteToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = (dispatch) => ({
  addLinkData: (data) => dispatch(addData(data)),
  removeUrl: (id) => dispatch(startRemoveUrl({ id })),
  updateUrl: (data) => dispatch(startUpdateUrl(data)),
});

UrlItem.propTypes = {
  url: PropTypes.instanceOf(Object).isRequired,
  addLinkData: PropTypes.func.isRequired,
  removeUrl: PropTypes.func.isRequired,
  updateUrl: PropTypes.func.isRequired,
};

ActionButton.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node,
};

ActionButton.defaultProps = {
  onClick: () => null,
  children: null,
};

LinkButton.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node,
};

LinkButton.defaultProps = {
  children: null,
};

export default connect(mapSteteToProps, mapDispatchToProps)(UrlItem);
