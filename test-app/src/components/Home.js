import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CustomCallout from './utils/CustomCallout';

export default function ListProduct() {

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col>
                    <h1 className="text-center my-5">Welcome!</h1>
                </Col>
            </Row>
            <Row className="justify-content-md-center">
                <Col>
                    <p className="text-start">Seja bem vindo ao projeto de: </p>
                    <CustomCallout variant="info">
                        <strong>Desafio técnico</strong> - Teste de CRUD de distância entre CEPs.
                    </CustomCallout>
                    <hr />
                    <CustomCallout variant="warning">
                        <strong>Arquivo collection para a API</strong> - disponivel no diretório raiz do projeto, use-o para importar no POSTMAN.
                    </CustomCallout>
                    <hr />
                    <CustomCallout variant="danger">
                        <strong>Arquivo CSV exemplo</strong> - disponivel no diretório raiz do projeto, use-o para importar no menu "Import".
                    </CustomCallout>
                </Col>
            </Row>
        </Container>
    )
}
