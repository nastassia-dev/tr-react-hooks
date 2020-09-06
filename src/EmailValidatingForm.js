import { useReducer, useState } from 'react';
import useInterval from './useInterval';

function EmailValidatingForm() {

  function useEmailValidation(seconds) {
    const validateEmail = (email) => {
      const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    };
    const [emailValid, setEmailValid] = useState(false);
    const emailReducer = (state, action) => {
      const isValidEmail = validateEmail(action);
      setEmailValid(isValidEmail);
      return action;
    };
    /*
    The first param to useReducer() is the reducer function "emailReducer" and the second param is the initial value
    of the associated state (this would have been the same value passed as the first parameter into the useState() hook)
    When "setEmail" is called, instead of the state email getting set directly from the first param passed into "setEmail",
    the "emailReducer" gets called instead. Its first param is the current state and the second param is the first param
    passed into the "setEmail"
    If we wanted useReducer() to work exactly like useState(), we'd simply returned "action" from "emailReducer" without
    any other logic
    useReducer() can be used to update multiple state values in a single call
     */
    const [email, setEmail] = useReducer(emailReducer, '');
    const maxSeconds = 30;
    const [count, setCount] = useState(maxSeconds);

    useInterval(() => {
      setCount(count - 1);
    }, 1000);

    const retObject = { setEmail, count, email, emailValid, setCount };
    return retObject;
  }

  const { setEmail, count, email, emailValid, setCount } = useEmailValidation(30);
  return (
    <div className="container">
      <br />
      <div>
        <div className="content">
          <input
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            disabled={count <= 0}
            value={email}
            placeholder="Enter Email"
            type="email"
            name="email"
            required
          />
          &nbsp;&nbsp;&nbsp;
          <button
            disabled={!emailValid || count <= 0}
            onClick={() => {
              setCount(0);
              alert(`button clicked with email ${email}`);
            }}
            className="btn-lg"
            type="submit"
          >
            PRESS ME!
          </button>
          <div>
            {count > 0
              ? `You Have ${count} Seconds To Enter Your Email`
              : 'Email Entered or Time Expired'}
          </div>
        </div>
      </div>
    </div>
  );
}
export default EmailValidatingForm;
