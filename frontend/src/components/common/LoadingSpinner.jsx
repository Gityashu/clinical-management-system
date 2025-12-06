import { Spinner, Container } from 'react-bootstrap';

export default function LoadingSpinner() {
  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="text-center">
        <Spinner animation="border" role="status" className="mb-3">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="text-muted">Loading...</p>
      </div>
    </Container>
  );
}
