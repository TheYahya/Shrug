import React from 'react';
import { connect } from 'react-redux';
import { removeQRCode } from '../actions/qrcode'; 
import QRCode from "qrcode.react";

class QRCodeModal extends React.Component {
  render() {
    if (this.props.qrcode.data != null) {
      return (
        <div 
          className="qrcode-modal-wrapper" 
          style={{display: "fixed"}}
          onClick={() => this.props.removeQRCode() }
          >
          <div className="qrcode-modal">
            <QRCode 
              renderAs={"svg"} 
              size={200} 
              level={"H"}
              value={this.props.qrcode.data}
              />
          </div>
        </div>
      )
    }

    return (<p></p>)
  }
}

const mapSteteToProps = (state) => {
  return {
    qrcode: state.qrcode
  };
};

const mapDispatchToProps = (dispatch) => ({
  removeQRCode: () => dispatch(removeQRCode())
});

export default connect(mapSteteToProps, mapDispatchToProps)(QRCodeModal);
