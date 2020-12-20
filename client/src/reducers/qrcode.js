// qrcode Reducer

const qrcodeReducerDefaultState = {
  data: null,
};

export default (state = qrcodeReducerDefaultState, action) => {
  switch (action.type) {
    case 'ADD_DATA':
      return {
        data: action.data,
      };
    case 'REMOVE_QRCODE':
      return qrcodeReducerDefaultState;
    default:
      return state;
  }
};
