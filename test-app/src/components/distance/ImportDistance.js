import React, { useState, useEffect } from "react";
import axios from "axios";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import Papa from 'papaparse';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';

export default function ImportDistance() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [tableLoading, setTableLoading] = useState(false);
    const [zipcodeDetails, setZipcodeDetails] = useState([]);
    const [zipcodeSaveDetails, setZipcodeSaveDetails] = useState([]);

    useEffect(() => {
        setLoading(false);
    }, []);

    const formatZipcode = (zipcode) => {
        const cleanZipcode = zipcode.replace(/\D/g, "");
        return cleanZipcode.length === 8 ? `${cleanZipcode.slice(0, 5)}-${cleanZipcode.slice(5)}` : cleanZipcode;
    };

    // Função para ler o arquivo CSV e atualizar o estado
    const addCsvTable = (event) => {
        const file = document.getElementById('inputFile').files[0];
        if (!file) return;

        Papa.parse(file, {
            header: true,
            complete: (results) => {
                const data = results.data;
                
                const arr_zipcodes = data.map(row => ({
                    origin_zipcode: row[Object.keys(row)[0]],
                    destination_zipcode: row[Object.keys(row)[1]],
                }));

                setZipcodeDetails(arr_zipcodes);
                // Adiciona novas linhas à tabela
                populateTable(arr_zipcodes);
            },
        });
    };

    // Função para adicionar linhas na tabela utilizando os dados do CSV
    const populateTable = (arr_zipcodes) => {
        arr_zipcodes.forEach((zipcodeDetail, index) => {
            addTableRow(zipcodeDetail.origin_zipcode, zipcodeDetail.destination_zipcode);
        });
    };

    // Função para obter as coordenadas com base no CEP
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

    // Função para calcular a distância entre duas coordenadas
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const toRad = (value) => (value * Math.PI) / 180;
        const R = 6371; // Raio da Terra em quilômetros
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

    // Função para adicionar uma nova linha à tabela
    const addTableRow = async (originZipcode, destinationZipcode) => {
        setTableLoading(true);
        
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

        cell1.textContent = table.rows.length - 1; // Ajuste para número correto da linha
        cell2.textContent = formatZipcode(originZipcode);
        cell3.textContent = formatZipcode(destinationZipcode);
        cell4.textContent = distanceTotal + " KMs";

        const productsDistance = {
            origin_zipcode: originZipcode.replace(/\D/g, ""),
            destination_zipcode: destinationZipcode.replace(/\D/g, ""),
            distance: distanceTotal
        };
        
        setZipcodeSaveDetails(prevZipcodeSaveDetails => [...prevZipcodeSaveDetails, productsDistance]);
        setTableLoading(false);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setSaving(true);

        const data = {
            arr_zipcodes: zipcodeSaveDetails
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
                    <h1 className="text-center my-5">Import distance</h1>
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
                            <Form.Group className="my-5 col-5">
                                <Form.Control 
                                    id="inputFile"
                                    type="file"
                                    label="CSV File"
                                    help="Input your CSV File."
                                    name="input_file" placeholder="CSV File"
                                />
                            </Form.Group>
                            <Col className="col-1 text-end my-5">
                                <Button variant="outline-info" type="button" id="add_distance" onClick={addCsvTable}>Add</Button>
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
        </Container>
    )
}
