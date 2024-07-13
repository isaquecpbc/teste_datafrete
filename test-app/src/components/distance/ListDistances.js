import { useEffect, useState } from "react";
import api from "../../services/api";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ZipCodeFormatter from '../utils/ZipCodeFormatter';

export default function ListDistances() {

    const [distances, setDistances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedDistanceId, setSelectedDistanceId] = useState(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        getDistances();
    }, []);

    function getDistances() {
        setLoading(true);
        api.get('distances/').then(function(response) {
            console.log(response.data.message);
            setDistances(response.data.data);
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });
    }

    const handleDeleteClick = (id) => {
        setSelectedDistanceId(id);
        setShowModal(true);
    }

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedDistanceId(null);
    }

    const handleConfirmDelete = () => {
        setDeleting(true);
        api.delete(`distances/${selectedDistanceId}`).then(function(response){
            console.log(response.data.message);
            getDistances();
            handleCloseModal();
        }).finally(() => {
            setDeleting(false);
        });
    }

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col>
                    <h1 className="text-center my-5">List distances</h1>
                </Col>
            </Row>
            <Row>
                <Table striped bordered hover variant="dark">
                    <thead>
                        <tr>
                        <th>#</th>
                        <th>Zip Code</th>
                        <th>Destination</th>
                        <th>Distance</th>
                        <th className="text-center">-</th>
                        </tr>
                    </thead>
                    <tbody>
            {loading ? (
                <tr className="justify-content-center align-items-center">
                    <td className="text-center" colSpan={5}>
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </td>
                </tr>
            ) : (
                distances.map((distance, key) =>
                    <tr key={key}>
                        <td>{distance.id}</td>
                        <td><ZipCodeFormatter zipcode={distance.origin_zipcode} /></td>
                        <td><ZipCodeFormatter zipcode={distance.destination_zipcode} /></td>
                        <td>{distance.distance} KMs</td>
                        <td className="text-center">
                            <Button 
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDeleteClick(distance.id)}
                            >Delete</Button>
                        </td>
                    </tr>
                )
            )}
                    </tbody>
                </Table>
            </Row>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this customer?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal} disabled={deleting}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={() => handleConfirmDelete(selectedDistanceId)} disabled={deleting}>
                        {deleting ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Delete'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
}
