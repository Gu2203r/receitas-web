
const API_BASE_URL = 'http://localhost:8080/';

function verificarAutenticacao(response) {
    if (response.status === 401) {
        sessionStorage.removeItem('autenticado');
        window.location.href = 'login.html';
        throw new Error('Sessão expirada ou não autorizada.');
    }
    return response;
}