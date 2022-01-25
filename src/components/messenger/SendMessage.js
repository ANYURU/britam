import {useState} from 'react';
import {Form, Button} from 'react-bootstrap';

function SendMessage() {

  return (
    <div style={{backgroundColor: "#fff", width:'100px'}}>
        <Form>
            <div style={{display:'flex', justifyContent:'space-between'}}>
                <Form.Group>
                    <Form.control id="message" placeholder="Start a new message."/>
                </Form.Group>
                <Button type="submit"><i>send</i></Button>
            </div>
        </Form>
    </div>
  );
}

export default SendMessage;
