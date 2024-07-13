import React, { useState, useEffect } from "react";
import InputMask from 'react-input-mask';
import axios from "axios";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';
import Modal from 'react-bootstrap/Modal';

export default function CreateDistance() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [tableLoading, setTableLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [zipcodeDetails, setZipcodeDetails] = useState([]);
    const [inputs, setInputs] = useState({
        input_zipcode: "",
        input_destination: ""
    });

    useEffect(() => {
        setLoading(false);
    }, []);

    const handleShowModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const getCoordinates = async (zipcode) => {
        try {
            const response = await axios.get(`https://brasilapi.com.br/api/cep/v2/${zipcode}`);
            const { longitude, latitude } = response.data.location.coordinates;
            return { longitude, latitude };
        } catch (error) {
            console.error("Error fetching coordinates:", error);
            return undefined;
        }
    };

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const toRad = (value) => (value * Math.PI) / 180;
        const R = 6371; // Radius of the Earth in kilometers
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return distance;
    };

    const addTableRow = async () => {
        setTableLoading(true);
        const originZipcode = inputs.input_zipcode.replace("-", "") || '-';
        const destinationZipcode = inputs.input_destination.replace("-", "") || '-';
        
        let distanceTotal = '-';
        if (originZipcode !== '-' && destinationZipcode !== '-') {
            try {
                const originCoords = await getCoordinates(originZipcode);
                const destinationCoords = await getCoordinates(destinationZipcode);
                
                if (originCoords && destinationCoords) {
                    distanceTotal = calculateDistance(
                        originCoords.latitude,
                        originCoords.longitude,
                        destinationCoords.latitude,
                        destinationCoords.longitude
                    ).toFixed(2);
                } else {
                    handleShowModal();
                    setInputs((prevInputs) => ({
                        ...prevInputs,
                        input_zipcode: originCoords ? prevInputs.input_zipcode : "",
                        input_destination: destinationCoords ? prevInputs.input_destination : "",
                    }));
                    setTableLoading(false);
                    return;
                }
            } catch (error) {
                console.error("Error fetching distance:", error);
            }
        }

        const table = document.getElementById('distance_details');
        const newRow = table.insertRow(-1);
        const cell1 = newRow.insertCell(0);
        const cell2 = newRow.insertCell(1);
        const cell3 = newRow.insertCell(2);
        const cell4 = newRow.insertCell(3);

        cell1.textContent = table.rows.length;
        cell2.textContent = inputs.input_zipcode;
        cell3.textContent = inputs.input_destination;
        cell4.textContent = distanceTotal + " KMs";

        const productsDistance = {
            origin_zipcode: originZipcode,
            destination_zipcode: destinationZipcode,
            distance: distanceTotal
        };
        
        setZipcodeDetails(prevZipcodeDetails => [...prevZipcodeDetails, productsDistance]);
        setTableLoading(false);
    };

    const handleChange = async (event) => {
        const { name, value } = event.target;
        setInputs(values => ({ ...values, [name]: value }));
        
        if (value.replace(/\D/g, "").length === 8) {
            const zipcode = value.replace(/\D/g, "");
            const coords = await getCoordinates(zipcode);
            
            if (!coords || (coords.longitude === undefined || coords.latitude === undefined)) {
                setInputs(prevInputs => ({
                    ...prevInputs,
                    [name]: ""
                }));
                handleShowModal();
            }
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setSaving(true);

        const data = {
            arr_zipcodes: zipcodeDetails
        };
        api.post('distances', data).then(function(response) {
            navigate('/distances');
        }).finally(() => {
            setSaving(false);
        });
    };

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col>
                    <h1 className="text-center my-5">Create distance</h1>
                </Col>
            </Row>
            {loading ? (
                <Row className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </Row>
            ) : (
                saving ? (
                    <Row className="justify-content-center">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Saving...</span>
                        </Spinner>
                    </Row>
                ) : (
                    <Form id="distanceForm" onSubmit={handleSubmit}>
                        <Row className="justify-content-md-center">
                            <Form.Group className="mb-3 col-6" controlId="distanceForm.input_zipcode">
                                <Form.Label>Zipcode:</Form.Label>
                                <InputMask 
                                    mask="99999-999" 
                                    value={inputs.input_zipcode} 
                                    onChange={handleChange}
                                    name="input_zipcode">
                                    {(inputProps) => <Form.Control {...inputProps} type="text" />}
                                </InputMask>
                            </Form.Group>
                            <Form.Group className="mb-3 col-6" controlId="distanceForm.input_destination">
                                <Form.Label>Destination:</Form.Label>
                                <InputMask 
                                    mask="99999-999" 
                                    value={inputs.input_destination} 
                                    onChange={handleChange}
                                    name="input_destination">
                                    {(inputProps) => <Form.Control {...inputProps} type="text" />}
                                </InputMask>
                            </Form.Group>
                        </Row>
                        <Row className="row row-cols-auto justify-content-end my-5">
                            <Col>
                                <Button variant="outline-info" type="button" id="add_distance" onClick={addTableRow}>Add</Button>
                            </Col>
                        </Row>
                        <hr />
                        <Row className="row row-cols-auto justify-content-end my-5">
                            <Table striped bordered hover variant="dark" id="distance_details">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Origin Zipcode</th>
                                        <th>Destination Zipcode</th>
                                        <th>Distance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableLoading ? (
                                        <tr>
                                            <td colSpan="4" className="text-center">
                                                <Spinner animation="border" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </Spinner>
                                            </td>
                                        </tr>
                                    ) : null}
                                </tbody>
                            </Table>
                        </Row>
                        <Row className="row row-cols-auto justify-content-end">
                            <Col>
                                <Button variant="outline-success" type="submit">Save</Button>
                            </Col>
                        </Row>
                    </Form>
                )
            )}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Error BrasilApi</Modal.Title>
                </Modal.Header>
                <Modal.Body>The API presented an error when retrieving the latitude and longitude of the zip code entered.</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
}
