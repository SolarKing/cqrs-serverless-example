const createCallbackHandler = require('./createCallbackHandler');

describe('utils/createCallbackHandler', () => {
  it('should invoke the callback once', () => {
    const callback = jest.fn();
    const send = createCallbackHandler({ callback });
    send();
    expect(callback.mock.calls.length).toBe(1);
  });
  it('should set the callbackWaitsForEmptyEventLoop within context to false', () => {
    const callback = jest.fn();
    const context = {
      callbackWaitsForEmptyEventLoop: true,
    };
    const send = createCallbackHandler({ callback, context });
    send();
    expect(context.callbackWaitsForEmptyEventLoop).toBe(false);
  });
});
