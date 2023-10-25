import { useState } from "react";

const useForm = ({ additionalData }) => {
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    const finalFormEndpoint = e.target.action;
    const data = Array.from(e.target.elements)
      .filter((input) => input.name)
      .reduce((obj, input) => Object.assign(obj, { [input.name]: input.value }), {});

    if (additionalData) {
      Object.assign(data, additionalData);
    }

    fetch(finalFormEndpoint, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error(response.statusText);
        }

        return response.json();
      })
      .then(() => {
        setMessage("Subscribed");
        setStatus('success');
      })
      .catch((err) => {
        setMessage(err.toString());
        setStatus('error');
      });
  };

  return { handleSubmit, status, message };
}

export default useForm;