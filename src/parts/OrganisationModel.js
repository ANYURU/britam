import { useState } from 'react'
import { Modal, Form, Row, Col, Button } from 'react-bootstrap'
import { db } from '../helpers/firebase';
import { doc, updateDoc } from 'firebase/firestore'
import { authentication } from '../helpers/firebase';

function OrganisationModal({ handleFieldChange, singleDoc, handleClose, editID }) {
    const [show, setShow] = useState(false);
  
    const modalSubmit = async (event) => {
        event.preventDefault()

        const organisationRef = doc(db, "organisations", editID);

        await updateDoc(organisationRef, {
            uid: authentication.currentUser.uid,
            name: event.target.name.value,
            org_email: event.target.org_email.value,
            tel: event.target.tel.value,
            address: event.target.address.value,
            logo: event.target.logo.value,
            role: event.target.role.value,
            title: event.target.title.value,
            contactName: event.target.contactName.value,
            contactPhoneNumber: event.target.contactPhoneNumber.value,
            contact_email: event.target.contact_email.value
        });
    }


    return (
        <>
            <Modal.Header closeButton>
                <Modal.Title>Edit Organisation</Modal.Title>
            </Modal.Header>
            <Form id="organisation_claim" onSubmit={modalSubmit}>
                <Modal.Body>
                    <Row className="mb-3">
                    <Form.Group
                        as={Col}
                        style={{
                        display: "flex",
                        "flex-direction": "column",
                        "align-items": "start",
                        }}
                    >
                        <Form.Label htmlFor="name">Organisation Name</Form.Label>
                        <Form.Control
                        type="text"
                        name=""
                        id="name"
                        defaultValue={singleDoc.name}
                        placeholder="Enter plate No."
                        onChange={handleFieldChange}
                        />
                    </Form.Group>
                    </Row>
                    <Row className="mb-3">
                    <Form.Group
                        as={Col}
                        style={{
                        display: "flex",
                        "flex-direction": "column",
                        "align-items": "start",
                        }}
                    >
                        <Form.Label htmlFor="org_email">Organisation Email</Form.Label>
                        <Form.Control
                        type="text"
                        name=""
                        id="org_email"
                        defaultValue={singleDoc.org_email}
                        placeholder="Enter plate No."
                        onChange={handleFieldChange}
                        />
                    </Form.Group>
                    <Form.Group
                        as={Col}
                        style={{
                        display: "flex",
                        "flex-direction": "column",
                        "align-items": "start",
                        }}
                    >
                        <Form.Label htmlFor="tel">Organisation Phone Number</Form.Label>
                        <Form.Control
                        type="text"
                        name=""
                        id="tel"
                        defaultValue={singleDoc.tel}
                        placeholder="Enter phone Number"
                        onChange={handleFieldChange}
                        />
                    </Form.Group>
                    </Row>
                    <Row className="mb-3">
                    <Form.Group
                        as={Col}
                        style={{
                        display: "flex",
                        "flex-direction": "column",
                        "align-items": "start",
                        }}
                    >
                        <Form.Label htmlFor="address">Address</Form.Label>
                        <Form.Control
                        type="text"
                        name=""
                        id="address"
                        placeholder="Enter address"
                        defaultValue={singleDoc.address}
                        onChange={handleFieldChange}
                        />
                    </Form.Group>
                    </Row>
                    <Row className="mb-3">
                    <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label htmlFor='logo'>Logo</Form.Label>
                            <Form.Control id='logo' type="file" defaultValue={singleDoc.logo} onChange={handleFieldChange} />
                    </Form.Group>
                    </Row>
                    <h3>Contact Person</h3>
                    <Form.Group
                        as={Col}
                        style={{
                        display: "flex",
                        "flex-direction": "column",
                        "align-items": "start",
                        }}
                    >
                        <Form.Label htmlFor="role">Contact Role</Form.Label>
                        <Form.Control
                        type="text"
                        name=""
                        id="role"
                        placeholder="Enter role"
                        defaultValue={singleDoc.role}
                        onChange={handleFieldChange}
                        />
                    </Form.Group>
                    
                    <Row>
                        <Form.Group
                            as={Col}
                            style={{
                            display: "flex",
                            "flex-direction": "column",
                            "align-items": "start",
                            }}
                        >
                            <Form.Label htmlFor="title">
                            Title
                            </Form.Label>
                            <Form.Control
                            type="text"
                            name=""
                            id="title"
                            defaultValue={singleDoc.title}
                            placeholder="Enter Claimant's phone number"
                            onChange={handleFieldChange}
                            />
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group
                            as={Col}
                            style={{
                            display: "flex",
                            "flex-direction": "column",
                            "align-items": "start",
                            }}
                        >
                            <Form.Label htmlFor="contactName">
                            Name
                            </Form.Label>
                            <Form.Control
                            type="text"
                            name=""
                            id="contactName"
                            defaultValue={singleDoc.contactName}
                            placeholder="Enter Contact's Name"
                            onChange={handleFieldChange}
                            />
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group
                            as={Col}
                            style={{
                            display: "flex",
                            "flex-direction": "column",
                            "align-items": "start",
                            }}
                        >
                            <Form.Label htmlFor="contactPhoneNumber">
                            Phone Number
                            </Form.Label>
                            <Form.Control
                            type="text"
                            name=""
                            id="contactPhoneNumber"
                            defaultValue={singleDoc.contactPhoneNumber}
                            placeholder="Enter Contact's phone number"
                            onChange={handleFieldChange}
                            />
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group
                            as={Col}
                            style={{
                            display: "flex",
                            "flex-direction": "column",
                            "align-items": "start",
                            }}
                        >
                            <Form.Label htmlFor="contact_email">
                            Email
                            </Form.Label>
                            <Form.Control
                            type="text"
                            name=""
                            id="contact_email"
                            defaultValue={singleDoc.contact_email}
                            placeholder="Enter Contact's email"
                            onChange={handleFieldChange}
                            />
                        </Form.Group>
                    </Row>
                    <Button
                    variant="primary"
                    type="submit"
                    onClick={() => {
                        handleClose();
                    }}
                    id="submit"
                    >
                    Submit
                    </Button>
                </Modal.Body>
                <Modal.Footer></Modal.Footer>
            </Form>
        </>
    )
}

export default OrganisationModal
